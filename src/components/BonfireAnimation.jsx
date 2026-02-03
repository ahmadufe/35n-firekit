import React, { useEffect, useRef } from 'react';

export default function BonfireAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 300;
    canvas.height = 400;

    // Particle class for flying embers
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = 150 + (Math.random() - 0.5) * 40;
        this.y = 250;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = -Math.random() * 3 - 2;
        this.life = 1;
        this.size = Math.random() * 3 + 1;
        this.decay = Math.random() * 0.01 + 0.005;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy -= 0.05; // Gravity effect (upward)
        this.life -= this.decay;
        
        if (this.life <= 0) {
          this.reset();
        }
      }

      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        
        // Ember glow
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
        gradient.addColorStop(0, '#ff6b35');
        gradient.addColorStop(0.5, '#ff8c42');
        gradient.addColorStop(1, 'rgba(255, 107, 53, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Core ember
        ctx.fillStyle = '#ffdd00';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
    }

    // Flame class
    class Flame {
      constructor(x, y, index, total) {
        this.baseX = x;
        this.baseY = y;
        this.x = x;
        this.y = y;
        this.offset = (index / total) * Math.PI * 2;
        this.targetHeight = Math.random() * 60 + 80;
        this.currentHeight = 0;
        this.width = Math.random() * 30 + 40;
      }

      update(time) {
        const wobble = Math.sin(time * 0.003 + this.offset) * 15;
        this.x = this.baseX + wobble;
        
        // Animate height
        this.currentHeight += (this.targetHeight - this.currentHeight) * 0.1;
        
        // Occasionally change target height
        if (Math.random() < 0.01) {
          this.targetHeight = Math.random() * 60 + 80;
        }
      }

      draw(ctx, time) {
        ctx.save();
        
        // Create flame gradient
        const gradient = ctx.createLinearGradient(
          this.x, 
          this.baseY, 
          this.x, 
          this.baseY - this.currentHeight
        );
        gradient.addColorStop(0, '#ff6b35');
        gradient.addColorStop(0.3, '#ff8c42');
        gradient.addColorStop(0.6, '#ffa500');
        gradient.addColorStop(1, '#ffdd00');
        
        ctx.fillStyle = gradient;
        
        // Draw flame shape
        ctx.beginPath();
        ctx.moveTo(this.x - this.width / 2, this.baseY);
        
        // Left curve
        ctx.bezierCurveTo(
          this.x - this.width / 2, 
          this.baseY - this.currentHeight * 0.3,
          this.x - this.width / 4, 
          this.baseY - this.currentHeight * 0.6,
          this.x, 
          this.baseY - this.currentHeight
        );
        
        // Right curve
        ctx.bezierCurveTo(
          this.x + this.width / 4, 
          this.baseY - this.currentHeight * 0.6,
          this.x + this.width / 2, 
          this.baseY - this.currentHeight * 0.3,
          this.x + this.width / 2, 
          this.baseY
        );
        
        ctx.closePath();
        ctx.fill();
        
        // Inner glow
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = 'rgba(255, 221, 0, 0.3)';
        ctx.fill();
        
        ctx.restore();
      }
    }

    // Initialize flames
    const flames = [];
    for (let i = 0; i < 5; i++) {
      flames.push(new Flame(150 + (i - 2) * 15, 250, i, 5));
    }

    // Initialize particles
    const particles = [];
    for (let i = 0; i < 30; i++) {
      particles.push(new Particle());
    }

    // Wood logs
    const drawLogs = () => {
      ctx.fillStyle = '#3d2817';
      
      // Bottom log
      ctx.fillRect(100, 260, 100, 15);
      ctx.fillRect(105, 265, 90, 5);
      
      // Left log
      ctx.save();
      ctx.translate(120, 255);
      ctx.rotate(-0.3);
      ctx.fillRect(-50, 0, 100, 12);
      ctx.restore();
      
      // Right log
      ctx.save();
      ctx.translate(180, 255);
      ctx.rotate(0.3);
      ctx.fillRect(-50, 0, 100, 12);
      ctx.restore();
    };

    // Animation loop
    let animationId;
    const animate = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw logs
      drawLogs();
      
      // Update and draw flames
      flames.forEach(flame => {
        flame.update(time);
        flame.draw(ctx, time);
      });
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });
      
      animationId = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <div className="fixed bottom-8 right-8 pointer-events-none z-40">
      <canvas 
        ref={canvasRef}
        className="drop-shadow-2xl"
        style={{ 
          filter: 'drop-shadow(0 0 20px rgba(255, 107, 53, 0.5))'
        }}
      />
    </div>
  );
}