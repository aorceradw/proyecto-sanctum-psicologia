#!/bin/bash
# setup-production.sh - Script de setup para producción

echo "🚀 Setup de Sanctum para Producción"
echo "=================================="

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Instalar dependencias
echo ""
echo "📦 Instalando dependencias..."
npm run install:all

# Build
echo ""
echo "🔨 Compilando para producción..."
npm run build:prod

# Crear .env si no existe
if [ ! -f server/.env ]; then
    echo ""
    echo "📝 Creando archivo .env..."
    cp .env.example server/.env
    echo "⚠️  Edita server/.env con tus variables reales"
fi

# Verificación final
echo ""
echo "✅ Setup completado!"
echo ""
echo "Próximos pasos:"
echo "1. Edita server/.env con tus valores reales"
echo "2. npm start (para iniciar)"
echo "3. Abre http://localhost:3001"
echo ""
echo "Para deployment, ver DEPLOYMENT.md"
