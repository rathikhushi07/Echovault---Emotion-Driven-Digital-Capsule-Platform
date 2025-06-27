import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Palette, Brain, Download, 
  Shield, Bell, Moon, Sun, Smartphone, LogOut 
} from 'lucide-react';

const Settings: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'mood'>('dark');
  const [moodInputMethod, setMoodInputMethod] = useState<'all' | 'text' | 'voice' | 'emoji'>('all');
  const [notifications, setNotifications] = useState({
    unlocks: true,
    moodReminders: false,
    weeklyInsights: true
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleExportData = () => {
    // Mock export functionality
    console.log('Exporting mood timeline...');
  };

  const handleResetSignature = () => {
    // Mock reset emotional signature
    console.log('Resetting emotional signature...');
  };

  const settingSections = [
    {
      id: 'profile',
      title: 'Profile',
      icon: User,
      items: [
        {
          label: 'Account Type',
          value: user?.isGuest ? 'Guest' : 'Registered',
          action: user?.isGuest ? 'Upgrade Account' : null
        },
        {
          label: 'Email',
          value: user?.email || 'Not set'
        }
      ]
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: Palette,
      items: [
        {
          label: 'Theme',
          type: 'select',
          value: theme,
          options: [
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'mood', label: 'Mood-based' }
          ],
          onChange: setTheme
        }
      ]
    },
    {
      id: 'mood',
      title: 'Mood Detection',
      icon: Brain,
      items: [
        {
          label: 'Input Method',
          type: 'select',
          value: moodInputMethod,
          options: [
            { value: 'all', label: 'All Methods' },
            { value: 'text', label: 'Text Only' },
            { value: 'voice', label: 'Voice Only' },
            { value: 'emoji', label: 'Emoji Only' }
          ],
          onChange: setMoodInputMethod
        },
        {
          label: 'Reset Emotional Signature',
          action: 'Reset',
          actionHandler: handleResetSignature,
          description: 'Clear your emotional baseline for fresh analysis'
        }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          label: 'Capsule Unlocks',
          type: 'toggle',
          value: notifications.unlocks,
          onChange: (value: boolean) => setNotifications(prev => ({ ...prev, unlocks: value }))
        },
        {
          label: 'Mood Reminders',
          type: 'toggle',
          value: notifications.moodReminders,
          onChange: (value: boolean) => setNotifications(prev => ({ ...prev, moodReminders: value }))
        },
        {
          label: 'Weekly Insights',
          type: 'toggle',
          value: notifications.weeklyInsights,
          onChange: (value: boolean) => setNotifications(prev => ({ ...prev, weeklyInsights: value }))
        }
      ]
    },
    {
      id: 'data',
      title: 'Data & Privacy',
      icon: Shield,
      items: [
        {
          label: 'Export Mood Timeline',
          action: 'Download PDF',
          actionHandler: handleExportData,
          description: 'Download your complete emotional journey'
        },
        {
          label: 'Data Retention',
          value: 'Keep forever'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen ambient-bg">
      {/* Header */}
      <motion.header
        className="glass-dark border-b border-white/10 sticky top-0 z-40"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 glass text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-white">Settings</h1>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-red-500/50 text-red-400 hover:border-red-500 hover:text-red-300 
                       rounded-full transition-all duration-300 flex items-center gap-2 text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Settings Navigation */}
          <motion.div
            className="lg:col-span-1"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="glass-dark rounded-xl p-6 sticky top-24">
              <h2 className="font-semibold text-white mb-4">Quick Access</h2>
              <nav className="space-y-2">
                {settingSections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white 
                             hover:bg-white/10 rounded-lg transition-all group"
                  >
                    <section.icon className="w-4 h-4 group-hover:text-purple-400 transition-colors" />
                    <span className="text-sm">{section.title}</span>
                  </a>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Settings Content */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {settingSections.map((section, sectionIndex) => (
              <motion.div
                key={section.id}
                id={section.id}
                className="glass-dark rounded-xl p-6"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: sectionIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                    <section.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                </div>

                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between py-3 border-b border-white/5 last:border-b-0">
                      <div className="flex-1">
                        <label className="text-white font-medium">{item.label}</label>
                        {item.description && (
                          <p className="text-sm text-slate-400 mt-1">{item.description}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {item.type === 'select' && (
                          <select
                            value={item.value}
                            onChange={(e) => item.onChange?.(e.target.value)}
                            className="px-3 py-2 glass rounded-lg text-white border border-white/10 
                                     focus:border-purple-400 focus:outline-none transition-all"
                          >
                            {item.options?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        )}

                        {item.type === 'toggle' && (
                          <button
                            onClick={() => item.onChange?.(!item.value)}
                            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                              item.value ? 'bg-purple-600' : 'bg-slate-600'
                            }`}
                          >
                            <motion.div
                              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                              animate={{
                                left: item.value ? '1.5rem' : '0.25rem'
                              }}
                              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                          </button>
                        )}

                        {item.action && (
                          <button
                            onClick={item.actionHandler}
                            className="px-4 py-2 glass text-purple-400 hover:text-purple-300 hover:bg-white/10 
                                     rounded-lg transition-all text-sm font-medium"
                          >
                            {item.action}
                          </button>
                        )}

                        {item.value && !item.type && !item.action && (
                          <span className="text-slate-300 text-sm">{item.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Account Actions */}
            <motion.div
              className="glass-dark rounded-xl p-6 border-l-4 border-red-500"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Danger Zone</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white font-medium">Delete Account</label>
                    <p className="text-sm text-slate-400">Permanently delete your account and all data</p>
                  </div>
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all text-sm font-medium">
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Guest Account Upgrade */}
            {user?.isGuest && (
              <motion.div
                className="glass-dark rounded-xl p-6 border-l-4 border-amber-500"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Smartphone className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-semibold text-white">Guest Account</h3>
                </div>
                <p className="text-slate-300 mb-4">
                  You're using a temporary account. Your capsules and mood history won't be saved when you leave.
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold 
                                 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300">
                  Create Permanent Account
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;