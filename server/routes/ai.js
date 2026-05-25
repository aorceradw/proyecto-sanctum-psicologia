import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// System prompts for different roles
const SYSTEM_PROMPTS = {
  psychologist: `You are an expert AI assistant for mental health professionals. Your role is to help psychologists with:
- Analyzing patient symptoms and emotional patterns
- Suggesting clinical insights and therapeutic approaches
- Discussing evidence-based treatment strategies
- Analyzing journal entries for psychological patterns
- Supporting diagnosis and treatment planning

You provide professional, clinical insights while maintaining appropriate boundaries. Always recommend human professional judgment for diagnosis and treatment decisions.
Respond in the same language as the user (Spanish or English).`,

  patient: `You are a compassionate mental health support assistant for patients. Your role is to:
- Answer questions about mental health and wellness
- Suggest breathing techniques and meditation exercises
- Provide emotional support and coping strategies
- Analyze mood patterns and suggest wellness tips
- Share resources for mental health support

You are NOT a replacement for professional mental health care. If someone expresses crisis thoughts, encourage them to contact emergency services or a mental health professional.
Respond in the same language as the user (Spanish or English).`
};

// POST /api/ai/chat - Process chat messages
router.post('/chat', verifyToken, async (req, res) => {
  try {
    const { message, userRole, patientData, contextType } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Determine system prompt based on role
    const systemPrompt = SYSTEM_PROMPTS[userRole] || SYSTEM_PROMPTS.patient;

    // Build context for the AI
    let context = '';
    if (patientData && userRole === 'psychologist') {
      context = `
Patient Context:
- Name: ${patientData.name}
- Mood History: Anxiety: ${patientData.anxiety}/10, Depression: ${patientData.depression}/10, Energy: ${patientData.energy}/10
- Last Entry: ${patientData.lastEntry || 'No recent entries'}
`;
    }

    if (contextType === 'mood-analysis' && patientData) {
      context += `
Current Mood Analysis Request:
- Anxiety Level: ${patientData.anxiety}/10
- Depression Level: ${patientData.depression}/10
- Energy Level: ${patientData.energy}/10
- Notes: ${patientData.notes || 'None provided'}
`;
    }

    if (contextType === 'journal-analysis' && patientData) {
      context += `
Journal Entry Analysis:
- Content: ${patientData.content}
- Date: ${patientData.date}
- Mood at time: ${patientData.mood || 'Not specified'}
`;
    }

    // Create the model instance
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      systemInstruction: systemPrompt
    });

    // Build the full message with context
    const fullMessage = context ? `${context}\n\nUser Message: ${message}` : message;

    // Generate response
    const result = await model.generateContent(fullMessage);
    const response = result.response;
    const text = response.text();

    res.json({
      success: true,
      message: text,
      role: userRole
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      details: error.message 
    });
  }
});

export default router;
