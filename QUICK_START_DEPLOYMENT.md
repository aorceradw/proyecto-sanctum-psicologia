# 🌍 Sanctum - Subir a Internet - Guía Rápida

## ⚡ En 5 minutos - Opción Render.com (Recomendada)

### Paso 1: Prepara tu código
```bash
cd tu-carpeta-sanctum
npm run build
```

### Paso 2: Sube a GitHub
```bash
git init
git add .
git commit -m "Listo para producción"
git remote add origin https://github.com/tu-usuario/sanctum-app.git
git push -u origin main
```

### Paso 3: Deploy en Render.com (Gratis)

1. **Crea cuenta:** https://render.com (con GitHub)
2. **Nuevo Web Service:**
   - Repo: `sanctum-app`
   - Name: `sanctum-app`
   - Environment: `Node`
   - Build: `npm run install:all && npm run build`
   - Start: `npm start`
3. **Variables de entorno (Settings → Environment):**
   ```
   NODE_ENV = production
   PORT = 3001
   CLIENT_ORIGIN = https://tu-app-name.onrender.com
   RENDER_EXTERNAL_URL = https://tu-app-name.onrender.com
   ```
4. **Deploy** - ¡Listo! En 2-5 minutos estará en vivo.

**URL pública:** `https://tu-app-name.onrender.com` ✅

---

## 📋 Archivos de Ayuda

Hemos creado estos archivos para ti:

| Archivo | Para qué |
|---------|----------|
| `DEPLOYMENT.md` | Instrucciones detalladas de todas las opciones |
| `PRODUCTION_CHECKLIST.md` | Lista de verificación antes de publicar |
| `.env.example` | Copiar y rellenar para tu servidor |
| `Dockerfile` | Para Docker/Render |
| `setup-production.sh` | Script automático de setup |

---

## 🎯 Alternativas Rápidas

### Heroku ($ pero fácil)
```bash
heroku create sanctum-app
git push heroku main
```

### GitHub Pages (Solo frontend, gratis)
Solo el cliente estático sin API backend

### Vercel (Frontend + API, gratis)
Requiere refactor a Edge Functions

---

## ❓ Preguntas

**P: ¿Cuesta dinero?**  
R: Render.com tier gratuito es suficiente para empezar. Si crece el uso, ~$10/mes.

**P: ¿Mis datos estarán seguros?**  
R: SQLite está en el servidor. Configura backups en Render (Settings).

**P: ¿Puedo usar mi dominio personalizado?**  
R: Sí. En Render → Settings → Custom Domain. Apunta tu DNS.

**P: ¿Necesito cambiar código?**  
R: No. El código está listo para producción.

---

## 🚀 ¡A Por Ello!

Lee **DEPLOYMENT.md** para instrucciones completas.  
Lee **PRODUCTION_CHECKLIST.md** antes de publicar.

Estamos aquí para ayudarte 💪
