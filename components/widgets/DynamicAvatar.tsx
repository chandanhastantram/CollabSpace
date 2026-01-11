"use client";

import Image from 'next/image';
import { dicebearAPI, robohashAPI } from '@/lib/publicAPIs';

interface AvatarProps {
  seed: string;
  style?: 'initials' | 'pixel' | 'lorelei' | 'bottts' | 'avataaars' | 'robot' | 'monster';
  size?: number;
  className?: string;
}

export function DynamicAvatar({ seed, style = 'initials', size = 40, className = '' }: AvatarProps) {
  const getAvatarUrl = () => {
    switch (style) {
      case 'initials':
        return dicebearAPI.getInitials(seed);
      case 'pixel':
        return dicebearAPI.getPixelArt(seed);
      case 'lorelei':
        return dicebearAPI.getLorelei(seed);
      case 'bottts':
        return dicebearAPI.getBottts(seed);
      case 'avataaars':
        return dicebearAPI.getAvataaars(seed);
      case 'robot':
        return robohashAPI.getRobot(seed);
      case 'monster':
        return robohashAPI.getMonster(seed);
      default:
        return dicebearAPI.getInitials(seed);
    }
  };

  return (
    <img
      src={getAvatarUrl()}
      alt={`Avatar for ${seed}`}
      width={size}
      height={size}
      className={`rounded-full ${className}`}
    />
  );
}

// Avatar picker component
export function AvatarPicker({ 
  seed, 
  onSelect 
}: { 
  seed: string; 
  onSelect: (style: string) => void;
}) {
  const styles: Array<{ name: string; style: AvatarProps['style'] }> = [
    { name: 'Initials', style: 'initials' },
    { name: 'Pixel Art', style: 'pixel' },
    { name: 'Lorelei', style: 'lorelei' },
    { name: 'Robots', style: 'bottts' },
    { name: 'Characters', style: 'avataaars' },
    { name: 'Robot', style: 'robot' },
    { name: 'Monster', style: 'monster' },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {styles.map(({ name, style }) => (
        <button
          key={style}
          onClick={() => onSelect(style!)}
          className="flex flex-col items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors"
        >
          <DynamicAvatar seed={seed} style={style} size={48} />
          <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">{name}</span>
        </button>
      ))}
    </div>
  );
}
