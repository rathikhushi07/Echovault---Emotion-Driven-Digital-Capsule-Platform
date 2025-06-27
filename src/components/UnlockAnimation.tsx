import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Sparkles, Heart } from 'lucide-react';

interface UnlockAnimationProps {
  isVisible: boolean;
  unlockType: 'fog' | 'crack' | 'liquid';
  emotion: string;
  color: string;
  onComplete: () => void;
}

const UnlockAnimation: React.FC<UnlockAnimationProps> = ({
  isVisible,
  unlockType,
  emotion,
  color,
  onComplete
}) => {
  const [stage, setStage] = useState<'locked' | 'unlocking' | 'revealed'>('locked');

  React.useEffect(() => {
    if (isVisible) {
      const timer1 = setTimeout(() => setStage('unlocking'), 500);
      const timer2 = setTimeout(() => setStage('revealed'), 2500);
      const timer3 = setTimeout(onComplete, 4000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isVisible, onComplete]);

  const FogUnlock = () => (
    <motion.div className="relative w-full h-full">
      {/* Fog layers */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-xl"
          style={{
            background: `radial-gradient(circle at ${50 + i * 10}% ${50 + i * 5}%, 
                        rgba(255, 255, 255, 0.${3 - i}) 0%, transparent 70%)`,
            filter: 'blur(20px)'
          }}
          animate={stage === 'unlocking' ? {
            opacity: [0.8, 0.4, 0],
            scale: [1, 1.5, 2],
            rotate: [0, 180, 360]
          } : {}}
          transition={{
            duration: 2,
            delay: i * 0.2,
            ease: "easeOut"
          }}
        />
      ))}
      
      {/* Content reveal */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={stage === 'revealed' ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="text-center">
          <motion.div
            className="mood-orb w-16 h-16 mx-auto mb-4"
            style={{ backgroundColor: color }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <h3 className="text-xl font-bold text-white capitalize">{emotion}</h3>
        </div>
      </motion.div>
    </motion.div>
  );

  const CrackUnlock = () => (
    <motion.div className="relative w-full h-full">
      {/* Crack lines */}
      <svg className="absolute inset-0 w-full h-full">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.path
            key={i}
            d={`M${Math.random() * 100},${Math.random() * 100} 
                L${Math.random() * 100},${Math.random() * 100} 
                L${Math.random() * 100},${Math.random() * 100}`}
            stroke={color}
            strokeWidth="2"
            fill="none"
            opacity="0.8"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={stage === 'unlocking' ? {
              pathLength: 1,
              opacity: [0, 1, 0.5]
            } : {}}
            transition={{
              duration: 1.5,
              delay: i * 0.1,
              ease: "easeOut"
            }}
          />
        ))}
      </svg>

      {/* Light emanating from cracks */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, ${color}40 0%, transparent 70%)`,
          filter: 'blur(10px)'
        }}
        initial={{ opacity: 0 }}
        animate={stage === 'unlocking' ? {
          opacity: [0, 1, 0.3],
          scale: [0.5, 1.5, 1]
        } : {}}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      {/* Shatter effect */}
      <motion.div
        className="absolute inset-0 bg-slate-800 rounded-xl"
        animate={stage === 'revealed' ? {
          scale: [1, 1.1, 0],
          opacity: [1, 0.5, 0],
          rotate: [0, 5, 0]
        } : {}}
        transition={{ duration: 0.8, ease: "easeIn" }}
      />

      {/* Content reveal */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={stage === 'revealed' ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
      >
        <div className="text-center">
          <motion.div
            className="mood-orb w-16 h-16 mx-auto mb-4"
            style={{ backgroundColor: color }}
            animate={{
              scale: [0.5, 1.2, 1],
              rotate: [0, 360, 0]
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <h3 className="text-xl font-bold text-white capitalize">{emotion}</h3>
        </div>
      </motion.div>
    </motion.div>
  );

  const LiquidUnlock = () => (
    <motion.div className="relative w-full h-full overflow-hidden rounded-xl">
      {/* Liquid drops */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 rounded-full"
          style={{
            backgroundColor: color,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: 'blur(1px)'
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={stage === 'unlocking' ? {
            scale: [0, 1.5, 0.8],
            opacity: [0, 1, 0.7],
            y: [0, Math.random() * 200 - 100],
            x: [0, Math.random() * 100 - 50]
          } : {}}
          transition={{
            duration: 2,
            delay: i * 0.1,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Liquid pool forming */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/3 rounded-b-xl"
        style={{
          background: `linear-gradient(to top, ${color}80, ${color}20, transparent)`
        }}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={stage === 'unlocking' ? {
          scaleY: [0, 1.2, 1],
          opacity: [0, 0.8, 0.6]
        } : {}}
        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
        style={{ transformOrigin: 'bottom' }}
      />

      {/* Ripple effects */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 left-1/2 w-32 h-32 border-2 rounded-full"
          style={{ borderColor: `${color}60` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={stage === 'unlocking' ? {
            scale: [0, 2, 3],
            opacity: [0, 0.6, 0]
          } : {}}
          transition={{
            duration: 2,
            delay: 1 + i * 0.3,
            ease: "easeOut"
          }}
          style={{ transform: 'translateX(-50%)' }}
        />
      ))}

      {/* Content emerging from liquid */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, y: 50 }}
        animate={stage === 'revealed' ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
      >
        <div className="text-center">
          <motion.div
            className="mood-orb w-16 h-16 mx-auto mb-4"
            style={{ backgroundColor: color }}
            animate={{
              scale: [0.8, 1.1, 1],
              y: [20, 0, 0]
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <h3 className="text-xl font-bold text-white capitalize">{emotion}</h3>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderUnlockAnimation = () => {
    switch (unlockType) {
      case 'fog':
        return <FogUnlock />;
      case 'crack':
        return <CrackUnlock />;
      case 'liquid':
        return <LiquidUnlock />;
      default:
        return <FogUnlock />;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-80 h-80 glass-dark rounded-xl border-2"
            style={{ borderColor: color }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            {/* Lock icon (initial state) */}
            <AnimatePresence>
              {stage === 'locked' && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Lock className="w-16 h-16 text-slate-400" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Unlock animation */}
            <AnimatePresence>
              {stage !== 'locked' && renderUnlockAnimation()}
            </AnimatePresence>

            {/* Sparkle effects */}
            {stage === 'revealed' && (
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                  >
                    <Sparkles className="w-4 h-4" style={{ color }} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Status text */}
          <motion.div
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-white text-lg font-medium mb-2">
              {stage === 'locked' && 'Emotional resonance detected...'}
              {stage === 'unlocking' && 'Unlocking memory...'}
              {stage === 'revealed' && 'Memory revealed!'}
            </p>
            <div className="flex items-center justify-center gap-2 text-slate-400">
              <Heart className="w-4 h-4" style={{ color }} />
              <span className="text-sm capitalize">Feeling {emotion}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UnlockAnimation;