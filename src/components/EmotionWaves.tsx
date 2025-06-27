import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const EmotionWaves: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationId: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create flowing wave patterns
      const waves = [
        { color: 'rgba(139, 92, 246, 0.1)', speed: 0.5, amplitude: 50, offset: 0 },
        { color: 'rgba(6, 182, 212, 0.08)', speed: 0.3, amplitude: 80, offset: Math.PI / 3 },
        { color: 'rgba(245, 158, 11, 0.06)', speed: 0.7, amplitude: 30, offset: Math.PI / 2 }
      ];

      waves.forEach(wave => {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);

        for (let x = 0; x <= canvas.width; x += 10) {
          const y = canvas.height / 2 + 
                   Math.sin((x * 0.01) + (time * wave.speed) + wave.offset) * wave.amplitude +
                   Math.sin((x * 0.005) + (time * wave.speed * 0.5) + wave.offset) * wave.amplitude * 0.5;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        ctx.fillStyle = wave.color;
        ctx.fill();
      });

      time += 0.02;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: 'overlay' }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="particle absolute w-2 h-2 bg-purple-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default EmotionWaves;