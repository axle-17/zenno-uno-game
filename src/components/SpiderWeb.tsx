import React, { useEffect, useRef } from 'react';
import { GameMode } from '../types';

export const SpiderWeb: React.FC<{ mode?: GameMode; isDarkSide?: boolean }> = ({ mode = 'Classic', isDarkSide = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const points: { x: number; y: number; vx: number; vy: number; ox: number; oy: number }[] = [];
    const numPoints = 40;
    const mouse = { x: 0, y: 0 };

    for (let i = 0; i < numPoints; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      points.push({ x, y, vx: 0, vy: 0, ox: x, oy: y });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      let strokeColor = isDarkSide ? 'rgba(255, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.15)';
      if (!isDarkSide) {
        if (mode === 'Barbie') strokeColor = 'rgba(255, 182, 193, 0.3)';
        if (mode === 'Star Wars') strokeColor = 'rgba(0, 191, 255, 0.2)';
        if (mode === 'Jurassic World Dominion') strokeColor = 'rgba(139, 69, 19, 0.2)';
        if (mode === 'Mario') strokeColor = 'rgba(255, 215, 0, 0.2)';
        if (mode === 'Avengers' || mode === 'Ultimate Marvel') strokeColor = 'rgba(255, 0, 0, 0.15)';
        if (mode === 'DC') strokeColor = 'rgba(0, 0, 255, 0.15)';
        if (mode === 'The Simpsons' || mode === 'Minions') strokeColor = 'rgba(255, 255, 0, 0.2)';
      }
      
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = isDarkSide ? 1 : 0.5;

      points.forEach((p, i) => {
        // Elasticity to original position
        const dx = p.ox - p.x;
        const dy = p.oy - p.y;
        p.vx += dx * (isDarkSide ? 0.02 : 0.01);
        p.vy += dy * (isDarkSide ? 0.02 : 0.01);

        // Mouse repulsion
        const mdx = mouse.x - p.x;
        const mdy = mouse.y - p.y;
        const dist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (dist < (isDarkSide ? 250 : 150)) {
          const force = ((isDarkSide ? 250 : 150) - dist) / (isDarkSide ? 250 : 150);
          p.vx -= mdx * force * (isDarkSide ? 0.1 : 0.05);
          p.vy -= mdy * force * (isDarkSide ? 0.1 : 0.05);
        }

        p.vx *= 0.95;
        p.vy *= 0.95;
        p.x += p.vx;
        p.y += p.vy;

        // Draw connections
        points.forEach((p2, j) => {
          if (i === j) return;
          const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (d < 200) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [mode]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};
