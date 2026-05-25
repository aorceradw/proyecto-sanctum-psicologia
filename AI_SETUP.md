# 🤖 Setup del Asistente IA - Google Gemini

## Descripción

Se ha agregado un asistente de IA inteligente a Sanctum que utiliza **Google Gemini** para:

- **Para Psicólogos**: Análisis clínico profesional de pacientes, sugerencias de enfoques terapéuticos
- **Para Pacientes**: Responder preguntas sobre salud mental, sugerir técnicas de respiración, analizar diarios

## 🚀 Instalación

### 1. Obtener API Key de Google Gemini

1. Ve a [Google AI Studio](https://ai.google.dev/)
2. Haz clic en "Get an API key"
3. Elige o crea un proyecto
4. Copia tu API key

### 2. Configurar Variables de Entorno

Abre el archivo `.env` en la raíz del servidor (o crea uno basado en `.env.example`):

```env
GOOGLE_GEMINI_API_KEY=tu_api_key_aqui
```

### 3. Instalar Dependencias

Las dependencias ya han sido instaladas con:
```bash
npm install
```

Si necesitas instalar de nuevo:
```bash
cd server
npm install
```

## 📱 Uso

### Para el Usuario

El chatbot aparece como un botón flotante con ícono de "sparkles" (✨) en:
- **Dashboard del Psicólogo** (`/psicologo`)
- **Dashboard del Paciente** (`/cliente`)

Haz clic en el botón para abrir el chat.

### Funcionalidades

#### Para Psicólogos
- Análisis de síntomas y patrones emocionales
- Sugerencias de enfoques terapéuticos
- Discussión de estrategias basadas en evidencia
- Análisis de entradas de diario de pacientes
- Apoyo en planeación clínica

#### Para Pacientes
- Respuestas sobre salud mental y bienestar
- Técnicas de respiración y meditación
- Estrategias de afrontamiento
- Análisis de patrones de mood
- Sugerencias de bienestar

## 🔧 Arquitectura

### Backend (`server/routes/ai.js`)

**Endpoint**: `POST /api/ai/chat`

**Parámetros**:
```json
{
  "message": "Tu pregunta",
  "userRole": "patient" | "psychologist",
  "patientData": {
    "name": "Nombre del paciente",
    "anxiety": 7,
    "depression": 5,
    "energy": 6,
    "notes": "Notas adicionales"
  },
  "contextType": "general" | "mood-analysis" | "journal-analysis"
}
```

**Respuesta**:
```json
{
  "success": true,
  "message": "Respuesta de la IA",
  "role": "patient"
}
```

### Frontend (`client/src/components/Chatbot.tsx`)

Componente reutilizable que:
- Maneja el estado del chat
- Envía mensajes al backend
- Muestra respuestas con animaciones
- Soporta historial de conversación
- Indicador de carga con animación

## 🎨 Estilos

Los estilos están en `client/src/styles/chatbot.css` con:
- Diseño responsive (mobile, tablet, desktop)
- Animaciones suaves
- Colores del tema de Sanctum
- Indicadores visuales de carga

## ⚙️ Configuración

### System Prompts

Cada rol tiene un prompt del sistema específico:

**Psicólogo**:
```
"You are an expert AI assistant for mental health professionals..."
```

**Paciente**:
```
"You are a compassionate mental health support assistant for patients..."
```

Los prompts automáticamente responden en el idioma del usuario (español o inglés).

## 🔒 Seguridad

- API key nunca se expone en el frontend
- Todas las llamadas requieren autenticación JWT
- Las solicitudes pasan por el servidor backend

## 📊 Análisis de Datos (Futuro)

El sistema está preparado para:
- Analizar entradas de diario con contexto
- Considerar datos de mood en tiempo real
- Proporcionar insights basados en histórico del paciente

## 🐛 Troubleshooting

### Error: "API key not found"
- Verifica que `GOOGLE_GEMINI_API_KEY` esté en `.env`
- Reinicia el servidor

### Error: "Failed to generate response"
- Verifica que tu API key sea válida en [Google AI Studio](https://ai.google.dev/)
- Comprueba que tengas créditos en tu cuenta (el modelo Gemini 2.0 Flash es gratuito)
- Revisa la consola del servidor para errores

### El chat no aparece
- Verifica que Chatbot.tsx esté importado correctamente
- Asegúrate de que los estilos CSS se estén cargando
- Comprueba la consola del navegador para errores de JavaScript

## 📚 Documentación Oficial

- [Google Generative AI API](https://ai.google.dev/)
- [Documentación de @google/generative-ai](https://www.npmjs.com/package/@google/generative-ai)

## 🎯 Próximas Mejoras

- [ ] Historial de conversaciones persistente
- [ ] Análisis de tendencias de sentimiento
- [ ] Integración con tareas clínicas
- [ ] Exportar análisis como reportes
- [ ] Historial multi-sesión de pacientes
