import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Unlock, MessageCircle, Filter, Search } from 'lucide-react';

const PublicFeed: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Mock public capsules data
  const publicCapsules = [
    {
      id: '1',
      emotion: 'joy',
      intensity: 0.9,
      color: '#f59e0b',
      preview: 'Finally graduated after years of hard work! The feeling of accomplishment is incredible...',
      keywords: ['achievement', 'graduation', 'proud'],
      unlockAttempts: 12,
      resonanceScore: 85,
      location: 'New York',
      timeAgo: '2 hours ago'
    },
    {
      id: '2',
      emotion: 'nostalgia',
      intensity: 0.7,
      color: '#f97316',
      preview: 'Found my childhood diary today. The innocence and dreams I had back then...',
      keywords: ['childhood', 'memories', 'reflection'],
      unlockAttempts: 8,
      resonanceScore: 72,
      location: 'California',
      timeAgo: '5 hours ago'
    },
    {
      id: '3',
      emotion: 'love',
      intensity: 0.95,
      color: '#ec4899',
      preview: 'She said yes! My heart feels like it could burst with happiness right now...',
      keywords: ['proposal', 'love', 'happiness'],
      unlockAttempts: 23,
      resonanceScore: 91,
      location: 'Paris',
      timeAgo: '1 day ago'
    },
    {
      id: '4',
      emotion: 'melancholy',
      intensity: 0.6,
      color: '#6366f1',
      preview: 'Rainy Sunday afternoon, feeling contemplative about life choices...',
      keywords: ['reflection', 'rain', 'contemplation'],
      unlockAttempts: 6,
      resonanceScore: 68,
      location: 'Seattle',
      timeAgo: '1 day ago'
    },
    {
      id: '5',
      emotion: 'hope',
      intensity: 0.8,
      color: '#10b981',
      preview: 'Starting therapy today. Scared but hopeful for positive changes ahead...',
      keywords: ['therapy', 'growth', 'courage'],
      unlockAttempts: 15,
      resonanceScore: 79,
      location: 'Toronto',
      timeAgo: '2 days ago'
    }
  ];

  const emotions = [
    { name: 'all', color: '#8b5cf6', label: 'All Emotions' },
    { name: 'joy', color: '#f59e0b', label: 'Joy' },
    { name: 'love', color: '#ec4899', label: 'Love' },
    { name: 'nostalgia', color: '#f97316', label: 'Nostalgia' },
    { name: 'hope', color: '#10b981', label: 'Hope' },
    { name: 'melancholy', color: '#6366f1', label: 'Melancholy' },
    { name: 'calm', color: '#06b6d4', label: 'Calm' }
  ];

  const filteredCapsules = publicCapsules.filter(capsule => {
    const matchesEmotion = selectedEmotion === 'all' || capsule.emotion === selectedEmotion;
    const matchesSearch = searchQuery === '' || 
      capsule.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      capsule.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesEmotion && matchesSearch;
  });

  const handleUnlockAttempt = (capsuleId: string) => {
    // Mock unlock attempt - in real app, would analyze current mood
    console.log('Attempting to unlock capsule:', capsuleId);
  };

  const handleReflect = (capsuleId: string) => {
    // Navigate to compose with similar emotion
    navigate('/compose');
  };

  return (
    <div className="min-h-screen ambient-bg">
      {/* Header */}
      <motion.header
        className="glass-dark border-b border-white/10 sticky top-0 z-40"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 glass text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">Public Emotion Feed</h1>
                <p className="text-sm text-slate-400">Discover capsules from souls who felt like you</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search emotions..."
                  className="pl-9 pr-4 py-2 glass rounded-full text-white placeholder-slate-400 
                           border border-white/10 focus:border-purple-400 focus:outline-none transition-all w-48"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Emotion Filter */}
        <motion.div
          className="mb-8"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Filter by Emotion</h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {emotions.map((emotion) => (
              <button
                key={emotion.name}
                onClick={() => setSelectedEmotion(emotion.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                  selectedEmotion === emotion.name
                    ? 'text-white'
                    : 'glass text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                style={selectedEmotion === emotion.name ? { backgroundColor: emotion.color } : {}}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: emotion.color }}
                />
                {emotion.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Capsules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCapsules.map((capsule, index) => (
            <motion.div
              key={capsule.id}
              className="glass-dark rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="mood-orb w-8 h-8"
                    style={{ backgroundColor: capsule.color }}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <div>
                    <p className="font-semibold text-white capitalize">{capsule.emotion}</p>
                    <p className="text-xs text-slate-400">{capsule.location} • {capsule.timeAgo}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-medium text-purple-400">{capsule.resonanceScore}%</p>
                  <p className="text-xs text-slate-500">resonance</p>
                </div>
              </div>

              {/* Preview */}
              <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                {capsule.preview}
              </p>

              {/* Keywords */}
              <div className="flex flex-wrap gap-2 mb-4">
                {capsule.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-white/10 rounded-full text-xs text-slate-300"
                  >
                    {keyword}
                  </span>
                ))}
              </div>

              {/* Intensity Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Emotional Intensity</span>
                  <span>{Math.round(capsule.intensity * 100)}%</span>
                </div>
                <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: capsule.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${capsule.intensity * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleUnlockAttempt(capsule.id)}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white 
                           rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 
                           flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Unlock className="w-4 h-4" />
                  Try to Unlock
                </button>
                
                <button
                  onClick={() => handleReflect(capsule.id)}
                  className="px-3 py-2 glass text-slate-300 hover:text-white hover:bg-white/10 
                           rounded-lg transition-all flex items-center gap-2 text-sm"
                  title="Write a reflection"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
                
                <button
                  className="px-3 py-2 glass text-slate-300 hover:text-white hover:bg-white/10 
                           rounded-lg transition-all flex items-center gap-2 text-sm"
                  title="Follow this emotion"
                >
                  <Heart className="w-4 h-4" />
                </button>
              </div>

              {/* Unlock attempts */}
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-xs text-slate-500 text-center">
                  {capsule.unlockAttempts} people have tried to unlock this memory
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCapsules.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="mood-orb w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-blue-600" />
            <h3 className="text-2xl font-bold text-white mb-4">No capsules found</h3>
            <p className="text-slate-300 mb-8 max-w-md mx-auto">
              No public capsules match your current filters. Try adjusting your search or emotion filter.
            </p>
            <button
              onClick={() => {
                setSelectedEmotion('all');
                setSearchQuery('');
              }}
              className="px-6 py-3 glass text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300"
            >
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* Global Mood Map Teaser */}
        <motion.div
          className="mt-16 glass-dark rounded-xl p-8 text-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-2xl font-bold text-white mb-4">Global Emotion Constellation</h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            See how emotions flow across the world in real-time. Each star represents 
            a shared feeling, creating a map of human experience.
          </p>
          
          {/* Mock constellation */}
          <div className="relative h-32 mb-6 overflow-hidden rounded-lg">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  backgroundColor: emotions[Math.floor(Math.random() * emotions.length)].color,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>
          
          <button className="px-6 py-3 border border-purple-400/50 text-purple-200 font-semibold rounded-full 
                           hover:border-purple-400 hover:text-purple-100 transition-all duration-300">
            Explore Mood Map
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicFeed;