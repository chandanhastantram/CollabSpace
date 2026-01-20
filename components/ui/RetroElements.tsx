"use client";

import { useEffect, useState } from 'react';

interface Shape {
  id: number;
  size: number;
  x: number;
  y: number;
  rotation: number;
  color: 'yellow' | 'orange' | 'mint' | 'outline';
  animation: string;
  delay: number;
}

export function FloatingShapes() {
  const [shapes, setShapes] = useState<Shape[]>([]);

  useEffect(() => {
    // Generate random shapes
    const newShapes: Shape[] = [];
    const colors: Array<'yellow' | 'orange' | 'mint' | 'outline'> = ['yellow', 'orange', 'mint', 'outline'];
    const animations = ['animate-float', 'animate-float-slow', 'animate-float-reverse'];

    for (let i = 0; i < 12; i++) {
      newShapes.push({
        id: i,
        size: Math.random() * 60 + 30, // 30-90px
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 45 - 22.5, // -22.5 to 22.5 degrees
        color: colors[Math.floor(Math.random() * colors.length)],
        animation: animations[Math.floor(Math.random() * animations.length)],
        delay: Math.random() * 3,
      });
    }
    setShapes(newShapes);
  }, []);

  const getColorClass = (color: string) => {
    switch (color) {
      case 'yellow': return 'bg-[#FFE500]';
      case 'orange': return 'bg-[#FF6B35]';
      case 'mint': return 'bg-[#00D9A5]';
      case 'outline': return 'bg-transparent';
      default: return 'bg-[#FFE500]';
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className={`absolute border-2 border-black/20 ${getColorClass(shape.color)} ${shape.animation}`}
          style={{
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            transform: `rotate(${shape.rotation}deg)`,
            animationDelay: `${shape.delay}s`,
            opacity: 0.4,
          }}
        />
      ))}
    </div>
  );
}

export function MarqueeBanner({ text, className = '' }: { text: string; className?: string }) {
  return (
    <div className={`overflow-hidden bg-[#FF6B35] border-y-4 border-black py-2 ${className}`}>
      <div className="animate-marquee whitespace-nowrap flex">
        {[...Array(8)].map((_, i) => (
          <span key={i} className="inline-flex items-center px-6 text-white font-bold uppercase tracking-wider">
            <span className="mr-2">⚡</span>
            {text}
            <span className="ml-2">⚡</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Sticker({ 
  children, 
  variant = 'yellow',
  className = '' 
}: { 
  children: React.ReactNode; 
  variant?: 'yellow' | 'orange' | 'mint' | 'black';
  className?: string;
}) {
  const variantClasses = {
    yellow: 'bg-[#FFE500] text-black',
    orange: 'bg-[#FF6B35] text-white',
    mint: 'bg-[#00D9A5] text-black',
    black: 'bg-black text-white',
  };

  return (
    <span 
      className={`inline-block border-2 border-black px-3 py-1 font-bold text-xs uppercase tracking-wide transform -rotate-2 shadow-[2px_2px_0_#000] ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function BrutalistCard({ 
  children, 
  variant = 'white',
  hover = true,
  tilt = false,
  className = '' 
}: { 
  children: React.ReactNode; 
  variant?: 'white' | 'yellow' | 'orange' | 'black';
  hover?: boolean;
  tilt?: boolean;
  className?: string;
}) {
  const variantClasses = {
    white: 'bg-white text-black',
    yellow: 'bg-[#FFE500] text-black',
    orange: 'bg-[#FF6B35] text-white',
    black: 'bg-black text-white',
  };

  const hoverClass = hover ? 'hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[9px_9px_0_#000]' : '';
  const tiltClass = tilt ? 'transform rotate-[-2deg]' : '';

  return (
    <div 
      className={`border-3 border-black shadow-[6px_6px_0_#000] transition-all duration-200 ${variantClasses[variant]} ${hoverClass} ${tiltClass} ${className}`}
      style={{ borderWidth: '3px' }}
    >
      {children}
    </div>
  );
}

export function BrutalistButton({ 
  children, 
  variant = 'orange',
  size = 'md',
  className = '',
  ...props 
}: { 
  children: React.ReactNode; 
  variant?: 'orange' | 'yellow' | 'ghost' | 'black';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variantClasses = {
    orange: 'bg-[#FF6B35] text-white hover:bg-[#FF5722]',
    yellow: 'bg-[#FFE500] text-black hover:bg-[#FFD700]',
    ghost: 'bg-transparent text-black hover:bg-[#FFE500] hover:text-black',
    black: 'bg-black text-white hover:bg-gray-800',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button 
      className={`font-bold uppercase tracking-wider border-3 border-black shadow-[4px_4px_0_#000] transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_#000] ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      style={{ borderWidth: '3px' }}
      {...props}
    >
      {children}
    </button>
  );
}

export function HighlightText({ 
  children, 
  color = 'yellow',
  className = '' 
}: { 
  children: React.ReactNode; 
  color?: 'yellow' | 'orange' | 'mint';
  className?: string;
}) {
  const colorClasses = {
    yellow: 'bg-[#FFE500] text-black',
    orange: 'bg-[#FF6B35] text-white',
    mint: 'bg-[#00D9A5] text-black',
  };

  return (
    <span className={`px-1 ${colorClasses[color]} ${className}`}>
      {children}
    </span>
  );
}
