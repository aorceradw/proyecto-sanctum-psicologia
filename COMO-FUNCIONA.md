# Sanctum — Flujo de la aplicación

## Estructura

| Área | Rutas |
|------|--------|
| Público | `/` · `/login` · `/crear-cuenta` |
| Paciente | `/cliente` · diario · ánimo · tareas · calma · cuenta |
| Psicólogo | `/psicologo` · pacientes · expediente · citas · cuenta |

## Registro (usuarios reales)

### Psicólogo/a
1. Crear cuenta → **Soy psicólogo/a**
2. Panel → **Mi cuenta** → copiar invitación (código + enlace)

### Paciente
1. Recibe código o enlace del psicólogo
2. Crear cuenta → **Soy paciente** + código
3. Accede a su portal; solo ve datos de su terapeuta

## Uso diario

**Psicólogo:** invitar → revisar pacientes → asignar tareas → programar citas → notas clínicas

**Paciente:** completar tareas → diario → check-in de ánimo → herramientas de calma

## Desarrollo local

```bash
cd sanctum-app
npm run install:all
npm run dev
```

- Cliente: http://localhost:5173  
- API: http://localhost:3001/api/health  

Si ves **«Puerto 3001 ocupado»**, cierra otras terminales con `npm run dev` o ejecuta:

```bash
npm run free-port
npm run dev
```

### Probar registro

1. http://localhost:5173/crear-cuenta?rol=psicologo → crear cuenta profesional  
2. http://localhost:5173/psicologo/cuenta → copiar código de invitación  
3. Ventana de incógnito → `/crear-cuenta?rol=paciente&codigo=TU_CODIGO`

**Demo** (si la BD tiene seed): `elena@ejemplo.com` / `doctor@sanctum.health` — contraseña `sanctum123`
