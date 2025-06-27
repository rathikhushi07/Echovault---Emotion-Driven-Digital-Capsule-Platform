import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RotateCcw, Check, X, Sparkles } from 'lucide-react';

interface CameraCaptureProps {
  onPhotoCapture: (photoBlob: Blob, emotion: string) => void;
  currentEmotion: string;
  emotionColor: string;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({
  onPhotoCapture,
  currentEmotion,
  emotionColor
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsOpen(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsOpen(false);
    setCapturedPhoto(null);
  };

  const switchCamera = async () => {
    stopCamera();
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    setTimeout(startCamera, 100);
  };

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsCapturing(true);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Apply emotion-based filter
    ctx.filter = getEmotionFilter(currentEmotion);
    ctx.drawImage(video, 0, 0);
    
    // Add emotion overlay
    addEmotionOverlay(ctx, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const photoUrl = URL.createObjectURL(blob);
        setCapturedPhoto(photoUrl);
        setIsCapturing(false);
      }
    }, 'image/jpeg', 0.9);
  }, [currentEmotion]);

  const getEmotionFilter = (emotion: string): string => {
    const filters = {
      joy: 'brightness(1.2) saturate(1.3) hue-rotate(10deg)',
      sadness: 'brightness(0.8) saturate(0.7) hue-rotate(200deg)',
      anger: 'brightness(1.1) saturate(1.5) hue-rotate(350deg) contrast(1.2)',
      fear: 'brightness(0.9) saturate(0.8) contrast(1.3)',
      love: 'brightness(1.1) saturate(1.2) hue-rotate(320deg)',
      calm: 'brightness(1.05) saturate(0.9) hue-rotate(180deg)',
      nostalgia: 'brightness(0.95) saturate(0.8) sepia(0.3)',
      hope: 'brightness(1.15) saturate(1.1) hue-rotate(90deg)'
    };
    
    return filters[emotion as keyof typeof filters] || 'none';
  };

  const addEmotionOverlay = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Add subtle emotion-colored vignette
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) / 2
    );
    
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(0.7, 'transparent');
    gradient.addColorStop(1, `${emotionColor}20`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add emotion text watermark
    ctx.font = `${width * 0.03}px Inter`;
    ctx.fillStyle = `${emotionColor}80`;
    ctx.textAlign = 'right';
    ctx.fillText(
      `feeling ${currentEmotion}`,
      width - 20,
      height - 20
    );
  };

  const confirmPhoto = () => {
    if (capturedPhoto && canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          onPhotoCapture(blob, currentEmotion);
          stopCamera();
        }
      }, 'image/jpeg', 0.9);
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    if (capturedPhoto) {
      URL.revokeObjectURL(capturedPhoto);
    }
  };

  return (
    <>
      <button
        onClick={startCamera}
        className="flex items-center gap-2 px-4 py-2 glass text-slate-300 hover:text-white 
                 hover:bg-white/10 rounded-full transition-all"
        title="Capture mood snap"
      >
        <Camera className="w-4 h-4" />
        Mood Snap
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {/* Camera View */}
              <div className="relative max-w-2xl w-full aspect-video bg-black rounded-xl overflow-hidden">
                {!capturedPhoto ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Emotion overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div 
                        className="absolute inset-0 opacity-20"
                        style={{
                          background: `radial-gradient(circle at center, transparent 60%, ${emotionColor}40)`
                        }}
                      />
                      
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: emotionColor }}
                        />
                        <span className="text-white text-sm font-medium capitalize">
                          {currentEmotion}
                        </span>
                      </div>
                    </div>
                    
                    {/* Capture animation */}
                    <AnimatePresence>
                      {isCapturing && (
                        <motion.div
                          className="absolute inset-0 bg-white"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 0.8, 0] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <img
                    src={capturedPhoto}
                    alt="Captured mood"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Controls */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                {!capturedPhoto ? (
                  <div className="flex items-center gap-6">
                    <button
                      onClick={switchCamera}
                      className="w-12 h-12 rounded-full glass flex items-center justify-center 
                               text-white hover:bg-white/20 transition-all"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                    
                    <motion.button
                      onClick={capturePhoto}
                      className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 
                               hover:border-gray-100 transition-all relative overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isCapturing}
                    >
                      <motion.div
                        className="absolute inset-2 rounded-full"
                        style={{ backgroundColor: emotionColor }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.button>
                    
                    <button
                      onClick={stopCamera}
                      className="w-12 h-12 rounded-full glass flex items-center justify-center 
                               text-white hover:bg-white/20 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <button
                      onClick={retakePhoto}
                      className="px-6 py-3 glass text-white rounded-full hover:bg-white/20 
                               transition-all flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Retake
                    </button>
                    
                    <button
                      onClick={confirmPhoto}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 
                               text-white rounded-full hover:from-purple-700 hover:to-blue-700 
                               transition-all flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Use Photo
                    </button>
                  </div>
                )}
              </div>

              {/* Emotion indicator */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                <motion.div
                  className="flex items-center gap-2 px-4 py-2 glass-dark rounded-full"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-white text-sm">
                    Capturing your {currentEmotion}
                  </span>
                </motion.div>
              </div>
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CameraCapture;