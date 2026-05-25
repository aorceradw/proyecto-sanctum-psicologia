import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from './Icon';
import '../styles/chatbot.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatbotProps {
  userRole: 'patient' | 'psychologist';
  patientData?: {
    name?: string;
    anxiety?: number;
    depression?: number;
    energy?: number;
    lastEntry?: string;
  };
  contextType?: 'mood-analysis' | 'journal-analysis' | 'general';
  isOpen: boolean;
  onClose: () => void;
}

export default function Chatbot({
  userRole,
  patientData,
  contextType = 'general',
  isOpen,
  onClose,
}: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting based on role and context
      const greeting =
        userRole === 'psychologist'
          ? '¡Hola! Soy tu asistente de IA para análisis clínico. Puedo ayudarte a analizar síntomas de pacientes, sugerir enfoques terapéuticos y explorar patrones emocionales. ¿Con qué puedo ayudarte hoy?'
          : '¡Hola! Soy tu asistente de bienestar. Puedo ayudarte con técnicas de respiración, análisis de tu estado de ánimo, y responder preguntas sobre salud mental. ¿Cómo te sientes hoy?';

      setMessages([
        {
          id: '0',
          text: greeting,
          sender: 'ai',
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/ai/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            message: input,
            userRole,
            patientData,
            contextType,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.message,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, no pude procesar tu mensaje. Intenta de nuevo.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="chatbot-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-title">
              <Icon name="sparkles" className="w-5 h-5 text-primary" />
              <h3>Asistente IA Sanctum</h3>
            </div>
            <button
              onClick={onClose}
              className="chatbot-close"
              aria-label="Close chat"
            >
              <Icon name="x" />
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                className={`message ${msg.sender}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`message-bubble ${msg.sender}`}>
                  {msg.text}
                </div>
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </motion.div>
            ))}
            {isLoading && (
              <div className="message ai">
                <div className="message-bubble ai loading">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={sendMessage} className="chatbot-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              disabled={isLoading}
              className="chatbot-input"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="chatbot-send"
            >
              <Icon name="send" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
