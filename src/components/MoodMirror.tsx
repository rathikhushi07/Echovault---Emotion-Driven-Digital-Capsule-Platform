import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMood } from '../contexts/MoodContext';
import { X, Mic, Type, Smile } from 'lucide-react';

interface MoodMirrorProps {
  onClose: () => void;
}

const MoodMirror: React.FC<MoodMirrorProps> = ({ onClose }) => {
  const [inputText, setInputText] = useState('');
  const [inputMode, setInputMode] = useState<'text' | 'voice' | 'emoji'>('text');
  const [isListening, setIsListening] = useState(false);
  const { analyzeMood, isAnalyzing, currentMood } = useMood();
  const [analyzedMood, setAnalyzedMood] = useState(currentMood);

  const handleAnalyze = () => {
    if (inputText.trim()) {
      const mood = analyzeMood(inputText);
      setAnalyzedMood(mood);
    }
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Mock voice input - in real app, would use Web Speech API
    if (!isListening) {
      setTimeout(() => {
        setInputText("I'm feeling excited about this new adventure");
        setIsListening(false);
      }, 2000);
    }
  };

  const emojiMoods = [
    { emoji: '😊', text: 'feeling happy and content today' },
    { emoji: '😢', text: 'feeling sad and a bit down' },
    { emoji: '😍', text: 'feeling love and affection' },
    { emoji: '😴', text: 'feeling calm and peaceful' },
    { emoji: '😤', text: 'feeling frustrated and angry' },
    { emoji: '😰', text: 'feeling anxious and worried' },
    { emoji: '🤗', text: 'feeling grateful and warm' },
    { emoji: '✨', text: 'feeling magical and inspired' }
  ];

  useEffect(() => {
    if (inputText) {
      const timer = setTimeout(() => {
        handleAnalyze();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [inputText]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        className="relative glass-dark rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Mood Mirror</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <p className="text-slate-300 mb-6">
          Express yourself and see your emotions reflected back. Try typing, speaking, or selecting an emoji.
        </p>

        {/* Input Mode Selector */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setInputMode('text')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              inputMode === 'text' 
                ? 'bg-purple-600 text-white' 
                : 'glass text-slate-300 hover:bg-white/10'
            }`}
          >
            <Type className="w-4 h-4" />
            Text
          </button>
          <button
            onClick={() => setInputMode('voice')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              inputMode === 'voice' 
                ? 'bg-purple-600 text-white' 
                : 'glass text-slate-300 hover:bg-white/10'
            }`}
          >
            <Mic className="w-4 h-4" />
            Voice
          </button>
          <button
            onClick={() => setInputMode('emoji')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              inputMode === 'emoji' 
                ? 'bg-purple-600 text-white' 
                : 'glass text-slate-300 hover:bg-white/10'
            }`}
          >
            <Smile className="w-4 h-4" />
            Emoji
          </button>
        </div>

        {/* Input Area */}
        <div className="mb-8">
          {inputMode === 'text' && (
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="How are you feeling right now? Describe your emotions..."
              className="w-full h-32 p-4 glass rounded-xl text-white placeholder-slate-400 
                       border border-white/10 focus:border-purple-400 focus:outline-none 
                       resize-none transition-all"
            />
          )}

          {inputMode === 'voice' && (
            <div className="flex flex-col items-center justify-center h-32 glass rounded-xl">
              <button
                onClick={handleVoiceInput}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  isListening 
                    ? 'bg-red-500 pulse-glow animate-pulse' 
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                <Mic className="w-8 h-8 text-white" />
              </button>
              <p className="text-slate-300 mt-4">
                {isListening ? 'Listening...' : 'Click to speak your feelings'}
              </p>
            </div>
          )}

          {inputMode === 'emoji' && (
            <div className="grid grid-cols-4 gap-4 p-4 glass rounded-xl">
              {emojiMoods.map((mood, index) => (
                <button
                  key={index}
                  onClick={() => setInputText(mood.text)}
                  className="text-4xl p-4 hover:bg-white/10 rounded-xl transition-all 
                           hover:scale-110 active:scale-95"
                >
                  {mood.emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mood Analysis Result */}
        <AnimatePresence>
          {(inputText || isAnalyzing) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="mb-6">
                <motion.div
                  className="mood-orb w-24 h-24 mx-auto mb-4"
                  style={{ backgroundColor: analyzedMood.color }}
                  animate={{
                    scale: isAnalyzing ? [1, 1.1, 1] : 1,
                    opacity: isAnalyzing ? [0.7, 1, 0.7] : 1
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: isAnalyzing ? Infinity : 0
                  }}
                />
                
                {isAnalyzing ? (
                  <p className="text-slate-300">Analyzing your emotional state...</p>
                ) : (
                  <div>
                    <h3 className="text-2xl font-bold text-white capitalize mb-2">
                      {analyzedMood.emotion}
                    </h3>
                    <div className="flex justify-center mb-4">
                      <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: analyzedMood.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${analyzedMood.intensity * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                    <p className="text-slate-300 mb-4">
                      Intensity: {Math.round(analyzedMood.intensity * 100)}%
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {analyzedMood.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white/10 rounded-full text-sm text-slate-300"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onClose}
            className="px-6 py-3 glass text-white rounded-full hover:bg-white/10 transition-all"
          >
            Close Mirror
          </button>
          {inputText && !isAnalyzing && (
            <button
              onClick={() => {
                onClose();
                // Navigate to compose with current mood
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white 
                       rounded-full hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Create Capsule
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MoodMirror;