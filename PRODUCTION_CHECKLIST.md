# ✅ Production Checklist - Sanctum

## Antes de publicar en internet

### 1️⃣ Code & Build
- [ ] `npm run build` sin errores
- [ ] No hay console.log() innecesarios
- [ ] No hay credenciales en el código
- [ ] Git está inicializado: `git init`
- [ ] `.env` está en `.gitignore`
- [ ] `.env.example` creado con variables de ejemplo

### 2️⃣ Configuración
- [ ] Archivo `.env.production` con valores reales
- [ ] `CLIENT_ORIGIN` apunta al dominio real
- [ ] `NODE_ENV=production`
- [ ] Puerto configurado (3001 o variable)
- [ ] CORS configurado correctamente

### 3️⃣ Base de Datos
- [ ] SQLite inicializada
- [ ] Datos demo/de prueba removidos (si aplica)
- [ ] Respaldos documentados
- [ ] Migración lista: `npm run db:reset`

### 4️⃣ Seguridad
- [ ] JWT_SECRET generado y fuerte
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] Contraseñas por defecto removidas o cambiadas
- [ ] HTTPS/SSL configurado
- [ ] Headers de seguridad añadidos

### 5️⃣ Documentación
- [ ] README.md completo
- [ ] DEPLOYMENT.md incluido
- [ ] Variables de entorno documentadas
- [ ] Instrucciones de instalación claras

### 6️⃣ Testing
- [ ] Login funciona
- [ ] Crear paciente/psicólogo funciona
- [ ] CRUD de datos funciona
- [ ] Calendario navega correctamente
- [ ] Logo se ve en todas las páginas

### 7️⃣ Performance
- [ ] Build optimizado: `npm run build`
- [ ] Assets comprimidos
- [ ] CDN configurado (opcional)
- [ ] Imágenes optimizadas

### 8️⃣ Monitoreo
- [ ] Logs configurados
- [ ] Error tracking listo (Sentry, etc - opcional)
- [ ] Uptime monitoring (UptimeRobot - libre)
- [ ] Alertas configuradas

---

## 🚀 Deployment Step-by-Step

### Opción A: Render.com (⭐ Recomendado - Gratis)

```bash
# 1. Push a GitHub
git add .
git commit -m "Production ready"
git push origin main

# 2. En render.com:
# - New → Web Service
# - Conecta tu repo GitHub
# - Build: npm run install:all && npm run build
# - Start: npm start
# - Agrega variables en Settings → Environment

# 3. Deploy
# - Click Deploy
# - Espera 2-5 minutos
```

**Resultado:** `https://tu-app-name.onrender.com` ✅

### Opción B: Heroku (Alternativa)

```bash
npm install -g heroku
heroku login
heroku create sanctum-app
git push heroku main
```

### Opción C: VPS Linux (Control total)

Ver `DEPLOYMENT.md` → VPS Section

---

## 🔍 Post-Deployment

- [ ] App accesible en `https://tu-dominio.com`
- [ ] Login con test account funciona
- [ ] HTTPS redirecciona correctamente
- [ ] Logo visible en todas las páginas
- [ ] Calendario navega entre meses
- [ ] APIs responden sin CORS errors
- [ ] Base de datos persiste datos
- [ ] Mobile se ve correctamente

---

## 📊 URLs Útiles

| Servicio | URL |
|----------|-----|
| Render | https://render.com |
| Heroku | https://heroku.com |
| Let's Encrypt | https://letsencrypt.org |
| GitHub | https://github.com |
| UptimeRobot | https://uptimerobot.com |

---

## 🆘 Si algo falla

1. **Verifica logs:**
   ```bash
   # Render: Dashboard → Logs
   # Heroku: heroku logs --tail
   # VPS: pm2 logs sanctum
   ```

2. **Diagnóstico:**
   ```bash
   # ¿API responde?
   curl https://tu-app.com/api/health
   
   # ¿CORS OK?
   curl -H "Origin: https://tu-app.com" https://tu-app.com/api/health
   ```

3. **Reinicia:**
   ```bash
   # Render: Redeploy
   # Heroku: heroku restart
   # VPS: pm2 restart sanctum
   ```

---

**¡Felicidades! 🎉 Tu app está en vivo.**

Para mantenerla:
- Monitorea con UptimeRobot (alertas si cae)
- Revisa logs semanalmente
- Haz backup de BD mensualmente
- Actualiza dependencias cada trimestre
