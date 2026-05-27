# 🚀 Guía de Despliegue - Sanctum en 192.168.2.150

## ⚡ Inicio Rápido (5 minutos)

### Paso 1: En tu máquina local

```bash
# Construir para producción
npm run build:prod

# Copiar al servidor
rsync -avz --delete . user@192.168.2.150:/home/user/sanctum-app
```

### Paso 2: En el servidor (192.168.2.150)

```bash
ssh user@192.168.2.150
cd /home/user/sanctum-app

# Instalar deps del servidor
npm install --prefix server

# Copiar configuración de producción
cp .env.production .env

# Iniciar
npm start
```

✅ Acceder a: **http://192.168.2.150:3001**

---

## 📋 Requisitos

- Node.js >= 22.5.0
- npm >= 10.0.0
- SQLite3 (incluido)
- Acceso SSH al servidor (opcional, para automatizar)

---

## 📁 Estructura del Proyecto

```
sanctum-app/
├── client/               # Frontend React + Vite
│   ├── src/             # Código fuente
│   ├── dist/            # Build producción (generado)
│   ├── .env.production  # Variables de producción
│   └── package.json
├── server/              # Backend Express
│   ├── index.js         # Servidor principal
│   ├── db/              # Base de datos SQLite
│   ├── routes/          # Rutas API
│   └── package.json
├── .env.production      # Variables servidor
├── package.json         # Monorepo raíz
└── docker-compose.yml   # Para Docker (opcional)
```

---

## 🔧 Configuración

### Variables de Entorno (.env.production)

```env
NODE_ENV=production
PORT=3001
HOST=0.0.0.0
CLIENT_ORIGIN=http://192.168.2.150:3001
```

### Client (.env.production)

```env
VITE_API_URL=http://192.168.2.150:3001
```

---

## 🎯 Deployment Completo

### Opción A: Manual (Recomendado para pruebas)

```bash
# Local
npm run install:all
npm run build

# Copiar al servidor
rsync -avz --delete . user@192.168.2.150:/path/to/app/

# En servidor
npm install --prefix server
npm start
```

### Opción B: Script Automatizado

```bash
# Local
./build-deploy.sh user@192.168.2.150:/path/to/app/
```

### Opción C: Docker

```bash
# En servidor
docker-compose up -d
```

---

## ✅ Verificación

```bash
# Desde cualquier máquina en la red
curl http://192.168.2.150:3001/api/health

# Respuesta esperada:
# {"status":"ok","app":"Sanctum API","database":true,"environment":"production"}
```

---

## 🔒 Seguridad

- ✅ JWT para autenticación
- ✅ CORS configurado para 192.168.2.150
- ✅ Contraseñas con bcrypt
- ✅ Variables de entorno protegidas (.env en .gitignore)
- ✅ Base de datos encriptada

---

## 🛠️ Troubleshooting

### Puerto 3001 ocupado

```bash
# En el servidor
npm run free-port
# O cambiar en .env: PORT=3002
```

### No puede conectar desde otra máquina

```bash
# Verificar que escucha en 0.0.0.0
netstat -tlnp | grep 3001

# Verificar firewall
sudo ufw allow 3001/tcp
```

### CORS errors

- ✅ Verificar `.env.production`: `CLIENT_ORIGIN=http://192.168.2.150:3001`
- ✅ Verificar `client/.env.production`: `VITE_API_URL=http://192.168.2.150:3001`

### Base de datos corrupta

```bash
npm run db:reset --prefix server
```

---

## 📊 Scripts npm Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Ejecutar en desarrollo (cliente + servidor) |
| `npm run build:prod` | Compilar para producción |
| `npm start` | Iniciar servidor |
| `npm run install:all` | Instalar todas las dependencias |
| `npm run db:reset` | Resetear base de datos |
| `npm run free-port` | Liberar puerto |

---

## 🐳 Alternativa: Docker

```bash
# Construir imagen
docker build -t sanctum:latest .

# Ejecutar contenedor
docker run -d -p 3001:3001 --name sanctum sanctum:latest

# O usar docker-compose
docker-compose up -d
```

---

## 🚀 Escalado Futuro

Para producción completa:

1. PostgreSQL en lugar de SQLite
2. PM2 o systemd para gestión de procesos
3. Nginx como reverse proxy
4. SSL/TLS con Let's Encrypt
5. Redis para caché y sesiones
6. Logs centralizados
7. Monitoreo y alertas

---

## 📞 Soporte Rápido

- **API Health**: `curl http://192.168.2.150:3001/api/health`
- **Logs**: `tail -f /var/log/sanctum.log` (si está configurado)
- **Reiniciar**: `npm start` (si no usa PM2)
- **Parar**: `Ctrl+C` en terminal o `pm2 stop sanctum-api`
