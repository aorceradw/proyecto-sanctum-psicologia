# 🚀 GitHub + Vercel/Netlify - Guía Completa

## ⚠️ Consideración Importante

Tu proyecto tiene **frontend + backend**:
- **Frontend:** React/Vite (estático) ✅ Vercel/Netlify
- **Backend:** Node.js/Express + SQLite (dinámico) ⚠️ Requiere servidor

### Opciones Reales:

#### ✅ **Opción A: Frontend en Vercel/Netlify + Backend Separado** (RECOMENDADO)
- Frontend: Vercel o Netlify (gratis)
- Backend: Render.com, Railway, o DigitalOcean (gratis o $5/mes)

#### ✅ **Opción B: Todo en Vercel con Funciones Serverless**
- Requiere refactor del backend a Edge Functions
- Complejidad media

#### ❌ **Opción C: Todo en Netlify**
- Netlify es solo frontend (mejor)
- Backend necesita ir a otro lugar

---

## 📋 PASO 1: Preparar GitHub

### 1.1 Instalar Git (si no lo tienes)
```bash
# Windows: Descarga desde https://git-scm.com/
# macOS: brew install git
# Linux: sudo apt install git
```

### 1.2 Configurar Git
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### 1.3 Crear repo en GitHub
1. Ve a https://github.com/new
2. **Repository name:** `sanctum-app`
3. **Description:** "Sanctum - Portal de bienestar terapéutico"
4. ☐ Public (para que vean tu código)
5. Click "Create repository"

### 1.4 Subir código a GitHub
```bash
cd tu-carpeta-sanctum-app

# Inicializar git
git init
git add .
git commit -m "Initial commit: Sanctum app ready for production"

# Agregar origen remoto (copia tu URL de GitHub)
git remote add origin https://github.com/TU-USUARIO/sanctum-app.git

# Cambiar rama a main
git branch -M main

# Subir
git push -u origin main
```

**Listo!** Tu código está en GitHub 🎉

---

## 🚀 PASO 2: Deploy del Frontend

### Opción A: Vercel (Recomendado)

#### 2A.1 Crear cuenta Vercel
1. Ve a https://vercel.com
2. Click "Sign Up"
3. Conecta con GitHub (autoriza)
4. Importa repositorio `sanctum-app`

#### 2A.2 Configurar proyecto
- **Project name:** `sanctum-app`
- **Framework:** Vite
- **Build Command:** `npm run install:all && npm run build`
- **Output Directory:** `client/dist`
- **Environment Variables:**
  ```
  VITE_API_URL = https://tu-backend-url.com/api
  ```

#### 2A.3 Deploy
- Click "Deploy"
- Espera 2-3 minutos
- Tu app estará en: `https://sanctum-app.vercel.app`

---

### Opción B: Netlify (Alternativa)

#### 2B.1 Crear cuenta Netlify
1. Ve a https://netlify.com
2. Click "Sign up"
3. Conecta GitHub (autoriza)

#### 2B.2 Crear sitio nuevo
1. Click "New site from Git"
2. Selecciona repositorio `sanctum-app`
3. **Build command:** `npm run install:all && npm run build`
4. **Publish directory:** `client/dist`

#### 2B.3 Deploy
- Click "Deploy site"
- Espera 3-5 minutos
- Tu app: `https://sanctum-app.netlify.app`

---

## 🔌 PASO 3: Deploy del Backend

**IMPORTANTE:** Vercel/Netlify no pueden ejecutar un servidor Node.js tradicional.

### Opción Recomendada: Render.com + Frontend Vercel

```bash
# 1. Backend en Render (gratis)
# - Ver DEPLOYMENT.md → Render.com section
# - Tu API estará en: https://sanctum-backend.onrender.com

# 2. Actualizar frontend para apuntar al backend
# En Vercel/Netlify → Settings → Environment Variables
VITE_API_URL = https://sanctum-backend.onrender.com/api
```

