import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useMood } from '../contexts/MoodContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Users, Globe, Settings, LogOut, Heart, Sparkles, Play } from 'lucide-react';
import MoodTimeline from '../components/MoodTimeline';
import CapsuleCard from '../components/CapsuleCard';
import LiveMoodMeter from '../components/LiveMoodMeter';
import TimelinePlayback from '../components/TimelinePlayback';
import AIMoodCompanion from '../components/AIMoodCompanion';
import AmbientSoundPlayer from '../components/AmbientSoundPlayer';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'my' | 'sent' | 'received' | 'public'>('my');
  const [showTimelinePlayback, setShowTimelinePlayback] = useState(false);
  const { user, logout } = useAuth();
  const { currentMood, moodHistory } = useMood();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Mock capsule data with enhanced features
  const mockCapsules = [
    {
      id: '1',
      title: 'Summer Memories',
      emotion: 'joy',
      intensity: 0.8,
      color: '#f59e0b',
      createdAt: new Date('2024-01-15'),
      isLocked: false,
      unlockDate: new Date('2024-02-01'),
      preview: 'The warmth of that perfect summer day...',
      hasVoiceNote: true,
      hasMoodSnap: true,
      mediaCount: 3
    },
    {
      id: '2',
      title: 'Midnight Thoughts',
      emotion: 'nostalgia',
      intensity: 0.6,
      color: '#f97316',
      createdAt: new Date('2024-01-10'),
      isLocked: true,
      unlockDate: new Date('2024-03-01'),
      preview: 'Late night reflections on life...',
      hasVoiceNote: false,
      hasMoodSnap: false,
      mediaCount: 1
    },
    {
      id: '3',
      title: 'First Day Excitement',
      emotion: 'excitement',
      intensity: 0.9,
      color: '#8b5cf6',
      createdAt: new Date('2024-01-05'),
      isLocked: false,
      unlockDate: new Date('2024-01-20'),
      preview: 'The beginning of something new...',
      hasVoiceNote: true,
      hasMoodSnap: true,
      mediaCount: 5
    }
  ];

  const tabs = [
    { id: 'my', label: 'My Capsules', icon: Heart },
    { id: 'sent', label: 'Sent', icon: Calendar },
    { id: 'received', label: 'Received', icon: Users },
    { id: 'public', label: 'Public', icon: Globe }
  ];

  return (
    <div className="min-h-screen ambient-bg">
      {/* Header */}
      <motion.header
        className="glass-dark border-b border-white/10 sticky top-0 z-40"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="mood-orb w-10 h-10" style={{ backgroundColor: currentMood.color }} />
              <div>
                <h1 className="text-xl font-bold text-white">
                  Welcome back, {user?.isGuest ? 'Guest' : user?.name}
                </h1>
                <p className="text-sm text-slate-400 capitalize">
                  Currently feeling {currentMood.emotion}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowTimelinePlayback(true)}
                className="px-4 py-2 glass text-slate-300 hover:text-white hover:bg-white/10 
                         rounded-full transition-all flex items-center gap-2"
                title="Time Travel Mode"
              >
                <Play className="w-4 h-4" />
                Time Travel
              </button>
              
              <button
                onClick={() => navigate('/compose')}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold 
                         rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 
                         flex items-center gap-2 glow-primary"
              >
                <Plus className="w-5 h-5" />
                Create Capsule
              </button>
              
              <button
                onClick={() => navigate('/settings')}
                className="p-2 glass text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleLogout}
                className="p-2 glass text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <motion.div
            className="lg:col-span-1 space-y-6"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <LiveMoodMeter />
            <MoodTimeline data={moodHistory} />
            
            {user?.isGuest && (
              <motion.div
                className="glass-dark rounded-xl p-4 border-l-4 border-amber-500"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span className="font-semibold text-amber-400">Guest Mode</span>
                </div>
                <p className="text-sm text-slate-300">
                  Your vault is temporary. Sign up to save your memories permanently.
                </p>
                <button className="mt-3 text-sm text-amber-400 hover:text-amber-300 underline">
                  Create Account
                </button>
              </motion.div>
            )}

            {/* Quick Stats */}
            <motion.div
              className="glass-dark rounded-xl p-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="font-semibold text-white mb-3">Vault Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Total Capsules</span>
                  <span className="text-purple-400">{mockCapsules.length}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Locked</span>
                  <span className="text-amber-400">{mockCapsules.filter(c => c.isLocked).length}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>With Voice</span>
                  <span className="text-green-400">{mockCapsules.filter(c => c.hasVoiceNote).length}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Mood Snaps</span>
                  <span className="text-blue-400">{mockCapsules.filter(c => c.hasMoodSnap).length}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="lg:col-span-3"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'glass text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Capsules Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockCapsules.map((capsule, index) => (
                <motion.div
                  key={capsule.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CapsuleCard capsule={capsule} />
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {mockCapsules.length === 0 && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="mood-orb w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-blue-600" />
                <h3 className="text-2xl font-bold text-white mb-4">No capsules yet</h3>
                <p className="text-slate-300 mb-8 max-w-md mx-auto">
                  Start your emotional journey by creating your first time capsule. 
                  Capture this moment and seal it for your future self.
                </p>
                <button
                  onClick={() => navigate('/compose')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold 
                           rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 
                           flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Capsule
                </button>
              </motion.div>
            )}

            {/* Enhanced Features CTA */}
            {activeTab === 'my' && mockCapsules.length > 0 && (
              <motion.div
                className="mt-12 grid md:grid-cols-2 gap-6"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="glass-dark rounded-xl p-6 text-center">
                  <h3 className="text-xl font-bold text-white mb-2">Discover Shared Emotions</h3>
                  <p className="text-slate-300 mb-4">
                    Explore capsules from others who've felt what you're feeling
                  </p>
                  <button
                    onClick={() => navigate('/public')}
                    className="px-6 py-3 border border-purple-400/50 text-purple-200 font-semibold rounded-full 
                             hover:border-purple-400 hover:text-purple-100 transition-all duration-300"
                  >
                    Explore Public Feed
                  </button>
                </div>

                <div className="glass-dark rounded-xl p-6 text-center">
                  <h3 className="text-xl font-bold text-white mb-2">Relive Your Journey</h3>
                  <p className="text-slate-300 mb-4">
                    Experience your emotional timeline in cinematic playback
                  </p>
                  <button
                    onClick={() => setShowTimelinePlayback(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold 
                             rounded-full hover:from-blue-700 hover:to-teal-700 transition-all duration-300 
                             flex items-center gap-2 mx-auto"
                  >
                    <Play className="w-4 h-4" />
                    Time Travel Mode
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Enhanced Components */}
      <AIMoodCompanion />
      <AmbientSoundPlayer />
      
      {/* Timeline Playback Modal */}
      <TimelinePlayback
        isOpen={showTimelinePlayback}
        onClose={() => setShowTimelinePlayback(false)}
      />
    </div>
  );
};

export default Dashboard;