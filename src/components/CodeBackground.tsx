import { useEffect, useRef } from 'react';

export function CodeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let drops: number[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const fontSize = 14;
      const columns = Math.ceil(canvas.width / fontSize);
      drops = new Array(columns).fill(1).map(() => Math.random() * -100); // Start at random negative positions
    };

    const draw = () => {
      // Semi-transparent black to create trail effect
      ctx.fillStyle = 'rgba(8, 18, 16, 0.1)'; // #081210 with opacity
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0'; // Green text
      ctx.font = '14px monospace';

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = String.fromCharCode(0x30A0 + Math.random() * 96);
        
        // Color variation for "matrix" feel - some brighter, some darker
        const isBright = Math.random() > 0.95;
        ctx.fillStyle = isBright ? '#4ade80' : '#15803d'; // emerald-400 vs emerald-700

        ctx.fillText(text, i * 14, drops[i] * 14);

        if (drops[i] * 14 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
    />
  );
}
