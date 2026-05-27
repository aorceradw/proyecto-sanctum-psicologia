# 🔍 Auditoría Completa - Flujo de Producción

## Estado Actual ❌

### ✅ Lo que SÍ está bien:
1. **client/.env.production**: `VITE_API_URL=/sanctum` ✓
2. **client/src/api/api.ts**: Usa VITE_API_URL correctamente ✓
3. **client/vite.config.ts**: Base path configurado a `/sanctum/` ✓
4. **server/index.js**: Escucha en 0.0.0.0:3001 ✓

---

## ❌ Lo que ESTÁ MAL:

### 1️⃣ **docker-compose.yml - PROBLEMA CRÍTICO**
```yaml
# ❌ MAL - No debería estar aquí
environment:
  VITE_API_URL: http://192.168.2.150:3001  # ← ESTO NO VA AQUÍ
  CLIENT_ORIGIN: http://192.168.2.150:3001  # ← MÁS ESPECÍFICO
```

**Por qué falla:**
- `VITE_API_URL` se debe compilar en BUILD TIME del cliente (Vite), no en runtime del servidor
- Las variables de Docker solo afectan al servidor Node, no al cliente compilado
- El cliente usa la URL que se compiló en `.env.production`

**Solución:**
- Eliminar `VITE_API_URL` del docker-compose
- Hacer que `CLIENT_ORIGIN` sea más permisivo con el proxy

---

### 2️⃣ **server/index.js - CORS incompleto**
```javascript
// ❌ Falta: Aceptar requests desde Apache proxy
const allowedOrigins = [
  CLIENT_ORIGIN,
  'http://127.0.0.1:5173',
  'http://localhost:5173',
  'http://192.168.2.150',           // ← Esto funciona
  'http://192.168.2.150:3001',      // ← Pero es redundante
  'http://192.168.2.150:80',        // ← Debería estar aquí
  'http://192.168.2.150/sanctum/',  // ← Y aquí también
];
```

**Por qué falla:**
- Cuando Apache proxy redirige a `/sanctum/`, el origen HTTP es `http://192.168.2.150`
- Si el servidor es más estricto con CORS, rechaza la petición

---

### 3️⃣ **Flujo de rutas confuso**
```
¿Qué está pasando ahora?

1. Client solicita: GET /sanctum/api/health
   ↓
2. Apache proxy redirige a: GET /api/health (interno)
   ↓
3. Server responde en: /api/health ✓

PERO: El Vite build usa base: '/sanctum/'
- Assets: /sanctum/assets/... ✓
- API calls: /sanctum/api/... ✓
```

**Problema potencial:**
- Si Apache no está reescribiendo correctamente, las rutas pueden no coincidir

---

## ✅ SOLUCIÓN - Cambios Necesarios

### **Paso 1: Limpiar docker-compose.yml**
```yaml
services:
  sanctum:
    environment:
      NODE_ENV: production
      PORT: 3001
      HOST: 0.0.0.0
      # Eliminar VITE_API_URL de aquí
      # CLIENT_ORIGIN se usa solo para CORS en el server
      CLIENT_ORIGIN: "*"  # Permisivo con proxy
```

### **Paso 2: Actualizar server/index.js CORS**
```javascript
const allowedOrigins = [
  'http://localhost:5173',         // Desarrollo local
  'http://127.0.0.1:5173',         // Desarrollo local
  'http://192.168.2.150',          // Apache proxy
  'http://192.168.2.150:80',       // Apache proxy explícito
  'http://192.168.2.150:3001',     // Directo a Docker (si lo necesitas)
  'http://tu-dominio.com',         // Tu dominio (cuando lo tengas)
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.warn(`CORS rechazado: ${origin}`);
      callback(null, false);
    },
    credentials: true,
  }),
);
```

### **Paso 3: Verificar vite.config.ts**
```typescript
// Ya está bien, pero asegúrate de que esté así:
export default defineConfig({
  base: '/sanctum/',  // ← Crítico para assets
  // ...
});
```

### **Paso 4: Verificar client/.env.production**
```
VITE_API_URL=/sanctum
```

---

## 🧪 Pruebas de Debugging

Cuando despliegues, ejecuta esto en la consola del navegador (F12):

```javascript
// 1. Ver qué URL de API está usando
console.log('API Base:', import.meta.env.VITE_API_URL);

// 2. Probar la solicitud
fetch('/sanctum/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

// 3. Ver el origen del request
console.log('Origin:', window.location.origin);
console.log('Href:', window.location.href);
```

---

## 📊 Flujo Esperado en Producción

```
CLIENTE (http://192.168.2.150/sanctum/)
  ├─ HTML carga ✓
  ├─ Assets en /sanctum/assets/ ✓
  └─ API call: GET /sanctum/api/health
      ↓
APACHE PROXY (reescribe /sanctum/ → localhost:3001)
      ↓
SERVIDOR (http://localhost:3001/api/health)
      └─ Responde ✓
```

---

## 📝 Checklist

- [ ] Eliminar VITE_API_URL de docker-compose.yml
- [ ] Verificar client/.env.production tiene VITE_API_URL=/sanctum
- [ ] Actualizar CORS en server/index.js
- [ ] Reconstruir Docker: docker compose build --no-cache
- [ ] Reiniciar: docker compose down && docker compose up -d
- [ ] Probar en consola: fetch('/sanctum/api/health')
- [ ] Verificar Apache proxy está activo
