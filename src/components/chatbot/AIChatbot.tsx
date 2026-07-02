import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiUser, FiZap } from 'react-icons/fi';
import { AIChatMessage } from '../../types';
import { GoogleGenerativeAI } from '@google/generative-ai';

const INITIAL_MESSAGE: AIChatMessage = {
  id: '0',
  role: 'assistant',
  content: "Hi! I'm your STREAMLY AI assistant. Tell me what you're in the mood for, and I'll recommend the perfect movie! You can ask me about genres, actors, or just describe your mood.",
  timestamp: new Date(),
};

const genAI = import.meta.env.VITE_GEMINI_API_KEY
  ? new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
  : null;

export const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getAIResponse = useCallback(async (userMessage: string): Promise<string> => {
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const prompt = `You are a movie recommendation expert for the STREAMLY platform. Based on this request: "${userMessage}", recommend 3 movies with brief descriptions.`;
        const result = await model.generateContent(prompt);
        return result.response.text();
      } catch {
        return getLocalResponse(userMessage);
      }
    }
    return getLocalResponse(userMessage);
  }, []);

  const getLocalResponse = (userMessage: string): string => {
    const localResponses: Record<string, string[]> = {
      action: ['"The Dark Knight" - A masterpiece of action and drama!', '"Mad Max: Fury Road" - Pure adrenaline from start to finish!', '"John Wick" - Incredible choreography and world-building!'],
      comedy: ['"Superbad" - The ultimate teen comedy!', '"The Grand Budapest Hotel" - Visually stunning and hilarious!', '"Deadpool" - Comedy meets superhero action!'],
      horror: ['"Hereditary" - Modern horror masterpiece!', '"The Conjuring" - Classic haunted house done right!', '"Get Out" - Brilliant and terrifying!'],
      romance: ['"La La Land" - Beautiful musical romance!', '"The Notebook" - Emotional rollercoaster!', '"Before Sunrise" - Intimate and magical!'],
      sciFi: ['"Interstellar" - Mind-bending space epic!', '"Blade Runner 2049" - Visual masterpiece!', '"Arrival" - Thought-provoking sci-fi!'],
      thriller: ['"Gone Girl" - Keeps you guessing till the end!', '"Parasite" - Masterful tension building!', '"Shutter Island" - Psychological masterpiece!'],
      default: ['"Inception" - A mind-bending thriller!', '"The Matrix" - A must-watch classic!', '"Pulp Fiction" - Tarantino at his finest!'],
    };

    const lowerMsg = userMessage.toLowerCase();
    let category = 'default';
    if (lowerMsg.includes('action') || lowerMsg.includes('fight')) category = 'action';
    else if (lowerMsg.includes('funny') || lowerMsg.includes('comedy') || lowerMsg.includes('laugh')) category = 'comedy';
    else if (lowerMsg.includes('scary') || lowerMsg.includes('horror') || lowerMsg.includes('ghost')) category = 'horror';
    else if (lowerMsg.includes('love') || lowerMsg.includes('romance') || lowerMsg.includes('romantic')) category = 'romance';
    else if (lowerMsg.includes('sci') || lowerMsg.includes('space') || lowerMsg.includes('future')) category = 'sciFi';
    else if (lowerMsg.includes('thriller') || lowerMsg.includes('suspense') || lowerMsg.includes('mystery')) category = 'thriller';

    const responses = localResponses[category] || localResponses.default;
    return responses.map((r, i) => `${i + 1}. ${r}`).join('\n');
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: AIChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiResponse = await getAIResponse(input);

    const aiMessage: AIChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-streamly-red to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-streamly-red/40 hover:shadow-streamly-red/60 transition-shadow"
        style={{ display: isOpen ? 'none' : 'flex' }}
      >
        <FiMessageCircle size={24} className="text-white" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] md:w-[400px] h-[550px] bg-streamly-darker/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-streamly-red/20 via-purple-500/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-streamly-red to-purple-600 flex items-center justify-center shadow-lg">
                  <FiZap className="text-white" size={18} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">STREAMLY AI</h3>
                  <p className="text-green-400 text-xs">Online • Ready to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-streamly-gray-light hover:text-white transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-streamly-red to-purple-600'
                      : 'bg-streamly-red/20'
                  }`}>
                    {msg.role === 'user' ? <FiUser size={14} className="text-white" /> : <FiZap size={14} className="text-streamly-red" />}
                  </div>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-streamly-red to-purple-600 text-white rounded-tr-sm'
                      : 'bg-white/5 text-streamly-gray-light rounded-tl-sm border border-white/5'
                  }`}>
                    <p>{msg.content}</p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-streamly-red/20 flex items-center justify-center">
                    <FiZap size={14} className="text-streamly-red" />
                  </div>
                  <div className="bg-white/5 rounded-2xl rounded-tl-sm border border-white/5 p-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-streamly-red rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for movie recommendations..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-streamly-gray focus:outline-none focus:border-streamly-red/50 transition-colors"
                  disabled={isLoading}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={isLoading}
                  className="p-2.5 bg-gradient-to-r from-streamly-red to-purple-600 rounded-xl hover:from-red-700 hover:to-purple-700 transition-all disabled:opacity-50"
                >
                  <FiSend size={18} className="text-white" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
