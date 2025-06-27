import React from 'react';
import { motion } from 'framer-motion';
import { useMood } from '../contexts/MoodContext';
import { Activity } from 'lucide-react';

const LiveMoodMeter: React.FC = () => {
  const { currentMood, isAnalyzing } = useMood();

  return (
    <motion.div
      className="glass-dark rounded-xl p-6"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <Activity className="w-5 h-5 text-purple-400" />
        <h3 className="font-semibold text-white">Live Mood</h3>
      </div>

      <div className="text-center">
        <motion.div
          className="mood-orb w-20 h-20 mx-auto mb-4"
          style={{ backgroundColor: currentMood.color }}
          animate={{
            scale: isAnalyzing ? [1, 1.1, 1] : 1,
            opacity: isAnalyzing ? [0.7, 1, 0.7] : 1
          }}
          transition={{
            duration: 1.5,
            repeat: isAnalyzing ? Infinity : 0
          }}
        />

        <h4 className="text-lg font-bold text-white capitalize mb-2">
          {currentMood.emotion}
        </h4>

        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: currentMood.color }}
            initial={{ width: 0 }}
            animate={{ width: `${currentMood.intensity * 100}%` }}
            transition={{ duration: 1 }}
          />
        </div>

        <p className="text-sm text-slate-400">
          {Math.round(currentMood.intensity * 100)}% intensity
        </p>

        <div className="flex flex-wrap justify-center gap-1 mt-3">
          {currentMood.keywords.slice(0, 3).map((keyword, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-white/10 rounded-full text-xs text-slate-300"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LiveMoodMeter;