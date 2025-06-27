import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useMood } from '../contexts/MoodContext';
import { 
  ArrowLeft, Type, Mic, Image, Film, Calendar, Lock, 
  Eye, Send, Sparkles, Play, Pause, Upload, X, Camera 
} from 'lucide-react';
import VoiceRecorder from '../components/VoiceRecorder';
import CameraCapture from '../components/CameraCapture';

const CapsuleComposer: React.FC = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [lockType, setLockType] = useState<'mood' | 'date' | 'event'>('mood');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { analyzeMood, currentMood, isAnalyzing } = useMood();
  const navigate = useNavigate();

  const [analyzedMood, setAnalyzedMood] = useState(currentMood);

  const handleContentChange = (value: string) => {
    setContent(value);
    if (value.trim()) {
      const mood = analyzeMood(value);
      setAnalyzedMood(mood);
    }
  };

  const handleVoiceRecording = (audioBlob: Blob, transcript: string) => {
    setVoiceTranscript(transcript);
    setContent(prev => prev + (prev ? '\n\n' : '') + `🎤 Voice Note: "${transcript}"`);
    
    // Convert blob to file and add to media files
    const audioFile = new File([audioBlob], `voice-${Date.now()}.webm`, { type: 'audio/webm' });
    setMediaFiles(prev => [...prev, audioFile]);
  };

  const handlePhotoCapture = (photoBlob: Blob, emotion: string) => {
    const photoFile = new File([photoBlob], `mood-snap-${Date.now()}.jpg`, { type: 'image/jpeg' });
    setMediaFiles(prev => [...prev, photoFile]);
    
    // Create preview URL
    const photoUrl = URL.createObjectURL(photoBlob);
    setCapturedPhotos(prev => [...prev, photoUrl]);
    
    setContent(prev => prev + (prev ? '\n\n' : '') + `📸 Mood Snap: Captured while feeling ${emotion}`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setMediaFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSealCapsule = () => {
    // Create capsule with current data
    const capsuleData = {
      title: title || 'Untitled Memory',
      content,
      mood: analyzedMood,
      lockType,
      unlockCondition: lockType === 'date' ? selectedDate : lockType === 'event' ? selectedEvent : analyzedMood.emotion,
      mediaFiles: mediaFiles.map(f => f.name),
      voiceTranscript,
      capturedPhotos: capturedPhotos.length,
      createdAt: new Date()
    };
    
    console.log('Sealing capsule:', capsuleData);
    navigate('/dashboard');
  };

  const events = [
    'Graduation', 'Birthday', 'Wedding', 'New Job', 'Moving Day',
    'Anniversary', 'Holiday', 'Achievement', 'Breakup', 'Reunion'
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
              <h1 className="text-xl font-bold text-white">Create Memory Capsule</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(true)}
                className="px-4 py-2 glass text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-all flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={handleSealCapsule}
                disabled={!content.trim()}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold 
                         rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Seal Capsule
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Composer */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Title Input */}
            <div className="glass-dark rounded-xl p-6">
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Memory Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your memory a name..."
                className="w-full p-4 glass rounded-xl text-white placeholder-slate-400 
                         border border-white/10 focus:border-purple-400 focus:outline-none transition-all"
              />
            </div>

            {/* Content Input */}
            <div className="glass-dark rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-slate-300">
                  Capture Your Moment
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 glass text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-all"
                    title="Add media"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                  
                  <CameraCapture
                    onPhotoCapture={handlePhotoCapture}
                    currentEmotion={analyzedMood.emotion}
                    emotionColor={analyzedMood.color}
                  />
                </div>
              </div>

              <textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Write about this moment... How are you feeling? What's happening? What do you want your future self to remember?"
                className="w-full h-64 p-4 glass rounded-xl text-white placeholder-slate-400 
                         border border-white/10 focus:border-purple-400 focus:outline-none 
                         resize-none transition-all"
              />

              {/* Voice Recorder */}
              <div className="mt-6">
                <VoiceRecorder
                  onRecordingComplete={handleVoiceRecording}
                  isRecording={isRecording}
                  onRecordingStateChange={setIsRecording}
                />
              </div>

              {/* Media Files */}
              {mediaFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-slate-400">Attached files:</p>
                  <div className="grid grid-cols-2 gap-3">
                    {mediaFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 glass rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="text-slate-300 text-sm font-medium truncate">
                            {file.name}
                          </div>
                          <div className="text-slate-500 text-xs">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-slate-400 hover:text-red-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Captured Photos Preview */}
              {capturedPhotos.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-slate-400 mb-2">Mood Snaps:</p>
                  <div className="flex gap-2 overflow-x-auto">
                    {capturedPhotos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Mood snap ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border border-white/20"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Lock Settings */}
            <div className="glass-dark rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Emotional Time Lock
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  {[
                    { id: 'mood', label: 'Match Current Mood', icon: Sparkles },
                    { id: 'date', label: 'Specific Date', icon: Calendar },
                    { id: 'event', label: 'Life Event', icon: Send }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setLockType(option.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                        lockType === option.id
                          ? 'bg-purple-600 text-white'
                          : 'glass text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <option.icon className="w-4 h-4" />
                      {option.label}
                    </button>
                  ))}
                </div>

                {lockType === 'date' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-3 glass rounded-xl text-white border border-white/10 
                               focus:border-purple-400 focus:outline-none transition-all"
                    />
                  </motion.div>
                )}

                {lockType === 'event' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <select
                      value={selectedEvent}
                      onChange={(e) => setSelectedEvent(e.target.value)}
                      className="w-full p-3 glass rounded-xl text-white border border-white/10 
                               focus:border-purple-400 focus:outline-none transition-all"
                    >
                      <option value="">Select a life event...</option>
                      {events.map(event => (
                        <option key={event} value={event}>{event}</option>
                      ))}
                    </select>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Mood Analysis Sidebar */}
          <motion.div
            className="lg:col-span-1 space-y-6"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Current Mood */}
            <div className="glass-dark rounded-xl p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Emotional Analysis
              </h3>

              <div className="text-center">
                <motion.div
                  className="mood-orb w-20 h-20 mx-auto mb-4"
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
                  <p className="text-slate-300">Analyzing emotions...</p>
                ) : (
                  <div>
                    <h4 className="text-lg font-bold text-white capitalize mb-2">
                      {analyzedMood.emotion}
                    </h4>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: analyzedMood.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${analyzedMood.intensity * 100}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                    <p className="text-sm text-slate-400 mb-4">
                      {Math.round(analyzedMood.intensity * 100)}% intensity
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {analyzedMood.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white/10 rounded-full text-xs text-slate-300"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Lock Preview */}
            <div className="glass-dark rounded-xl p-6">
              <h3 className="font-semibold text-white mb-4">Lock Preview</h3>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <p className="text-sm text-slate-300">
                  {lockType === 'mood' && `Unlocks when feeling ${analyzedMood.emotion}`}
                  {lockType === 'date' && selectedDate && `Unlocks on ${new Date(selectedDate).toLocaleDateString()}`}
                  {lockType === 'event' && selectedEvent && `Unlocks during ${selectedEvent}`}
                  {!selectedDate && lockType === 'date' && 'Select unlock date'}
                  {!selectedEvent && lockType === 'event' && 'Select life event'}
                </p>
              </div>
            </div>

            {/* Enhanced Tips */}
            <div className="glass-dark rounded-xl p-6">
              <h3 className="font-semibold text-white mb-3">💡 Enhanced Tips</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Use voice notes for authentic emotional capture</li>
                <li>• Take mood snaps with emotion-based filters</li>
                <li>• Include context about what's happening</li>
                <li>• Trust the timing of emotional unlocks</li>
                <li>• Mix media types for richer memories</li>
              </ul>
            </div>

            {/* Media Summary */}
            {(mediaFiles.length > 0 || capturedPhotos.length > 0) && (
              <div className="glass-dark rounded-xl p-6">
                <h3 className="font-semibold text-white mb-3">📎 Media Summary</h3>
                <div className="space-y-2 text-sm text-slate-300">
                  {mediaFiles.filter(f => f.type.startsWith('audio')).length > 0 && (
                    <div>🎤 {mediaFiles.filter(f => f.type.startsWith('audio')).length} voice recording(s)</div>
                  )}
                  {capturedPhotos.length > 0 && (
                    <div>📸 {capturedPhotos.length} mood snap(s)</div>
                  )}
                  {mediaFiles.filter(f => f.type.startsWith('image')).length > 0 && (
                    <div>🖼️ {mediaFiles.filter(f => f.type.startsWith('image')).length} image(s)</div>
                  )}
                  {mediaFiles.filter(f => f.type.startsWith('video')).length > 0 && (
                    <div>🎥 {mediaFiles.filter(f => f.type.startsWith('video')).length} video(s)</div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowPreview(false)} />
            <motion.div
              className="relative glass-dark rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Capsule Preview</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {title || 'Untitled Memory'}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: analyzedMood.color }} />
                    <span className="capitalize">{analyzedMood.emotion}</span>
                    <span>•</span>
                    <span>{Math.round(analyzedMood.intensity * 100)}% intensity</span>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-300 whitespace-pre-wrap">{content}</p>
                </div>

                {capturedPhotos.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-2">Mood Snaps</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {capturedPhotos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Mood snap ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {mediaFiles.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-2">Attached Media</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {mediaFiles.map((file, index) => (
                        <div key={index} className="p-3 bg-white/5 rounded-lg text-sm text-slate-300">
                          {file.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-white/10 pt-4">
                  <p className="text-sm text-slate-400">
                    🔒 This capsule will be sealed and unlock when:
                  </p>
                  <p className="text-white font-medium">
                    {lockType === 'mood' && `Your future self feels ${analyzedMood.emotion}`}
                    {lockType === 'date' && selectedDate && `${new Date(selectedDate).toLocaleDateString()}`}
                    {lockType === 'event' && selectedEvent && `During your ${selectedEvent}`}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CapsuleComposer;