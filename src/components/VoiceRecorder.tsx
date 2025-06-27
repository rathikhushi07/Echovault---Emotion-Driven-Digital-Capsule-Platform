import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, Pause, Trash2, Send, Volume2 } from 'lucide-react';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, transcript: string) => void;
  isRecording: boolean;
  onRecordingStateChange: (recording: boolean) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  isRecording,
  onRecordingStateChange
}) => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const analyzeAudio = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    setAudioLevel(average / 255);
    
    if (isRecording) {
      animationFrameRef.current = requestAnimationFrame(analyzeAudio);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      streamRef.current = stream;
      
      // Set up audio analysis
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        
        // Mock transcription - in real app, would use Whisper API
        setIsTranscribing(true);
        setTimeout(() => {
          const mockTranscript = "I'm feeling incredibly grateful today. The sunset was absolutely beautiful and it reminded me of childhood summers...";
          setTranscript(mockTranscript);
          setIsTranscribing(false);
        }, 2000);
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      onRecordingStateChange(true);
      
      // Start timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Start audio analysis
      analyzeAudio();
      
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      onRecordingStateChange(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const playRecording = () => {
    if (audioBlob && !isPlaying) {
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audioRef.current = audio;
      
      audio.onended = () => setIsPlaying(false);
      audio.play();
      setIsPlaying(true);
    } else if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setTranscript('');
    setRecordingTime(0);
    setAudioLevel(0);
  };

  const sendRecording = () => {
    if (audioBlob && transcript) {
      onRecordingComplete(audioBlob, transcript);
      deleteRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEmotionColor = (level: number) => {
    if (level > 0.7) return '#ef4444'; // High energy - red
    if (level > 0.4) return '#f59e0b'; // Medium energy - amber
    return '#06b6d4'; // Low energy - cyan
  };

  return (
    <div className="space-y-4">
      {/* Recording Controls */}
      <div className="flex items-center justify-center">
        {!isRecording && !audioBlob ? (
          <motion.button
            onClick={startRecording}
            className="relative w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-pink-500 
                     flex items-center justify-center hover:from-red-600 hover:to-pink-600 
                     transition-all duration-300 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mic className="w-8 h-8 text-white" />
            <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
          </motion.button>
        ) : isRecording ? (
          <div className="flex flex-col items-center gap-4">
            <motion.button
              onClick={stopRecording}
              className="relative w-20 h-20 rounded-full bg-red-500 flex items-center justify-center 
                       hover:bg-red-600 transition-all duration-300"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Square className="w-8 h-8 text-white" />
              
              {/* Audio level visualization */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-white/30"
                animate={{
                  scale: 1 + audioLevel * 0.5,
                  borderColor: getEmotionColor(audioLevel)
                }}
                transition={{ duration: 0.1 }}
              />
            </motion.button>
            
            <div className="text-center">
              <div className="text-2xl font-mono text-white mb-1">
                {formatTime(recordingTime)}
              </div>
              <div className="text-sm text-slate-300">Recording...</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={playRecording}
              className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 
                       flex items-center justify-center transition-all"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white ml-1" />
              )}
            </button>
            
            <button
              onClick={deleteRecording}
              className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 
                       flex items-center justify-center transition-all"
            >
              <Trash2 className="w-5 h-5 text-white" />
            </button>
            
            <button
              onClick={sendRecording}
              disabled={!transcript}
              className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 
                       flex items-center justify-center transition-all disabled:opacity-50"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Recording Info */}
      {audioBlob && (
        <motion.div
          className="glass-dark rounded-xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Volume2 className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-slate-300">
              Recording: {formatTime(recordingTime)}
            </span>
          </div>
          
          {isTranscribing ? (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              Transcribing audio...
            </div>
          ) : transcript ? (
            <div>
              <div className="text-sm text-slate-400 mb-2">Transcript:</div>
              <p className="text-slate-200 text-sm leading-relaxed">{transcript}</p>
            </div>
          ) : null}
        </motion.div>
      )}

      {/* Audio Waveform Visualization */}
      {isRecording && (
        <motion.div
          className="flex items-center justify-center gap-1 h-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-gradient-to-t from-purple-600 to-blue-400 rounded-full"
              animate={{
                height: [4, Math.random() * 40 + 10, 4],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 0.5 + Math.random() * 0.5,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default VoiceRecorder;