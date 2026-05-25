# ⚡ PASOS INMEDIATOS - GitHub + Vercel

## 🔗 PASO 1: Crear Repositorio en GitHub (5 min)

### 1. Ve a GitHub
```
https://github.com/new
```

### 2. Llena el formulario:
- **Repository name:** `sanctum-app`
- **Description:** "Sanctum - Mental health platform"
- **Public:** ✅ (para que todos vean)
- Click "Create repository"

### 3. Copia la URL del repo
(Tendrá esta forma: `https://github.com/TU-USERNAME/sanctum-app.git`)

---

## 📤 PASO 2: Subir Código (2 min)

Tu código YA está committeado localmente. Ahora sube:

```bash
cd tu-carpeta-sanctum-app

# Cambiar rama a main (si es necesario)
git branch -M main

# Agregar el remoto (reemplaza con tu URL de GitHub)
git remote add origin https://github.com/TU-USERNAME/sanctum-app.git

# Subir
git push -u origin main
```

✅ **¡Código en GitHub!**

---

## 🚀 PASO 3: Desplegar Frontend en Vercel (3 min)

### 3A. Ir a Vercel
```
https://vercel.com
```

### 3B. Sign Up con GitHub
- Click "Sign Up"
- Elige "GitHub"
- Autoriza a Vercel

### 3C. Importar Proyecto
- Click "Import Project"
- Selecciona: `sanctum-app`

### 3D. Configurar Build
```
Framework Preset: Vite
Build Command: npm run install:all && npm run build
Output Directory: client/dist
```

### 3E. Environment Variables
```
VITE_API_URL = https://tu-backend.onrender.com/api
```
(Lo obtendrás del PASO 4)

### 3F. Deploy
- Click "Deploy"
- ✅ En 2 min tu app estará en:
  ```
  https://sanctum-app.vercel.app
  ```

---

## ⚙️ PASO 4: Desplegar Backend en Render.com (5 min)

### 4A. Ir a Render
```
https://render.com
```

### 4B. Sign Up con GitHub
- Click "Get Started"
- Elige "GitHub"

### 4C. Crear Web Service
- "New+" → "Web Service"
- Conecta: `sanctum-app`

### 4D. Configurar
```
Name: sanctum-backend
Build Command: npm install && npm run build --prefix server
Start Command: npm start --prefix server
Node Version: 22
```

### 4E. Environment Variables
```
NODE_ENV = production
CLIENT_ORIGIN = https://sanctum-app.vercel.app
PORT = 3001
```

### 4F. Deploy
- Click "Create Web Service"
- ✅ En 3 min backend estará en:
  ```
  https://sanctum-backend.onrender.com
  ```

---

## 🔗 PASO 5: Conectar Frontend ↔ Backend (2 min)

### 5A. En Vercel Dashboard
1. Tu proyecto → Settings
2. Environment Variables
3. Actualiza:
```
VITE_API_URL = https://sanctum-backend.onrender.com/api
```

### 5B. Redeploy
- Vercel automáticamente reconstruye
- ✅ Listo en 1 min

---

## ✅ VERIFICAR QUE TODO FUNCIONA

### Test 1: Frontend carga
```
https://sanctum-app.vercel.app
```
¿Se ve? ✅

### Test 2: Login funciona
- Ve a `/login`
- Usuario: `doctor@sanctum.health`
- Contraseña: `sanctum123`
¿Entraste? ✅

### Test 3: Calendario navega meses
- Ve a `/psicologo/cuenta`
- ¿Botones ◀️ ▶️ funcionan? ✅

---

## 🎯 RESUMEN FINAL

| Componente | URL | Estado |
|-----------|-----|--------|
| Frontend | `https://sanctum-app.vercel.app` | ✅ En vivo |
| Backend | `https://sanctum-backend.onrender.com` | ✅ En vivo |
| GitHub | `https://github.com/TU-USER/sanctum-app` | ✅ Código |

---

## 🆘 SI ALGO FALLA

**Error: "API not responding"**
```
→ Ve a Render Dashboard
→ Tu servicio → Logs
→ ¿Dice algo rojo?
→ Click "Manual Restart"
```

**Error: "Build failed en Vercel"**
```
→ Vercel Dashboard → Deployments
→ Click el deployment rojo
→ Lee los logs
```

**Error: "Cannot find module"**
```
→ Asegúrate pusheaste cambios a GitHub: git push
→ Vercel automáticamente redeploya
```

---

**¿Dudas? Lee `GITHUB_VERCEL_NETLIFY.md` para más detalles** 📖
