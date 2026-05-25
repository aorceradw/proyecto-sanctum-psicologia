# Sanctum — Portal de bienestar terapéutico

Aplicación web con **base de datos SQLite**, **autenticación JWT** y **dos portales separados** (paciente y psicólogo/a), más una **página pública** para visitantes.

## Registro de usuarios reales

| Quién | Cómo |
|-------|------|
| **Psicólogo/a (tú)** | `/crear-cuenta` → Soy psicólogo/a → en el panel verás tu **código de invitación** |
| **Paciente / cliente** | `/crear-cuenta` → Soy paciente → introduce el código que le diste |

Detalle del flujo: ver `COMO-FUNCIONA.md`.

Datos demo opcionales (solo si la BD está vacía): `elena@ejemplo.com` / `doctor@sanctum.health` — `sanctum123`

## Funciones

**Público**
- Presentación de Sanctum y enlaces a inicio de sesión

**Paciente**
- Panel con progreso y próxima cita (desde BD)
- Diario personal (guardado en BD)
- Check-in de ánimo
- Tareas con celebración al completar
- Respiración y botón de crisis en el header

**Psicólogo**
- Panel con métricas, alertas y agenda
- Directorio de sus pacientes
- Expediente: diario del paciente y notas clínicas

## Inicio

```bash
cd sanctum-app
npm run install:all
cp server/.env.example server/.env
npm run dev
```

- App: http://localhost:5173  
- API: http://localhost:3001  

Reiniciar datos de ejemplo:

```bash
npm run db:reset --prefix server
```

## Producción

```bash
npm run build
npm run start
```

El servidor sirve el build del cliente y la API en el mismo puerto.

## Stack

React 19 · TypeScript · Vite · Tailwind v4 · Framer Motion · Express · SQLite · JWT
