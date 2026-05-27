#!/bin/bash

# build-deploy.sh - Script unificado de compilación y deployment
# Uso: ./build-deploy.sh [usuario@host:/path]

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🏗️  Sanctum - Build & Deployment Script${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 1. Verificar Node.js
echo -e "${YELLOW}✓ Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
  echo -e "${RED}✗ Node.js no está instalado${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v) detectado${NC}"
echo ""

# 2. Limpiar builds anteriores
echo -e "${YELLOW}🧹 Limpiando builds anteriores...${NC}"
rm -rf client/dist 2>/dev/null || true
echo -e "${GREEN}✓ Limpieza completada${NC}"
echo ""

# 3. Instalar dependencias
echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
npm run install:all 2>&1 | grep -v "npm warn" || true
echo -e "${GREEN}✓ Dependencias instaladas${NC}"
echo ""

# 4. Compilar cliente
echo -e "${YELLOW}🔨 Compilando cliente...${NC}"
npm run build --prefix client
echo -e "${GREEN}✓ Cliente compilado${NC}"
echo ""

# 5. Verificar build
if [ ! -d "client/dist" ]; then
  echo -e "${RED}✗ Error: No se encontró client/dist${NC}"
  exit 1
fi

DIST_SIZE=$(du -sh client/dist | cut -f1)
echo -e "${GREEN}✓ Tamaño del build: ${DIST_SIZE}${NC}"
echo ""

# 6. Deployment (opcional)
if [ -z "$1" ]; then
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GREEN}✅ BUILD COMPLETADO${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo "Para desplegar en servidor:"
  echo "  ./build-deploy.sh user@192.168.2.150:/path/to/app"
  echo ""
  exit 0
fi

echo -e "${YELLOW}📤 Desplegando en servidor: $1${NC}"
rsync -avz --delete . "$1" 2>&1 | tail -20
echo ""

# 7. Ejecutar en servidor (opcional)
if command -v ssh &> /dev/null; then
  HOST=$(echo "$1" | cut -d: -f1)
  PATH=$(echo "$1" | cut -d: -f2)
  
  echo -e "${YELLOW}🚀 Iniciando en servidor...${NC}"
  ssh "$HOST" "cd $PATH && npm install --prefix server && npm start &"
  echo ""
  echo -e "${GREEN}✓ Servidor iniciado${NC}"
  echo -e "${BLUE}✓ Acceder a: http://192.168.2.150:3001${NC}"
else
  echo ""
  echo -e "${YELLOW}⚠️  Para iniciar el servidor, ejecuta en ${1%:*}:${NC}"
  echo "  cd ${1#*:}"
  echo "  npm install --prefix server"
  echo "  npm start"
fi
echo ""
