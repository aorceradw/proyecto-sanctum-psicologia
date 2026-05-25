# 📋 Comandos Copy-Paste

## PASO 1: GitHub - Subir código

### 1.1 Primero, crea repo en https://github.com/new
- Name: `sanctum-app`
- Public
- Create

### 1.2 Luego ejecuta ESTO EN TU TERMINAL
(Reemplaza `TU-USERNAME` con tu usuario GitHub)

```bash
cd c:\Users\angel_3zlwnzv\Desktop\sanctum-app
git remote add origin https://github.com/TU-USERNAME/sanctum-app.git
git branch -M main
git push -u origin main
```

---

## PASO 2: Vercel - Frontend

### 2.1 En https://vercel.com
- Sign Up with GitHub
- Autoriza
- Import: sanctum-app

### 2.2 Configuración automática
- Build: `npm run install:all && npm run build`
- Output: `client/dist`
- Agrega variable: `VITE_API_URL = https://tu-backend.onrender.com/api`
- Deploy

**Resultado:** `https://sanctum-app.vercel.app` ✅

---

## PASO 3: Render - Backend

### 3.1 En https://render.com
- Sign Up with GitHub
- New → Web Service
- Selecciona: sanctum-app

### 3.2 Configuración
```
Name: sanctum-backend
Build: npm install && npm run build --prefix server
Start: npm start --prefix server
```

### 3.3 Environment Variables
```
NODE_ENV=production
CLIENT_ORIGIN=https://sanctum-app.vercel.app
PORT=3001
```

**Resultado:** `https://sanctum-backend.onrender.com` ✅

---

## PASO 4: Conectar todo

### 4.1 En Vercel Dashboard
- Tu proyecto → Settings → Environment Variables
- Actualiza:
```
VITE_API_URL=https://sanctum-backend.onrender.com/api
```

### 4.2 Vercel automáticamente redeploya
- Espera 2 minutos
- Listo ✅

---

## ✅ PRUEBAS FINALES

```bash
# Test 1: ¿Frontend carga?
curl https://sanctum-app.vercel.app/

# Test 2: ¿API responde?
curl https://sanctum-backend.onrender.com/api/health

# Test 3: ¿CORS OK?
curl -H "Origin: https://sanctum-app.vercel.app" \
     https://sanctum-backend.onrender.com/api/health
```

---

## 🎯 URLs Finales

```
Frontend: https://sanctum-app.vercel.app
Backend:  https://sanctum-backend.onrender.com
GitHub:   https://github.com/TU-USERNAME/sanctum-app
```

---

## 📱 Alternativa: Netlify en lugar de Vercel

### En https://netlify.com
```
Sign Up → GitHub → New Site → sanctum-app
Build: npm run install:all && npm run build
Publish: client/dist
Resultado: https://sanctum-app.netlify.app
```

---

**Necesitas ayuda? Lee PASOS_INMEDIATOS.md** 📖
