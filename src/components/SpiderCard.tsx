import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Shield, Zap, Swords, RotateCcw, Ban, Plus, Sparkles, Star, Heart, Skull, Footprints, Sword, Tv, Smile, Gamepad2, Ghost, Rocket, Crown, Coffee, Pizza, IceCream, Music, Camera, Gift, Moon, Sun, Cloud, Wind, Flame, Droplets } from 'lucide-react';
import { CardData, CardColor, GameMode } from '../types';

const SpiderIcon = ({ className, mode }: { className?: string; mode?: GameMode }) => {
  if (mode === 'Mario') return <Gamepad2 className={className} />;
  if (mode === 'Star Wars') return <Sword className={className} />;
  if (mode === 'Jurassic World Dominion') return <Footprints className={className} />;
  if (mode === 'The Simpsons') return <Tv className={className} />;
  if (mode === 'Minions') return <Smile className={className} />;
  if (mode === 'Avengers' || mode === 'Ultimate Marvel') return <Shield className={className} />;
  if (mode === 'DC') return <Zap className={className} />;
  if (mode === 'Party!') return <Music className={className} />;
  if (mode === 'Splash') return <Droplets className={className} />;
  if (mode === 'Wild Jackpot') return <Gift className={className} />;
  if (mode === 'Power Grab') return <Flame className={className} />;
  if (mode === 'Spin') return <RotateCcw className={className} />;
  if (mode === 'Revenge') return <Sword className={className} />;
  if (mode === 'Sudden Death') return <Skull className={className} />;
  if (mode === 'Card Flood') return <Droplets className={className} />;
  if (mode === 'Minimalista') return <div className="w-1 h-1 bg-current rounded-full" />;
  if (mode === 'Speed') return <Zap className={className} />;
  
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 9v-4" />
      <path d="M12 15v4" />
      <path d="M9 12h-4" />
      <path d="M15 12h4" />
      <path d="M5 5l3.5 3.5" />
      <path d="M19 19l-3.5 -3.5" />
      <path d="M5 19l3.5 -3.5" />
      <path d="M19 5l-3.5 3.5" />
    </svg>
  );
};

interface SpiderCardProps {
  card: CardData;
  onClick?: () => void;
  disabled?: boolean;
  isBack?: boolean;
  size?: 'sm' | 'md' | 'lg';
  mode?: GameMode;
  isInvalid?: boolean;
  isWinning?: boolean;
  isDarkSide?: boolean;
  className?: string;
}

const COLOR_MAP: Record<CardColor, string> = {
  Red: 'bg-red-600',
  Blue: 'bg-blue-600',
  Green: 'bg-emerald-600',
  Yellow: 'bg-amber-500',
  Wild: 'bg-zinc-800',
};

const THEME_COLOR_MAP: Record<string, Record<CardColor, string>> = {
  'Barbie': {
    Red: 'bg-pink-500',
    Blue: 'bg-pink-300',
    Green: 'bg-pink-400',
    Yellow: 'bg-white',
    Wild: 'bg-pink-900',
  },
  'Star Wars': {
    Red: 'bg-red-900',
    Blue: 'bg-blue-900',
    Green: 'bg-emerald-900',
    Yellow: 'bg-zinc-800',
    Wild: 'bg-black',
  },
  'Jurassic World Dominion': {
    Red: 'bg-orange-900',
    Blue: 'bg-cyan-900',
    Green: 'bg-emerald-950',
    Yellow: 'bg-stone-800',
    Wild: 'bg-stone-950',
  },
  'Ultimate Marvel': {
    Red: 'bg-red-700',
    Blue: 'bg-blue-800',
    Green: 'bg-emerald-700',
    Yellow: 'bg-amber-600',
    Wild: 'bg-zinc-900',
  },
  'Avengers': {
    Red: 'bg-red-700',
    Blue: 'bg-blue-800',
    Green: 'bg-emerald-700',
    Yellow: 'bg-amber-600',
    Wild: 'bg-zinc-900',
  },
  'DC': {
    Red: 'bg-red-800',
    Blue: 'bg-blue-950',
    Green: 'bg-emerald-900',
    Yellow: 'bg-amber-700',
    Wild: 'bg-black',
  },
  'The Simpsons': {
    Red: 'bg-red-600',
    Blue: 'bg-blue-500',
    Green: 'bg-emerald-600',
    Yellow: 'bg-yellow-400',
    Wild: 'bg-zinc-800',
  },
  'Minions': {
    Red: 'bg-red-600',
    Blue: 'bg-blue-600',
    Green: 'bg-emerald-600',
    Yellow: 'bg-yellow-400',
    Wild: 'bg-zinc-800',
  },
};

