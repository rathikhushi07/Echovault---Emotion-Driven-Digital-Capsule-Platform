import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music, Waves, Cloud, Zap } from 'lucide-react';
import { useMood } from '../contexts/MoodContext';

interface SoundTheme {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  tracks: {
    [emotion: string]: string;
  };
  color: string;
}

const AmbientSoundPlayer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<string>('echoes');
  const [volume, setVolume] = useState(0.3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { currentMood } = useMood();

  const soundThemes: SoundTheme[] = [
    {
      id: 'echoes',
      name: 'Echoes',
      icon: Waves,
      description: 'Ethereal reverberations that mirror your inner state',
      color: '#8b5cf6',
      tracks: {
        joy: '/sounds/echoes-joy.mp3',
        sadness: '/sounds/echoes-sadness.mp3',
        anger: '/sounds/echoes-anger.mp3',
        calm: '/sounds/echoes-calm.mp3',
        love: '/sounds/echoes-love.mp3',
        fear: '/sounds/echoes-fear.mp3',
        nostalgia: '/sounds/echoes-nostalgia.mp3',
        hope: '/sounds/echoes-hope.mp3'
      }
    },
    {
      id: 'rain-glass',
      name: 'Rain Glass',
      icon: Cloud,
      description: 'Gentle precipitation on crystalline surfaces',
      color: '#06b6d4',
      tracks: {
        joy: '/sounds/rain-glass-joy.mp3',
        sadness: '/sounds/rain-glass-sadness.mp3',
        anger: '/sounds/rain-glass-anger.mp3',
        calm: '/sounds/rain-glass-calm.mp3',
        love: '/sounds/rain-glass-love.mp3',
        fear: '/sounds/rain-glass-fear.mp3',
        nostalgia: '/sounds/rain-glass-nostalgia.mp3',
        hope: '/sounds/rain-glass-hope.mp3'
      }
    },
    {
      id: 'memory-dissonance',
      name: 'Memory Dissonance',
      icon: Zap,
      description: 'Fragmented melodies from forgotten moments',
      color: '#f59e0b',
      tracks: {
        joy: '/sounds/memory-dissonance-joy.mp3',
        sadness: '/sounds/memory-dissonance-sadness.mp3',
        anger: '/sounds/memory-dissonance-anger.mp3',
        calm: '/sounds/memory-dissonance-calm.mp3',
        love: '/sounds/memory-dissonance-love.mp3',
        fear: '/sounds/memory-dissonance-fear.mp3',
        nostalgia: '/sounds/memory-dissonance-nostalgia.mp3',
        hope: '/sounds/memory-dissonance-hope.mp3'
      }
    }
  ];

  const currentThemeData = soundThemes.find(theme => theme.id === currentTheme);

  useEffect(() => {
    if (isPlaying && currentThemeData) {
      const trackUrl = currentThemeData.tracks[currentMood.emotion] || currentThemeData.tracks.calm;
      
      // In a real app, you would load actual audio files
      // For now, we'll simulate the audio experience
      console.log(`Playing: ${currentThemeData.name} - ${currentMood.emotion}`);
      
      if (audioRef.current) {
        audioRef.current.volume = isMuted ? 0 : volume;
      }
    }
  }, [currentMood.emotion, currentTheme, isPlaying, volume, isMuted]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    if (isPlaying) {
      // Restart with new theme
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 100);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVolume;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <>
      {/* Floating Sound Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 w-12 h-12 glass rounded-full flex items-center justify-center 
                 text-slate-300 hover:text-white hover:bg-white/20 transition-all z-40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isPlaying ? {
          boxShadow: [
            '0 0 20px rgba(139, 92, 246, 0.3)',
            '0 0 30px rgba(139, 92, 246, 0.5)',
            '0 0 20px rgba(139, 92, 246, 0.3)'
          ]
        } : {}}
        transition={{
          duration: 2,
          repeat: isPlaying ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        <Music className="w-5 h-5" />
      </motion.button>

      {/* Sound Control Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
              onClick={() => setIsOpen(false)} 
            />
            
            <motion.div
              className="relative glass-dark rounded-2xl p-8 max-w-md w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Ambient Soundscape</h3>
                <p className="text-slate-400 text-sm">
                  Music that adapts to your emotional state
                </p>
              </div>

              {/* Current Mood Display */}
              <div className="flex items-center justify-center gap-3 mb-6 p-4 glass rounded-xl">
                <div
                  className="mood-orb w-8 h-8"
                  style={{ backgroundColor: currentMood.color }}
                />
                <div>
                  <div className="text-white font-medium capitalize">{currentMood.emotion}</div>
                  <div className="text-slate-400 text-sm">
                    {Math.round(currentMood.intensity * 100)}% intensity
                  </div>
                </div>
              </div>

              {/* Theme Selection */}
              <div className="space-y-3 mb-6">
                <h4 className="text-sm font-medium text-slate-300">Sound Theme</h4>
                {soundThemes.map((theme) => (
                  <motion.button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`w-full p-4 rounded-xl transition-all text-left ${
                      currentTheme === theme.id
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'glass text-slate-300 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: theme.color }}
                      >
                        <theme.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">{theme.name}</span>
                    </div>
                    <p className="text-sm opacity-80">{theme.description}</p>
                  </motion.button>
                ))}
              </div>

              {/* Playback Controls */}
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={toggleMute}
                    className="p-3 glass text-slate-300 hover:text-white hover:bg-white/10 
                             rounded-full transition-all"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={togglePlayback}
                    className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white 
                             rounded-full hover:from-purple-700 hover:to-blue-700 transition-all"
                  >
                    {isPlaying ? (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Waves className="w-6 h-6" />
                      </motion.div>
                    ) : (
                      <Music className="w-6 h-6" />
                    )}
                  </button>
                </div>

                {/* Volume Control */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Volume</span>
                    <span>{Math.round(volume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer
                             [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                             [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                             [&::-webkit-slider-thumb]:bg-purple-600"
                  />
                </div>

                {/* Now Playing */}
                {isPlaying && currentThemeData && (
                  <motion.div
                    className="text-center p-3 glass rounded-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="text-sm text-slate-400 mb-1">Now Playing</div>
                    <div className="text-white font-medium">
                      {currentThemeData.name} • {currentMood.emotion}
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 glass text-slate-300 hover:text-white hover:bg-white/10 
                           rounded-full transition-all text-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden audio element for actual playback */}
      <audio
        ref={audioRef}
        loop
        preload="none"
        className="hidden"
      />
    </>
  );
};

export default AmbientSoundPlayer;