### Alternativa: Railway.app
```bash
# Similar a Render pero con diferentes límites
# https://railway.app - UI más moderna
```

---

## 🔄 PASO 4: Conectar Frontend ↔ Backend

### Actualizar variable de entorno en frontend

En tu archivo `client/src/api/api.ts`:
```typescript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

Esto hace que:
- **Desarrollo local:** usa `http://localhost:3001/api`
- **Producción:** usa `https://tu-backend-url.com/api`

### Variables en Vercel/Netlify:
```
VITE_API_URL = https://tu-backend.onrender.com/api
```

---

## 📊 Arquitectura Final

```
┌─────────────────────────────────────────────┐
│ Tu Dominio (opcional)                       │
│ ejemplo.com                                 │
└──────────────┬────────────────────────────┘
               │
      ┌────────┴────────┐
      │                 │
      ▼                 ▼
┌─────────────┐  ┌──────────────┐
│  Vercel     │  │  Render.com  │
│  Frontend   │  │  Backend     │
│ (React/CSS) │  │ (Node.js/API)│
│  Static     │  │  Dinámico    │
└─────────────┘  └──────────────┘
   ~50MB            SQLite DB
   Gratis          Gratis/mes
```

---

## 🎯 Checklist Antes de Deploy

```bash
✅ Git config: git config --global user.name "..."
✅ Repo creado en GitHub
✅ Código pusheado: git push origin main
✅ Build compila: npm run build ✓
✅ Vercel/Netlify cuenta creada
✅ Backend listo en Render.com
✅ VITE_API_URL configurada
✅ API endpoint probado
✅ CORS configurado en backend
```

---

## 🧪 Testing Post-Deploy

```bash
# 1. Verifica frontend carga
curl https://tu-app.vercel.app/

# 2. Verifica API responde
curl https://tu-backend.onrender.com/api/health

# 3. Verifica CORS
curl -H "Origin: https://tu-app.vercel.app" \
     https://tu-backend.onrender.com/api/health

# 4. Prueba login en la app
# - Ve a https://tu-app.vercel.app/login
# - Usa test account: doctor@sanctum.health / sanctum123
# - Verifica que funcione todo
```

---

## 🔧 Actualizar Código Después del Deploy

```bash
# Hacer cambios localmente
# Editar archivos...

# Subir a GitHub
git add .
git commit -m "Descripción del cambio"
git push origin main

# Vercel/Netlify automáticamente redeploya
# Render.com puede configurarse igual
```

---

## 🆘 Troubleshooting

### Error: "API not responding"
```
1. Verifica VITE_API_URL en Vercel/Netlify
2. Verifica backend está corriendo en Render
3. Verifica CORS en server/index.js
4. Abre DevTools (F12) → Network → revisa errors
```

### Error: "Build failed"
```
1. npm run build localmente (debe pasar)
2. Verifica que pusheaste cambios a GitHub
3. Revisa logs en Vercel/Netlify dashboard
```

### Database locked
```
Reinicia backend en Render → Manual Restart
```

---

## 📱 Dominio Personalizado

Una vez deployado, puedes usar tu propio dominio:

**Vercel:**
1. Dominio → Add
2. Apunta DNS a Vercel
3. Let's Encrypt SSL automático

**Netlify:**
1. Domain settings
2. Custom domain
3. Apunta DNS

Costo: ~$12/año (GoDaddy, Namecheap, etc)

---

## 💰 Costos Mensuales

| Servicio | Costo |
|----------|-------|
| Vercel (frontend) | Gratis |
| Netlify (frontend) | Gratis |
| Render (backend) | Gratis (con limite) / $7/mes |
| Railway (backend) | Gratis $5 credits / mes |
| Dominio personalizado | ~$1/mes |
| **Total** | **Gratis - $8/mes** |

---

## 📚 Referencias

- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
- Render: https://render.com/docs
- Railway: https://docs.railway.app

**¿Preguntas? Revisa DEPLOYMENT.md para opciones adicionales**
