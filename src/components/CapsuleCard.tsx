import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Calendar, Eye, Share, Mic, Camera, FileText, Play } from 'lucide-react';
import { format } from 'date-fns';
import UnlockAnimation from './UnlockAnimation';

interface Capsule {
  id: string;
  title: string;
  emotion: string;
  intensity: number;
  color: string;
  createdAt: Date;
  isLocked: boolean;
  unlockDate?: Date;
  preview: string;
  hasVoiceNote?: boolean;
  hasMoodSnap?: boolean;
  mediaCount?: number;
}

interface CapsuleCardProps {
  capsule: Capsule;
}

const CapsuleCard: React.FC<CapsuleCardProps> = ({ capsule }) => {
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  const [unlockType] = useState<'fog' | 'crack' | 'liquid'>('fog'); // Could be randomized

  const handleCapsuleClick = () => {
    if (!capsule.isLocked) {
      // Open capsule
      console.log('Opening capsule:', capsule.id);
    } else {
      // Show unlock animation
      setShowUnlockAnimation(true);
    }
  };

  const handleUnlockComplete = () => {
    setShowUnlockAnimation(false);
    // Here you would actually unlock the capsule
    console.log('Capsule unlocked!');
  };

  return (
    <>
      <motion.div
        className={`glass-dark rounded-xl p-6 cursor-pointer transition-all duration-300 ${
          capsule.isLocked 
            ? 'hover:bg-white/5 border-l-4 border-slate-600' 
            : 'hover:bg-white/10 border-l-4 hover:scale-105'
        }`}
        style={{ borderLeftColor: capsule.isLocked ? '#64748b' : capsule.color }}
        onClick={handleCapsuleClick}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="mood-orb w-8 h-8"
              style={{ backgroundColor: capsule.isLocked ? '#64748b' : capsule.color }}
              animate={{
                opacity: capsule.isLocked ? [0.5, 0.8, 0.5] : 1
              }}
              transition={{
                duration: 2,
                repeat: capsule.isLocked ? Infinity : 0
              }}
            />
            <div>
              <h3 className="font-semibold text-white">{capsule.title}</h3>
              <p className="text-sm text-slate-400 capitalize">
                {capsule.emotion} • {Math.round(capsule.intensity * 100)}%
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {capsule.isLocked ? (
              <Lock className="w-4 h-4 text-slate-500" />
            ) : (
              <Unlock className="w-4 h-4 text-green-400" />
            )}
          </div>
        </div>

        <p className={`text-sm mb-4 ${
          capsule.isLocked ? 'text-slate-500 italic' : 'text-slate-300'
        }`}>
          {capsule.isLocked ? '*** Sealed until emotional resonance ***' : capsule.preview}
        </p>

        {/* Enhanced Media Indicators */}
        {!capsule.isLocked && (capsule.hasVoiceNote || capsule.hasMoodSnap || (capsule.mediaCount && capsule.mediaCount > 0)) && (
          <div className="flex items-center gap-2 mb-4">
            {capsule.hasVoiceNote && (
              <div className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 rounded-full text-xs text-purple-300">
                <Mic className="w-3 h-3" />
                Voice
              </div>
            )}
            {capsule.hasMoodSnap && (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 rounded-full text-xs text-blue-300">
                <Camera className="w-3 h-3" />
                Snap
              </div>
            )}
            {capsule.mediaCount && capsule.mediaCount > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full text-xs text-green-300">
                <FileText className="w-3 h-3" />
                {capsule.mediaCount}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Created {format(capsule.createdAt, 'MMM dd, yyyy')}</span>
          </div>
          
          {capsule.unlockDate && (
            <div className="flex items-center gap-1">
              {capsule.isLocked ? (
                <>
                  <Lock className="w-3 h-3" />
                  <span>Unlocks {format(capsule.unlockDate, 'MMM dd')}</span>
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3" />
                  <span>Opened {format(capsule.unlockDate, 'MMM dd')}</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Action buttons for unlocked capsules */}
        {!capsule.isLocked && (
          <motion.div
            className="flex gap-2 mt-4 pt-4 border-t border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.2 }}
          >
            <button className="flex items-center gap-1 px-3 py-1 bg-white/10 rounded-full text-xs text-slate-300 hover:text-white transition-colors">
              <Eye className="w-3 h-3" />
              View
            </button>
            {capsule.hasVoiceNote && (
              <button className="flex items-center gap-1 px-3 py-1 bg-purple-500/20 rounded-full text-xs text-purple-300 hover:text-purple-200 transition-colors">
                <Play className="w-3 h-3" />
                Play
              </button>
            )}
            <button className="flex items-center gap-1 px-3 py-1 bg-white/10 rounded-full text-xs text-slate-300 hover:text-white transition-colors">
              <Share className="w-3 h-3" />
              Share
            </button>
          </motion.div>
        )}

        {/* Enhanced Locked capsule hint */}
        {capsule.isLocked && (
          <motion.div
            className="mt-4 pt-4 border-t border-slate-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-xs text-slate-500 text-center">
              This memory awaits your emotional return
            </p>
            <div className="flex justify-center mt-2">
              <motion.div
                className="w-2 h-2 bg-slate-600 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Unlock Animation */}
      <UnlockAnimation
        isVisible={showUnlockAnimation}
        unlockType={unlockType}
        emotion={capsule.emotion}
        color={capsule.color}
        onComplete={handleUnlockComplete}
      />
    </>
  );
};

export default CapsuleCard;