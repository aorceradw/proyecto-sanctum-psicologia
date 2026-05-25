# 🚀 Guía de Deployment - Sanctum

## Preparación Local

1. **Build de producción:**
   ```bash
   npm run build
   ```
   Esto genera `/client/dist` con los archivos estáticos optimizados.

2. **Variables de entorno:**
   - Copia `.env.example` a `.env`
   - Actualiza los valores para tu entorno

3. **Prueba local:**
   ```bash
   npm start
   ```
   La aplicación correrá en `http://localhost:3001`

---

## 🌐 Opción 1: Render.com (Recomendado)

### Pasos:

1. **Crea cuenta en [render.com](https://render.com)**

2. **Conecta tu repositorio GitHub**
   - Ve a Dashboard → New → Web Service
   - Selecciona tu repo de Sanctum

3. **Configura la aplicación:**
   - **Name:** `sanctum-app` (o tu nombre preferido)
   - **Environment:** Node
   - **Build Command:** `npm run install:all && npm run build`
   - **Start Command:** `npm start`
   - **Node Version:** 22

4. **Agrega variables de entorno:**
   ```
   NODE_ENV = production
   PORT = 3001
   CLIENT_ORIGIN = https://tu-app-name.onrender.com
   RENDER_EXTERNAL_URL = https://tu-app-name.onrender.com
   ```

5. **Deploy:**
   - Click en "Deploy"
   - Espera a que termine (2-5 minutos)

**URL pública:** `https://tu-app-name.onrender.com`

---

## 🐳 Opción 2: Docker + Vercel/Heroku

### Con Docker:

```bash
# Build imagen
docker build -t sanctum .

# Ejecutar
docker run -p 3001:3001 -e NODE_ENV=production sanctum
```

### Heroku:
```bash
heroku create tu-app-name
heroku config:set NODE_ENV=production
git push heroku main
```

---

## ☁️ Opción 3: VPS (DigitalOcean, Linode, AWS EC2)

### Instalación en servidor Linux:

```bash
# 1. SSH al servidor
ssh root@tu-ip-publica

# 2. Instala Node.js
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Clona el repositorio
git clone https://github.com/tu-usuario/sanctum-app.git
cd sanctum-app

# 4. Instala dependencias
npm run install:all

# 5. Build
npm run build

# 6. Configura PM2 (para ejecutar como daemon)
npm install -g pm2
pm2 start "npm start" --name sanctum
pm2 startup
pm2 save

# 7. Configura Nginx como reverse proxy
sudo apt-get install -y nginx

# Crea archivo de config en /etc/nginx/sites-available/sanctum:
server {
    listen 80;
    server_name tu-dominio.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

sudo ln -s /etc/nginx/sites-available/sanctum /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 8. SSL con Let's Encrypt (HTTPS)
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

---

## 📋 Checklist Pre-Deployment

- ✅ Build sin errores: `npm run build`
- ✅ `.env.example` incluido
- ✅ `NODE_ENV=production`
- ✅ `CLIENT_ORIGIN` configurado correctamente
- ✅ Base de datos SQLite inicializada
- ✅ HTTPS/SSL habilitado (en producción)
- ✅ Logs configurados
- ✅ Respaldos de BD programados

---

## 🔒 Consideraciones de Seguridad

1. **Genera un JWT_SECRET fuerte:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Protege variables de entorno:**
   - Nunca comitas `.env` a git
   - Usa secretos del servicio de hosting

3. **CORS:**
   - Usa tu dominio exacto en `CLIENT_ORIGIN`
   - Nunca uses `*` en producción

4. **HTTPS:**
   - Obliga redirección HTTP → HTTPS
   - Usa certificados válidos (Let's Encrypt es gratis)

5. **Database:**
   - Programa respaldos regulares
   - Restringe acceso al puerto 3001

---

## 📊 Monitoreo

- **Render.com:** Dashboard nativo de logs
- **Heroku:** `heroku logs --tail`
- **VPS:** `pm2 logs sanctum` o `tail -f /var/log/sanctum.log`

---

## ❓ Preguntas Frecuentes

**P: ¿Necesito una base de datos externa?**
R: No, SQLite está incluida. Funciona en un solo archivo.

**P: ¿Qué pasa con los datos cuando actualizo?**
R: Los datos persisten en `/server/db/sanctum.db`. En VPS, configura respaldos.

**P: ¿Puedo usar un dominio personalizado?**
R: Sí. Cada servicio tiene opción de custom domain. Apunta tu DNS al servidor.

**P: ¿Cuánto cuesta?**
R: Render.com tiene tier gratuito. VPS cuesta $3-5/mes. Heroku cambió su modelo.

---

## 🆘 Troubleshooting

```bash
# Error: "PORT 3001 already in use"
lsof -i :3001
kill -9 <PID>

# Error: "Client origin not allowed"
Verifica CLIENT_ORIGIN en .env

# Error: "Database locked"
Reinicia la aplicación: pm2 restart sanctum

# Error: "ENOENT: no such file or directory"
Asegúrate que /client/dist existe: npm run build
```

---

Listo para ir en vivo! 🎉