const TEXT_COLOR_MAP: Record<CardColor, string> = {
  Red: 'text-red-100',
  Blue: 'text-blue-100',
  Green: 'text-emerald-100',
  Yellow: 'text-amber-950',
  Wild: 'text-zinc-100',
};

const DARK_COLOR_MAP: Record<CardColor, string> = {
  Red: 'bg-red-900',
  Blue: 'bg-blue-900',
  Green: 'bg-emerald-900',
  Yellow: 'bg-amber-900',
  Wild: 'bg-zinc-900',
};

const DARK_TEXT_COLOR_MAP: Record<CardColor, string> = {
  Red: 'text-red-400',
  Blue: 'text-blue-400',
  Green: 'text-emerald-400',
  Yellow: 'text-amber-400',
  Wild: 'text-zinc-400',
};

export const SpiderCard: React.FC<SpiderCardProps> = ({ 
  card, 
  onClick, 
  disabled, 
  isBack, 
  size = 'md', 
  mode = 'Classic' as GameMode, 
  isInvalid, 
  isWinning,
  isDarkSide,
  className = ''
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const getIcon = (isLarge = false) => {
    // Responsive icon sizing based on percentage of card size
    const iconSize = isLarge ? "w-[50%] h-[50%]" : "w-[15%] h-[15%]";
    const textSize = isLarge ? "text-[4em] font-black leading-none tracking-tighter" : "text-[1em] font-black leading-none";
    
    switch (card.type) {
      case 'Skip': 
        if (mode === 'Mario') return <Ghost className={iconSize} />;
        if (mode === 'Star Wars') return <Rocket className={iconSize} />;
        if (mode === 'The Simpsons') return <Coffee className={iconSize} />;
        return <Ban className={iconSize} />;
      case 'Reverse': 
        if (mode === 'The Simpsons') return <Pizza className={iconSize} />;
        return <RotateCcw className={iconSize} />;
      case 'DrawTwo': 
        return (
          <div className={`flex items-center justify-center ${isLarge ? '-space-x-1' : '-space-x-0.5'}`}>
            <Plus className={isLarge ? "w-[40%] h-[40%]" : "w-[15%] h-[15%]"} />
            <span className={isLarge ? "text-[4em] font-black" : "text-[1.2em] font-black"}>2</span>
          </div>
        );
      case 'WildDrawFour': 
        return (
          <div className={`flex items-center justify-center ${isLarge ? '-space-x-1' : '-space-x-0.5'}`}>
            <Plus className={isLarge ? "w-[40%] h-[40%]" : "w-[15%] h-[15%]"} />
            <span className={isLarge ? "text-[4em] font-black" : "text-[1.2em] font-black"}>4</span>
          </div>
        );
      case 'Wild': 
        if (mode === 'Mario') return <Crown className={iconSize} />;
        if (mode === 'Avengers' || mode === 'Ultimate Marvel') return <Star className={iconSize} />;
        if (mode === 'The Simpsons') return <Tv className={iconSize} />;
        return <Sparkles className={iconSize} />;
      default: return <span className={textSize}>{card.value}</span>;
    }
  };

  const dimensions = {
    sm: 'h-20 w-14 sm:h-24 sm:w-16 md:h-28 md:w-20', // Realistic playing card ratio ~1.4:1
    md: 'h-32 w-24 sm:h-40 sm:w-28 md:h-56 md:w-40',
    lg: 'h-48 w-32 sm:h-64 sm:w-44 md:h-84 md:w-60',
  };

  const getCardStyle = () => {
    const base = "relative overflow-hidden transition-all duration-300 select-none";
    // If className provides dimensions (w-, h-), use them. Otherwise fallback to size prop.
    const dim = className.includes('w-') || className.includes('h-') ? '' : dimensions[size];
    
    switch (mode) {
      case 'Revenge':
        return `${base} ${dim} rounded-xl border-4 border-red-800 shadow-[0_0_20px_rgba(153,27,27,0.5)]`;
      case 'Sudden Death':
        return `${base} ${dim} rounded-xl border-2 border-zinc-500 bg-zinc-900 shadow-2xl`;
      case 'Card Flood':
        return `${base} ${dim} rounded-xl border-2 border-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.5)]`;
      case 'Spin':
        return `${base} ${dim} rounded-full border-4 border-white/20 shadow-2xl`;
      case 'Wild Jackpot':
        return `${base} ${dim} rounded-xl border-4 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]`;
      case 'Party!':
        return `${base} ${dim} rounded-2xl border-2 border-pink-300 shadow-xl`;
      case 'Minimalista':
        return `${base} ${dim} rounded-none border-[0.5px] border-black/10 shadow-none`;
      case 'Show Em No Mercy':
      case 'Chaos':
      case 'Flip!':
        return `${base} ${dim} rounded-none border-4 ${isDarkSide ? 'border-red-600 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]' : 'border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`;
      case 'Speed':
        return `${base} ${dim} rounded-2xl border-2 border-white/30 -skew-x-2 shadow-xl`;
      case 'Splash':
        return `${base} ${dim} rounded-[2rem] border-4 border-white/40 shadow-inner`;
      case 'Stacko':
        return `${base} ${dim} rounded-sm border-b-8 border-r-8 border-black/40`;
      case 'Mario':
        return `${base} ${dim} rounded-lg border-4 border-white shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]`;
      case 'Star Wars':
        return `${base} ${dim} rounded-md border border-zinc-700 bg-gradient-to-br from-zinc-900 to-black`;
      case 'Jurassic World Dominion':
        return `${base} ${dim} rounded-3xl border-2 border-stone-800/50 shadow-2xl`;
      default:
        return `${base} ${dim} rounded-xl border-2 ${isDarkSide ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-white/10 shadow-2xl'}`;
    }
  };

  const currentBg = isDarkSide ? DARK_COLOR_MAP[card.color] : (THEME_COLOR_MAP[mode]?.[card.color] || COLOR_MAP[card.color]);
  const currentText = isDarkSide ? DARK_TEXT_COLOR_MAP[card.color] : TEXT_COLOR_MAP[card.color];

  if (isBack) {
    return (
      <motion.div
        className={`${getCardStyle()} ${className} ${isDarkSide ? 'bg-red-950' : 'bg-zinc-900'} flex items-center justify-center overflow-hidden relative`}
      >
        {/* Stack effect for deck */}
        <div className="absolute -right-1 -bottom-1 w-full h-full bg-black/40 rounded-inherit -z-10" />
        <div className="absolute -right-2 -bottom-2 w-full h-full bg-black/20 rounded-inherit -z-20" />
        
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={`web-back-${mode}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                {mode === 'Minimalista' ? (
                  <line x1="0" y1="0" x2="20" y2="20" stroke={isDarkSide ? 'red' : 'white'} strokeWidth="0.2" />
                ) : (
                  <path d="M 0 0 L 20 20 M 20 0 L 0 20" stroke={isDarkSide ? 'red' : 'white'} strokeWidth="0.5" fill="none" />
                )}
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#web-back-${mode})`} />
          </svg>
        </div>
        <SpiderIcon mode={mode} className={`w-1/2 h-1/2 ${isDarkSide ? 'text-red-500' : 'text-red-600'} opacity-50`} />
      </motion.div>
    );
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={!disabled ? onClick : undefined}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      animate={
        isInvalid ? { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } } :
        isWinning ? { scale: [1, 1.2, 1], rotate: [0, 360], transition: { duration: 0.8, ease: "easeInOut" } } :
        {}
      }
      whileHover={{ scale: 1.05, zIndex: 50 }}
      whileTap={{ scale: 0.95 }}
      className={`${getCardStyle()} ${className} cursor-pointer ${
        disabled && !isWinning ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:shadow-white/10'
      } ${isInvalid ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]' : ''} ${isWinning ? 'shadow-[0_0_30px_rgba(250,204,21,0.8)] border-yellow-400' : ''}`}
    >
      <div 
        className={`absolute inset-0 ${currentBg} overflow-hidden`}
        style={{ transform: "translateZ(0px)" }}
      >
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={`pattern-${card.id}`} x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                {mode === 'Star Wars' ? (
                  <path d="M 0 0 L 30 30" stroke="white" strokeWidth="0.5" fill="none" />
                ) : mode === 'Avengers' || mode === 'Ultimate Marvel' ? (
                  <path d="M 15 5 L 25 25 L 5 25 Z" stroke="white" strokeWidth="0.5" fill="none" />
                ) : mode === 'DC' ? (
                  <path d="M 5 15 L 15 5 L 25 15 L 15 25 Z" stroke="white" strokeWidth="0.5" fill="none" />
                ) : mode === 'Splash' ? (
                  <path d="M 0 15 Q 7.5 7.5 15 15 T 30 15" stroke="white" strokeWidth="0.5" fill="none" />
                ) : mode === 'Speed' ? (
                  <path d="M 5 0 L 0 30 M 15 0 L 10 30 M 25 0 L 20 30" stroke="white" strokeWidth="0.5" fill="none" />
                ) : mode === 'Minimalista' ? (
                  <rect width="30" height="30" fill="none" />
                ) : (
                  <path d="M 0 0 L 30 30 M 30 0 L 0 30 M 15 0 L 15 30 M 0 15 L 30 15" stroke="white" strokeWidth="0.5" fill="none" />
                )}
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#pattern-${card.id})`} />
          </svg>
        </div>

        {/* Card Content */}
        <div className={`relative h-full flex flex-col items-center justify-center p-1 sm:p-2 z-10 ${currentText}`}>
          {/* Small corner values */}
          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 flex flex-col items-center">
            <div className="leading-none">{getIcon(false)}</div>
            <SpiderIcon mode={mode} className="w-2 h-2 sm:w-3 sm:h-3 mt-0.5 opacity-80" />
          </div>
          <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 flex flex-col items-center rotate-180">
            <div className="leading-none">{getIcon(false)}</div>
            <SpiderIcon mode={mode} className="w-2 h-2 sm:w-3 sm:h-3 mt-0.5 opacity-80" />
          </div>

          {/* Large central value */}
          <div className="relative flex flex-col items-center justify-center w-full h-full">
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
               <SpiderIcon mode={mode} className="w-4/5 h-4/5" />
            </div>
            <div className="relative z-10 drop-shadow-xl flex flex-col items-center justify-center">
              {getIcon(true)}
              <div className="mt-0.5 sm:mt-1">
                <span className="text-[6px] sm:text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                  {mode === 'Classic' ? 'Uno' : mode}
                </span>
              </div>
            </div>
            {card.character && (
              <div className="absolute bottom-1 sm:bottom-2 left-0 right-0 text-center">
                <span className="text-[5px] sm:text-[6px] md:text-[8px] font-bold uppercase tracking-widest opacity-40">
                  {card.character}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Wild card colors */}
        {card.color === 'Wild' && (
          <div className="absolute inset-0 opacity-30 flex flex-wrap">
            <div className="w-1/2 h-1/2 bg-red-500" />
            <div className="w-1/2 h-1/2 bg-blue-500" />
            <div className="w-1/2 h-1/2 bg-yellow-500" />
            <div className="w-1/2 h-1/2 bg-emerald-500" />
          </div>
        )}
      </div>
    </motion.div>
  );
};
