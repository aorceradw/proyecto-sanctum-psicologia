# 🏥 Sanctum - Portal de Bienestar Terapéutico

Sistema integral de comunicación y seguimiento clínico entre pacientes y psicólogos.

## 🎯 Características

- **Panel de Pacientes**: Diario personal, seguimiento de ánimo, tareas terapéuticas
- **Panel de Psicólogos**: Gestión de pacientes, seguimiento clínico, alertas de riesgo
- **Autenticación Segura**: JWT + bcrypt
- **Base de Datos**: SQLite (local, portable)
- **Interfaz Moderna**: React 19 + Framer Motion + Tailwind CSS
- **Responsive**: Mobile-first design

## ⚡ Inicio Rápido

### Desarrollo Local

```bash
# Instalar dependencias
npm run install:all

# Ejecutar en desarrollo
npm run dev

# Acceder a:
# Frontend: http://localhost:5173
# API: http://localhost:3001
```

### Producción (192.168.2.150)

```bash
# Compilar
npm run build:prod

# Copiar al servidor
rsync -avz --delete . user@192.168.2.150:/path/to/sanctum-app

# En servidor: Instalar y ejecutar
npm install --prefix server
npm start

# Acceder a: http://192.168.2.150:3001
```

## 📚 Documentación

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guía completa de despliegue
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Información archivada (ver DEPLOYMENT.md)
- **[COMO-FUNCIONA.md](./COMO-FUNCIONA.md)** - Funcionamiento técnico

## 📁 Estructura

```
sanctum-app/
├── client/          # Frontend React + Vite
├── server/          # Backend Express + SQLite
├── scripts/         # Utilidades
├── .env.*           # Configuraciones
├── build-deploy.sh  # Script de deployment
└── DEPLOYMENT.md    # Guía de despliegue
```

## 🛠️ Scripts npm

```bash
npm run dev              # Desarrollo
npm run build           # Compilar cliente
npm run build:prod      # Build producción completo
npm start               # Iniciar servidor
npm run install:all     # Instalar todas las deps
npm run db:reset        # Resetear base de datos
npm run free-port       # Liberar puerto 3001
```

## 🔧 Configuración

### Variables de Entorno

**`.env.production`** (servidor)
```env
NODE_ENV=production
PORT=3001
HOST=0.0.0.0
CLIENT_ORIGIN=http://192.168.2.150:3001
```

**`client/.env.production`** (cliente)
```env
VITE_API_URL=http://192.168.2.150:3001
```

## 🚀 Despliegue Automático

```bash
# Script unificado
./build-deploy.sh user@192.168.2.150:/path/to/app
```

## 🐳 Docker (Alternativa)

```bash
docker-compose up -d
# Acceder a: http://localhost:3001
```

## 🔒 Seguridad

- ✅ Autenticación JWT
- ✅ Contraseñas bcrypt
- ✅ CORS configurado
- ✅ Variables .env protegidas
- ✅ SQLite encriptado

## 📊 Stack Tecnológico

**Frontend:**
- React 19
- Vite
- TypeScript
- Tailwind CSS
- Framer Motion

**Backend:**
- Express.js
- SQLite3
- JWT
- bcryptjs

**DevOps:**
- Docker
- Node.js 22.5+
- npm

## ✅ Verificación

```bash
curl http://192.168.2.150:3001/api/health
# {"status":"ok","app":"Sanctum API","database":true,"environment":"production"}
```

## 📞 Soporte

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para troubleshooting y más información.

---

**Versión**: 1.0.0  
**Licencia**: Propietaria  
**Última actualización**: May 2026
