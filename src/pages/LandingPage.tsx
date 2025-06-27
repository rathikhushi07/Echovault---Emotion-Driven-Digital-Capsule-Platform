import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useMood } from '../contexts/MoodContext';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles, Lock, Unlock, Play, ChevronRight } from 'lucide-react';
import EmotionWaves from '../components/EmotionWaves';
import MoodMirror from '../components/MoodMirror';
import AuthModal from '../components/AuthModal';

const LandingPage: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMoodMirror, setShowMoodMirror] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const { loginAsGuest } = useAuth();
  const { currentMood } = useMood();
  const navigate = useNavigate();

  const handleBeginVault = () => {
    setShowAuthModal(true);
  };

  const handleGuestMode = () => {
    loginAsGuest();
    navigate('/dashboard');
  };

  const features = [
    {
      icon: Heart,
      title: "Emotional Fingerprints",
      description: "AI analyzes your mood to create unique emotional signatures for each memory"
    },
    {
      icon: Lock,
      title: "Time-Locked Memories",
      description: "Seal your thoughts until your future self reaches the same emotional state"
    },
    {
      icon: Sparkles,
      title: "Mood Resonance",
      description: "Discover capsules from others who felt exactly what you're feeling now"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden ambient-bg">
      <EmotionWaves />
      
      {/* Hero Section */}
      <motion.div 
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            className="mb-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="mood-orb w-12 h-12 glow-primary" style={{ backgroundColor: currentMood.color }} />
              <h1 className="text-5xl md:text-7xl font-bold text-white">
                Echo<span className="text-shimmer">Vault</span>
              </h1>
            </div>
            <p className="text-2xl md:text-3xl text-purple-200 font-light leading-relaxed">
              Preserve emotions. Relive them when your soul's ready.
            </p>
          </motion.div>

          <motion.p
            className="text-lg text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Create emotional time capsules that unlock when your future self reaches the same state of being. 
            Your memories are waiting for the perfect moment to resurface.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <button
              onClick={handleBeginVault}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full 
                       hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 
                       glow-primary flex items-center gap-2 group"
            >
              Begin Your Vault
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => setShowLearnMore(true)}
              className="px-8 py-4 glass text-white font-semibold rounded-full 
                       hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Learn More
            </button>
            
            <button
              onClick={() => setShowMoodMirror(true)}
              className="px-8 py-4 border border-purple-400/50 text-purple-200 font-semibold rounded-full 
                       hover:border-purple-400 hover:text-purple-100 transition-all duration-300 flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Mood Mirror
            </button>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <button
              onClick={handleGuestMode}
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors underline"
            >
              Try as guest (temporary vault)
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.section 
        className="relative z-10 py-20 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center text-white mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
          >
            How Emotions Shape Time
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="glass rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-300"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 mb-6 glow-primary">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-slate-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Modals */}
      <AnimatePresence>
        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} />
        )}
        
        {showMoodMirror && (
          <MoodMirror onClose={() => setShowMoodMirror(false)} />
        )}
        
        {showLearnMore && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowLearnMore(false)} />
            <motion.div
              className="relative glass-dark rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-2xl font-bold text-white mb-6">Create → Seal → Feel Again</h3>
              
              <div className="space-y-6 text-slate-300">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Create Your Memory</h4>
                    <p>Write, record, or capture the moment with multimedia. Our AI analyzes your emotional state.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Seal with Emotion</h4>
                    <p>Your capsule is encrypted with a unique emotional fingerprint. Set when it can be unlocked.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Rediscover When Ready</h4>
                    <p>When your future emotional state matches, the capsule unlocks, bringing back the perfect memory.</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowLearnMore(false)}
                className="mt-8 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
              >
                Start Creating
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;