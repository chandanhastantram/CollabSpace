"use client";

interface AvatarProps {
  seed: string;
  style?: 'initials' | 'pixel' | 'lorelei' | 'bottts' | 'avataaars' | 'robot' | 'monster';
  size?: number;
  className?: string;
}

// DiceBear Avatar URLs
const getDicebearUrl = (style: string, seed: string): string => {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
};

// Robohash URLs
const getRobohashUrl = (type: number, seed: string): string => {
  return `https://robohash.org/${encodeURIComponent(seed)}?set=set${type}&size=200x200`;
};

export function DynamicAvatar({ seed, style = 'initials', size = 40, className = '' }: AvatarProps) {
  const getAvatarUrl = () => {
    switch (style) {
      case 'initials':
        return getDicebearUrl('initials', seed);
      case 'pixel':
        return getDicebearUrl('pixel-art', seed);
      case 'lorelei':
        return getDicebearUrl('lorelei', seed);
      case 'bottts':
        return getDicebearUrl('bottts', seed);
      case 'avataaars':
        return getDicebearUrl('avataaars', seed);
      case 'robot':
        return getRobohashUrl(1, seed);
      case 'monster':
        return getRobohashUrl(4, seed);
      default:
        return getDicebearUrl('initials', seed);
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
          className="flex flex-col items-center p-3 rounded-lg border border-white/20 hover:border-white/50 transition-colors"
        >
          <DynamicAvatar seed={seed} style={style} size={48} />
          <span className="text-xs text-gray-400 mt-2">{name}</span>
        </button>
      ))}
    </div>
  );
}
