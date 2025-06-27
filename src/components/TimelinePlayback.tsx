import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { format } from 'date-fns';
import { useMood } from '../contexts/MoodContext';

interface TimelinePlaybackProps {
  isOpen: boolean;
  onClose: () => void;
}

const TimelinePlayback: React.FC<TimelinePlaybackProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const { moodHistory } = useMood();

  // Mock extended timeline data
  const timelineData = [
    ...moodHistory,
    {
      emotion: 'excitement',
      intensity: 0.9,
      timestamp: new Date('2024-01-20'),
      keywords: ['adventure', 'new', 'possibilities'],
      color: '#f59e0b',
      content: 'Starting a new chapter in my life. Everything feels possible!',
      media: { type: 'image', url: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg' }
    },
    {
      emotion: 'contemplation',
      intensity: 0.6,
      timestamp: new Date('2024-01-18'),
      keywords: ['reflection', 'growth', 'wisdom'],
      color: '#6366f1',
      content: 'Sitting by the window, watching the rain. Sometimes the quiet moments teach us the most.',
      media: { type: 'audio', duration: 45 }
    },
    {
      emotion: 'gratitude',
      intensity: 0.8,
      timestamp: new Date('2024-01-15'),
      keywords: ['thankful', 'blessed', 'appreciation'],
      color: '#10b981',
      content: 'Overwhelmed by the kindness of friends today. Feeling so grateful for the people in my life.',
      media: { type: 'video', duration: 30 }
    }
  ].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const currentMoment = timelineData[currentIndex];

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= timelineData.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3000 / playbackSpeed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, timelineData.length]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const goToPrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => Math.min(timelineData.length - 1, prev + 1));
  };

  const jumpToMoment = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative w-full h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white">Time Travel Mode</h2>
            <p className="text-slate-400">Relive your emotional journey</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFullscreen(!showFullscreen)}
              className="p-2 glass text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
            
            <button
              onClick={onClose}
              className="px-4 py-2 glass text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
              Exit Time Travel
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Timeline Sidebar */}
          {!showFullscreen && (
            <div className="w-80 border-r border-white/10 p-6 overflow-y-auto">
              <h3 className="font-semibold text-white mb-4">Emotional Timeline</h3>
              
              <div className="space-y-3">
                {timelineData.map((moment, index) => (
                  <motion.button
                    key={index}
                    onClick={() => jumpToMoment(index)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      index === currentIndex
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'glass text-slate-300 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: moment.color }}
                      />
                      <span className="font-medium capitalize">{moment.emotion}</span>
                    </div>
                    
                    <p className="text-xs opacity-70">
                      {format(moment.timestamp, 'MMM dd, yyyy')}
                    </p>
                    
                    {moment.content && (
                      <p className="text-sm mt-2 line-clamp-2 opacity-80">
                        {moment.content}
                      </p>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Main Playback Area */}
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <AnimatePresence mode="wait">
              {currentMoment && (
                <motion.div
                  key={currentIndex}
                  className="text-center max-w-4xl w-full"
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.9 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  {/* Date */}
                  <motion.div
                    className="text-slate-400 text-lg mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {format(currentMoment.timestamp, 'EEEE, MMMM do, yyyy')}
                  </motion.div>

                  {/* Emotion Orb */}
                  <motion.div
                    className="mood-orb w-32 h-32 mx-auto mb-8"
                    style={{ backgroundColor: currentMoment.color }}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
                  />

                  {/* Emotion Title */}
                  <motion.h3
                    className="text-4xl font-bold text-white capitalize mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    {currentMoment.emotion}
                  </motion.h3>

                  {/* Intensity Bar */}
                  <motion.div
                    className="w-64 h-2 bg-slate-700 rounded-full mx-auto mb-6 overflow-hidden"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: currentMoment.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${currentMoment.intensity * 100}%` }}
                      transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                    />
                  </motion.div>

                  {/* Content */}
                  {currentMoment.content && (
                    <motion.div
                      className="prose prose-invert prose-lg max-w-none mb-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2, duration: 1 }}
                    >
                      <p className="text-slate-200 text-xl leading-relaxed">
                        {currentMoment.content}
                      </p>
                    </motion.div>
                  )}

                  {/* Media */}
                  {currentMoment.media && (
                    <motion.div
                      className="mb-8"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.4 }}
                    >
                      {currentMoment.media.type === 'image' && (
                        <img
                          src={currentMoment.media.url}
                          alt="Memory"
                          className="max-w-md mx-auto rounded-xl shadow-2xl"
                        />
                      )}
                      
                      {currentMoment.media.type === 'audio' && (
                        <div className="flex items-center justify-center gap-4 p-6 glass rounded-xl max-w-md mx-auto">
                          <Volume2 className="w-6 h-6 text-purple-400" />
                          <div className="flex-1">
                            <div className="text-white font-medium mb-1">Voice Recording</div>
                            <div className="text-slate-400 text-sm">{currentMoment.media.duration}s</div>
                          </div>
                          <button className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center transition-all">
                            <Play className="w-5 h-5 text-white ml-1" />
                          </button>
                        </div>
                      )}
                      
                      {currentMoment.media.type === 'video' && (
                        <div className="flex items-center justify-center gap-4 p-6 glass rounded-xl max-w-md mx-auto">
                          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                            <Play className="w-6 h-6 text-white ml-1" />
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium mb-1">Video Memory</div>
                            <div className="text-slate-400 text-sm">{currentMoment.media.duration}s</div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Keywords */}
                  <motion.div
                    className="flex flex-wrap justify-center gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6 }}
                  >
                    {currentMoment.keywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 glass rounded-full text-slate-300 text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="border-t border-white/10 p-6">
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="p-3 glass text-slate-300 hover:text-white hover:bg-white/10 rounded-full 
                       transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlayback}
              className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full 
                       hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </button>

            <button
              onClick={goToNext}
              disabled={currentIndex === timelineData.length - 1}
              className="p-3 glass text-slate-300 hover:text-white hover:bg-white/10 rounded-full 
                       transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 ml-8">
              <span className="text-slate-400 text-sm">Speed:</span>
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="px-2 py-1 glass rounded text-white text-sm border border-white/10 
                         focus:border-purple-400 focus:outline-none"
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 glass text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
              <span>Moment {currentIndex + 1} of {timelineData.length}</span>
              <span>{format(currentMoment?.timestamp || new Date(), 'MMM yyyy')}</span>
            </div>
            
            <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / timelineData.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TimelinePlayback;