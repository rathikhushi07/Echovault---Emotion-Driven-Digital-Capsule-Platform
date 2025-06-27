import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Heart, Lightbulb } from 'lucide-react';
import { useMood } from '../contexts/MoodContext';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  emotion?: string;
}

const AIMoodCompanion: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentMood, analyzeMood } = useMood();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting based on current mood
      const greeting = getInitialGreeting(currentMood.emotion);
      addAIMessage(greeting);
    }
  }, [isOpen, currentMood.emotion]);

  const getInitialGreeting = (emotion: string): string => {
    const greetings = {
      joy: "I can sense your joy radiating! ✨ What's bringing you such happiness today?",
      sadness: "I'm here with you in this moment. 💙 Sometimes sadness carries important messages. What's on your heart?",
      anger: "I feel the intensity of your emotions. 🔥 Anger often points to something that matters deeply to you. Want to explore it?",
      fear: "I notice you might be feeling uncertain. 🌙 Fear can be a teacher. What's stirring these feelings?",
      love: "Your heart seems full of warmth. 💕 Love is such a powerful force. What's inspiring these feelings?",
      calm: "I sense your peaceful energy. 🌊 This is a beautiful space to be in. How are you experiencing this calm?",
      nostalgia: "I feel you're traveling through memories. 🍂 The past has a way of calling to us. What's drawing you back?",
      hope: "There's a beautiful light in your emotional space. 🌅 Hope is such a gift. What's inspiring this feeling?"
    };
    
    return greetings[emotion as keyof typeof greetings] || 
           "Hello, beautiful soul. I'm here to explore this emotional moment with you. How are you feeling?";
  };

  const addAIMessage = (content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const addUserMessage = (content: string, emotion?: string) => {
    const message: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
      emotion
    };
    setMessages(prev => [...prev, message]);
  };

  const generateAIResponse = (userMessage: string, detectedEmotion: string): string => {
    const responses = {
      joy: [
        "Your joy is contagious! 🌟 This sounds like a moment worth preserving. Have you considered creating a capsule to capture this exact feeling?",
        "I love how your happiness shines through your words! ✨ What would you want your future self to remember about this moment?",
        "This joy feels so authentic and pure. 🌈 Sometimes the best capsules are created in moments like these."
      ],
      sadness: [
        "Thank you for sharing something so tender with me. 💙 Your sadness is valid and important. What would comfort your future self to know about this moment?",
        "I hear the depth in your words. 🌙 Sometimes our most profound capsules come from our most vulnerable moments. What wisdom might this sadness hold?",
        "Your honesty about this pain is brave. 💫 What would you want to tell yourself when you're feeling this way again?"
      ],
      anger: [
        "I can feel the fire in your words. 🔥 Anger often reveals what we value most. What boundary or value feels threatened right now?",
        "Your anger has power and purpose. ⚡ What would you want your future self to understand about what's driving this feeling?",
        "This intensity suggests something really matters to you. 🌋 How might you channel this energy into something meaningful?"
      ],
      fear: [
        "I sense your courage in sharing this fear. 🌙 What would your bravest self want to remind you in moments like this?",
        "Fear often appears at the edge of growth. 🌱 What might be trying to emerge through this uncertainty?",
        "Your vulnerability is a form of strength. ✨ What support would your future self want to offer you right now?"
      ],
      love: [
        "The warmth in your words is beautiful. 💕 Love creates some of our most treasured memories. What about this feeling do you want to preserve forever?",
        "I can feel your heart expanding. 🌹 What would you want to remember about how love feels in this exact moment?",
        "This love sounds transformative. 💫 How has this feeling changed you or your perspective?"
      ],
      calm: [
        "Your peace is palpable. 🌊 These serene moments are gifts. What wisdom emerges when you're in this calm space?",
        "I love how centered you sound. 🧘‍♀️ What would you want to remember about finding this peace?",
        "This tranquility feels hard-earned. ✨ What brought you to this peaceful place?"
      ],
      nostalgia: [
        "I can feel you traveling through time. 🍂 What from that memory do you want to carry forward?",
        "The past is calling to you for a reason. 🌅 What gift might this memory be offering your present self?",
        "Nostalgia often holds keys to who we are. 💫 What does this memory reveal about what matters most to you?"
      ],
      hope: [
        "Your hope is like a beacon. 🌟 What vision of the future is inspiring this feeling?",
        "I can feel the light in your words. 🌅 What would you want to remember about this hopeful moment when times get difficult?",
        "Hope is such a powerful force. ✨ What dreams or possibilities are stirring in you right now?"
      ]
    };

    const emotionResponses = responses[detectedEmotion as keyof typeof responses] || [
      "I hear you, and your feelings matter. 💫 What would be most helpful to explore right now?",
      "Thank you for sharing this with me. ✨ What insight might this moment hold for your future self?",
      "Your emotional experience is so valid. 🌙 What would you want to remember about feeling this way?"
    ];

    return emotionResponses[Math.floor(Math.random() * emotionResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    const detectedMood = analyzeMood(userMessage);
    
    addUserMessage(userMessage, detectedMood.emotion);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const response = generateAIResponse(userMessage, detectedMood.emotion);
      addAIMessage(response);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedPrompts = [
    "How am I feeling right now?",
    "What should I remember about today?",
    "Help me understand this emotion",
    "What question should I ask my future self?"
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 
                 rounded-full flex items-center justify-center text-white shadow-lg z-40
                 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(139, 92, 246, 0.3)',
            '0 0 30px rgba(139, 92, 246, 0.5)',
            '0 0 20px rgba(139, 92, 246, 0.3)'
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-end p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div 
              className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
              onClick={() => setIsOpen(false)} 
            />
            
            <motion.div
              className="relative w-96 h-[600px] glass-dark rounded-2xl flex flex-col overflow-hidden"
              initial={{ x: 400, y: 100, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              exit={{ x: 400, y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 
                                flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Mood Companion</h3>
                    <p className="text-xs text-slate-400">Your emotional guide</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'glass text-slate-200'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      {message.emotion && (
                        <div className="flex items-center gap-1 mt-2 text-xs opacity-70">
                          <Heart className="w-3 h-3" />
                          <span className="capitalize">{message.emotion}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="glass p-3 rounded-2xl">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Prompts */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2">
                  <div className="flex items-center gap-1 mb-2">
                    <Lightbulb className="w-3 h-3 text-amber-400" />
                    <span className="text-xs text-slate-400">Try asking:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestedPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => setInputText(prompt)}
                        className="text-xs px-2 py-1 glass rounded-full text-slate-300 
                                 hover:text-white hover:bg-white/10 transition-all"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex items-end gap-2">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share what's on your heart..."
                    className="flex-1 p-3 glass rounded-xl text-white placeholder-slate-400 
                             border border-white/10 focus:border-purple-400 focus:outline-none 
                             resize-none transition-all max-h-20"
                    rows={1}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isTyping}
                    className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white 
                             rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all 
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIMoodCompanion;