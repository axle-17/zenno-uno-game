import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Shield, Swords, Zap, RefreshCw, Trophy, Skull, User, Bot, 
  ArrowRight, ArrowLeft, PlusCircle, Play, Settings, Info, Volume2, 
  VolumeX, Layers, RotateCw, Droplets, Square, Users, Shuffle, 
  Hand, Coins, Wand2, LayoutGrid, Gamepad2, Footprints, Sword, Tv, Smile, Star, Pause, ArrowDown
} from 'lucide-react';
import { SpiderWeb } from './components/SpiderWeb';
import { SpiderCard } from './components/SpiderCard';
import { CardData, CardColor, CardType, GameState, Player, GameMode, Difficulty, QuizQuestion } from './types';

const COLORS: CardColor[] = ['Red', 'Blue', 'Green', 'Yellow'];
const TYPES: CardType[] = ['Number', 'Skip', 'Reverse', 'DrawTwo'];

const AI_NAMES = [
  'Miles', 'Gwen', 'Peter', 'Miguel', 'Pavitr', 'Hobie', 'Penny', 'Noir', 'Ham', 'Jessica'
];

const THEME_QUIZZES: Record<string, QuizQuestion[]> = {
  'Ultimate Marvel': [
    { question: "Who is the leader of the Avengers?", options: ["Captain America", "Iron Man"], correctIndex: 0 },
    { question: "What is Thor's hammer called?", options: ["Mjolnir", "Stormbreaker"], correctIndex: 0 },
    { question: "Who is the Black Widow?", options: ["Natasha Romanoff", "Wanda Maximoff"], correctIndex: 0 },
    { question: "What is Captain America's shield made of?", options: ["Vibranium", "Adamantium"], correctIndex: 0 },
    { question: "Who is Peter Parker?", options: ["Spider-Man", "Ant-Man"], correctIndex: 0 },
    { question: "What is the name of the metal in Wolverine's claws?", options: ["Adamantium", "Vibranium"], correctIndex: 0 },
    { question: "Who is the God of Thunder?", options: ["Thor", "Loki"], correctIndex: 0 },
    { question: "What is the name of the Avengers' headquarters?", options: ["Avengers Tower", "S.H.I.E.L.D. HQ"], correctIndex: 0 }
  ],
  'Avengers': [
    { question: "Which Avenger is from Wakanda?", options: ["Black Panther", "Falcon"], correctIndex: 0 },
    { question: "Who is the God of Mischief?", options: ["Loki", "Thanos"], correctIndex: 0 },
    { question: "What is the Hulk's real name?", options: ["Bruce Banner", "Tony Stark"], correctIndex: 0 },
    { question: "Who is the archer in the Avengers?", options: ["Hawkeye", "Green Arrow"], correctIndex: 0 },
    { question: "What is the name of Tony Stark's AI?", options: ["JARVIS", "HAL"], correctIndex: 0 },
    { question: "Who is the main villain in the first Avengers movie?", options: ["Loki", "Ultron"], correctIndex: 0 },
    { question: "What is the name of the space stone?", options: ["Tesseract", "Aether"], correctIndex: 0 },
    { question: "Who is the leader of S.H.I.E.L.D.?", options: ["Nick Fury", "Phil Coulson"], correctIndex: 0 }
  ],
  'Mario': [
    { question: "Who is Mario's brother?", options: ["Luigi", "Wario"], correctIndex: 0 },
    { question: "What is the name of the princess Mario rescues?", options: ["Peach", "Daisy"], correctIndex: 0 },
    { question: "Which item makes Mario grow big?", options: ["Super Mushroom", "Fire Flower"], correctIndex: 0 },
    { question: "Who is Mario's dinosaur friend?", options: ["Yoshi", "Rex"], correctIndex: 0 },
    { question: "What is the main villain's name?", options: ["Bowser", "Ganondorf"], correctIndex: 0 },
    { question: "What is the name of Mario's hat in Odyssey?", options: ["Cappy", "Tiara"], correctIndex: 0 },
    { question: "Which game features Mario karting?", options: ["Mario Kart", "Mario Party"], correctIndex: 0 },
    { question: "What is the name of the ghost that haunts Mario?", options: ["Boo", "Dry Bones"], correctIndex: 0 }
  ],
  'Star Wars': [
    { question: "Who is Luke Skywalker's father?", options: ["Darth Vader", "Obi-Wan Kenobi"], correctIndex: 0 },
    { question: "What is the name of Han Solo's ship?", options: ["Millennium Falcon", "Star Destroyer"], correctIndex: 0 },
    { question: "Which color is Yoda's lightsaber?", options: ["Green", "Blue"], correctIndex: 0 },
    { question: "Who is the Wookiee co-pilot?", options: ["Chewbacca", "Ewok"], correctIndex: 0 },
    { question: "What is the Force?", options: ["Energy field", "Magic spell"], correctIndex: 0 },
    { question: "Who is the main villain in the original trilogy?", options: ["Emperor Palpatine", "Kylo Ren"], correctIndex: 0 },
    { question: "What is the name of the desert planet?", options: ["Tatooine", "Hoth"], correctIndex: 0 },
    { question: "Who is the droid that speaks 6 million languages?", options: ["C-3PO", "R2-D2"], correctIndex: 0 }
  ],
  'Jurassic World Dominion': [
    { question: "What kind of dinosaur is Blue?", options: ["Velociraptor", "T-Rex"], correctIndex: 0 },
    { question: "Who is the main protagonist played by Chris Pratt?", options: ["Owen Grady", "Alan Grant"], correctIndex: 0 },
    { question: "What is the name of the park in the first movie?", options: ["Jurassic Park", "Dino World"], correctIndex: 0 },
    { question: "Which dinosaur has three horns?", options: ["Triceratops", "Stegosaurus"], correctIndex: 0 },
    { question: "What is the name of the island?", options: ["Isla Nublar", "Isla Sorna"], correctIndex: 0 },
    { question: "What is the name of the massive aquatic dinosaur?", options: ["Mosasaurus", "Plesiosaurus"], correctIndex: 0 },
    { question: "Who is the scientist who created the dinosaurs?", options: ["John Hammond", "Henry Wu"], correctIndex: 0 },
    { question: "What is the name of the hybrid dinosaur in Jurassic World?", options: ["Indominus Rex", "Indoraptor"], correctIndex: 0 }
  ],
  'DC': [
    { question: "What is Batman's real name?", options: ["Bruce Wayne", "Clark Kent"], correctIndex: 0 },
    { question: "Where is Superman from?", options: ["Krypton", "Mars"], correctIndex: 0 },
    { question: "Who is the fastest man alive?", options: ["The Flash", "Aquaman"], correctIndex: 0 },
    { question: "Who is Wonder Woman?", options: ["Diana Prince", "Selina Kyle"], correctIndex: 0 },
    { question: "What is the Joker's signature weapon?", options: ["Laughing Gas", "Batarang"], correctIndex: 0 },
    { question: "What is the name of Batman's city?", options: ["Gotham City", "Metropolis"], correctIndex: 0 },
    { question: "Who is the King of Atlantis?", options: ["Aquaman", "Cyborg"], correctIndex: 0 },
    { question: "What is the name of Superman's home city?", options: ["Metropolis", "Gotham"], correctIndex: 0 }
  ],
  'The Simpsons': [
    { question: "What is the name of the town where the Simpsons live?", options: ["Springfield", "Shelbyville"], correctIndex: 0 },
    { question: "What is Homer's favorite food?", options: ["Donuts", "Pizza"], correctIndex: 0 },
    { question: "Who is the baby in the family?", options: ["Maggie", "Lisa"], correctIndex: 0 },
    { question: "What is Bart's catchphrase?", options: ["Eat my shorts", "D'oh"], correctIndex: 0 },
    { question: "Who is the neighbor Homer hates?", options: ["Ned Flanders", "Moe Szyslak"], correctIndex: 0 },
    { question: "What is the name of the local bar?", options: ["Moe's Tavern", "The Gilded Truffle"], correctIndex: 0 },
    { question: "Who is the school principal?", options: ["Seymour Skinner", "Edna Krabappel"], correctIndex: 0 },
    { question: "What is the name of the nuclear power plant owner?", options: ["Mr. Burns", "Waylon Smithers"], correctIndex: 0 }
  ],
  'Minions': [
    { question: "What is the Minions' favorite fruit?", options: ["Banana", "Apple"], correctIndex: 0 },
    { question: "Who is the leader of the Minions?", options: ["Gru", "Vector"], correctIndex: 0 },
    { question: "What color are the Minions?", options: ["Yellow", "Purple"], correctIndex: 0 },
    { question: "What do Minions wear?", options: ["Overalls", "Tuxedos"], correctIndex: 0 },
    { question: "Who is the tallest Minion?", options: ["Kevin", "Stuart"], correctIndex: 0 },
    { question: "What is the name of Gru's dog?", options: ["Kyle", "Rex"], correctIndex: 0 },
    { question: "Which Minion has one eye?", options: ["Stuart", "Kevin"], correctIndex: 0 },
    { question: "What is the name of the villain in the first movie?", options: ["Vector", "Balthazar Bratt"], correctIndex: 0 }
  ]
};
const PARTY_MESSAGES = [
  { text: "Sing the chorus of 'Happy' by Pharrell Williams!", lyric: "Because I'm happy... clap along if you feel like a room without a roof!" },
  { text: "Do your best impression of a rock star!", lyric: "I'm a rock star, I'm a legend, I'm a icon!" },
  { text: "Sing 'Let It Go' from Frozen!", lyric: "Let it go, let it go! Can't hold it back anymore!" },
  { text: "Everyone must dance for 10 seconds!", lyric: "Dance like nobody's watching!" },
  { text: "Sing 'Shake It Off' by Taylor Swift!", lyric: "Cause the players gonna play, play, play, play, play..." },
  { text: "Tell a joke or sing a funny song!", lyric: "Why did the chicken cross the road? To get to the other side!" },
  { text: "Sing 'Don't Stop Believin'' by Journey!", lyric: "Just a small town girl, livin' in a lonely world..." },
  { text: "Strike a pose and sing 'Vogue'!", lyric: "Vogue, vogue! Let your body move to the music!" }
];

const THEME_DATA: Record<GameMode, { title: string; subtitle: string; color: string; characters: string[]; avatarStyle: string; particles?: string[] }> = {
  'The Simpsons': {
    title: 'The Simpsons',
    subtitle: 'Springfield Showdown',
    color: 'bg-yellow-400',
    characters: ['Homer', 'Marge', 'Bart', 'Lisa', 'Maggie'],
    avatarStyle: 'big-smile',
    particles: ['🍩', '🍺', '🛹', '🎷', '📺']
  },
  'Ultimate Marvel': {
    title: 'Marvel Universe',
    subtitle: 'Heroes Assemble',
    color: 'bg-red-600',
    characters: ['Iron Man', 'Cap', 'Thor', 'Hulk', 'Widow'],
    avatarStyle: 'avataaars',
    particles: ['🛡️', '🔨', '🏹', '🕷️', '💥']
  },
  'Avengers': {
    title: 'Avengers',
    subtitle: 'Earth\'s Mightiest Heroes',
    color: 'bg-blue-700',
    characters: ['Spidey', 'Strange', 'Panther', 'Marvel', 'Wanda'],
    avatarStyle: 'avataaars',
    particles: ['🛡️', '🔨', '🏹', '🕷️', '💥']
  },
  'Mario': {
    title: 'Super Mario',
    subtitle: 'Mushroom Kingdom',
    color: 'bg-red-500',
    characters: ['Mario', 'Luigi', 'Peach', 'Yoshi', 'Toad'],
    avatarStyle: 'pixel-art',
    particles: ['🍄', '⭐', '🪙', '🐢', '🔥']
  },
  'Star Wars': {
    title: 'Star Wars',
    subtitle: 'A Galaxy Far Away',
    color: 'bg-zinc-900',
    characters: ['Luke', 'Leia', 'Han', 'Vader', 'Yoda'],
    avatarStyle: 'bottts',
    particles: ['✨', '🚀', '⚔️', '🪐', '🤖']
  },
  'Jurassic World Dominion': {
    title: 'Jurassic World',
    subtitle: 'Dino Survival',
    color: 'bg-emerald-900',
    characters: ['Blue', 'Rexy', 'Owen', 'Claire', 'Ian'],
    avatarStyle: 'adventurer',
    particles: ['🦖', '🦕', '🦴', '🌿', '🌋']
  },
  'DC': {
    title: 'DC Universe',
    subtitle: 'Justice League',
    color: 'bg-blue-900',
    characters: ['Batman', 'Superman', 'Wonder Woman', 'Flash', 'Aquaman'],
    avatarStyle: 'avataaars',
    particles: ['⚡', '🦇', '🔱', '🦸', '🏙️']
  },
  'Minions': {
    title: 'Minions',
    subtitle: 'Bello! Mayhem',
    color: 'bg-yellow-300',
    characters: ['Kevin', 'Stuart', 'Bob', 'Otto', 'Gru'],
    avatarStyle: 'big-smile',
    particles: ['🍌', '👓', '🚀', '💎', '🔥']
  },
  'Classic': { title: 'Classic', subtitle: 'Standard Rules', color: 'bg-red-600', characters: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'], avatarStyle: 'avataaars', particles: ['🕸️', '🕷️', '🔴', '🔵', '🟢'] },
  'Speed': { title: 'Speed', subtitle: 'Fast Pace', color: 'bg-zinc-800', characters: ['Turbo', 'Nitro', 'Sonic', 'Flash', 'Dash'], avatarStyle: 'bottts', particles: ['⚡', '💨', '🏎️', '🔥', '⏱️'] },
  'Chaos': { title: 'Chaos', subtitle: 'Pure Mayhem', color: 'bg-purple-600', characters: ['Discord', 'Mayhem', 'Havoc', 'Entropy', 'Anarchy'], avatarStyle: 'pixel-art', particles: ['🌀', '🎲', '💥', '🎭', '🔥'] },
  'Flip!': { title: 'Flip!', subtitle: 'Dark Side', color: 'bg-zinc-950', characters: ['Shadow', 'Mirror', 'Reverse', 'Invert', 'Eclipse'], avatarStyle: 'bottts', particles: ['🌓', '🌑', '🌕', '🔄', '✨'] },
  'Revenge': { title: 'Revenge', subtitle: 'Payback Time', color: 'bg-red-800', characters: ['Avenger', 'Nemesis', 'Vindicator', 'Retaliator', 'Punisher'], avatarStyle: 'avataaars', particles: ['⚔️', '🩸', '🔥', '💀', '💢'] },
  'Sudden Death': { title: 'Sudden Death', subtitle: 'One Mistake = Doom', color: 'bg-zinc-900', characters: ['Reaper', 'Doom', 'Fate', 'End', 'Void'], avatarStyle: 'avataaars', particles: ['💀', '⚡', '⚠️', '🔥', '⏳'] },
  'Card Flood': { title: 'Card Flood', subtitle: 'Drowning in Cards', color: 'bg-blue-800', characters: ['Tsunami', 'Deluge', 'Torrent', 'Wave', 'Surge'], avatarStyle: 'avataaars', particles: ['🌊', '💧', '🌧️', '🃏', '🌀'] },
  'Dare!': { title: 'Dare!', subtitle: 'Play or Dare', color: 'bg-blue-500', characters: ['Brave', 'Bold', 'Risky', 'Daring', 'Hero'], avatarStyle: 'adventurer', particles: ['🔥', '⚔️', '🛡️', '🏆', '✨'] },
  'Attack': { title: 'Attack', subtitle: 'Card Attacks', color: 'bg-red-800', characters: ['Striker', 'Fighter', 'Warrior', 'Slayer', 'Knight'], avatarStyle: 'bottts', particles: ['⚔️', '💥', '🛡️', '🔥', '🗡️'] },
  'Show Em No Mercy': { title: 'No Mercy', subtitle: 'Brutal Rules', color: 'bg-black', characters: ['Ruthless', 'Savage', 'Brutal', 'Merciless', 'Grim'], avatarStyle: 'bottts', particles: ['💀', '🔥', '⛓️', '🩸', '🖤'] },
  'Stacko': { title: 'Stacko', subtitle: 'Stack High', color: 'bg-amber-600', characters: ['Tower', 'Piler', 'Builder', 'Stacker', 'Mason'], avatarStyle: 'pixel-art', particles: ['🧱', '🏗️', '📐', '🔨', '🏠'] },
  'Spin': { title: 'Spin', subtitle: 'Wheel of Fate', color: 'bg-indigo-600', characters: ['Wheel', 'Fortune', 'Fate', 'Destiny', 'Chance'], avatarStyle: 'avataaars', particles: ['🎡', '🎰', '✨', '🎲', '🔮'] },
  'Splash': { title: 'Splash', subtitle: 'Water Theme', color: 'bg-cyan-500', characters: ['Shark', 'Whale', 'Dolphin', 'Octopus', 'Crab'], avatarStyle: 'adventurer', particles: ['💧', '🌊', '🐳', '🐠', '🫧'] },
  'Minimalista': { title: 'Minimal', subtitle: 'Clean UI', color: 'bg-zinc-100', characters: ['Dot', 'Line', 'Square', 'Circle', 'Point'], avatarStyle: 'avataaars', particles: ['⚪', '⚫', '⬜', '⬛', '▫️'] },
  'Party!': { title: 'Party!', subtitle: 'Group Fun', color: 'bg-pink-400', characters: ['DJ', 'Dancer', 'Singer', 'Rocker', 'Star'], avatarStyle: 'avataaars', particles: ['🎉', '🎈', '🎊', '🍰', '🎵'] },
  'Remix': { title: 'Remix', subtitle: 'Hand Swap', color: 'bg-lime-500', characters: ['Mixer', 'Fader', 'Beat', 'Loop', 'Sync'], avatarStyle: 'pixel-art', particles: ['🎧', '🎹', '🎸', '🥁', '📻'] },
  'Power Grab': { title: 'Power Grab', subtitle: 'Steal Cards', color: 'bg-rose-600', characters: ['Thief', 'Robber', 'Bandit', 'Pirate', 'Outlaw'], avatarStyle: 'bottts', particles: ['💰', '💎', '🗝️', '🏴‍☠️', '🔫'] },
  'Wild Jackpot': { title: 'Jackpot', subtitle: 'Win Big', color: 'bg-yellow-600', characters: ['Lucky', 'Winner', 'Gold', 'Rich', 'Ace'], avatarStyle: 'avataaars', particles: ['🎰', '💰', '💎', '🪙', '🏆'] },
  'Wild Twists': { title: 'Twists', subtitle: 'Random Effects', color: 'bg-teal-500', characters: ['Twister', 'Spiral', 'Vortex', 'Whirl', 'Spin'], avatarStyle: 'avataaars', particles: ['🌪️', '🌀', '✨', '🎲', '🔥'] },
  'Triple Play': { title: 'Triple', subtitle: '3 Piles', color: 'bg-sky-500', characters: ['Triple', 'Trio', 'Three', 'Trident', 'Trinity'], avatarStyle: 'avataaars', particles: ['3️⃣', '✨', '🔥', '🎲', '🌈'] },
};

const ThemeParticles = ({ mode, isDarkSide }: { mode: GameMode; isDarkSide?: boolean }) => {
  const particles = useMemo(() => {
    const count = mode === 'Splash' || mode === 'Party!' ? 60 : 20;
    const themeIcons = THEME_DATA[mode]?.particles || THEME_DATA['Classic'].particles || [];
    
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      icon: themeIcons[i % themeIcons.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: mode === 'Splash' || mode === 'Party!' ? Math.random() * 40 + 30 : Math.random() * 20 + 20,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
      type: mode === 'Splash' ? 'water' : mode === 'Party!' ? 'light' : 'normal'
    }));
  }, [mode]);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 transition-opacity duration-1000 ${isDarkSide ? 'opacity-60' : 'opacity-30'}`}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: '110%', x: `${p.x}%`, opacity: 0 }}
          animate={p.type === 'light' ? {
            opacity: [0, 1, 0],
            scale: [1, 2, 1],
            backgroundColor: ['rgba(255,255,255,0)', 'rgba(255,100,200,0.4)', 'rgba(255,255,255,0)'],
            boxShadow: ['0 0 0px rgba(255,255,255,0)', '0 0 40px rgba(255,100,200,0.8)', '0 0 0px rgba(255,255,255,0)']
          } : p.type === 'water' ? {
            y: ['100%', '-20%'],
            x: [`${p.x}%`, `${p.x + (Math.random() * 20 - 10)}%`],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.5, 0.5],
            rotate: [0, 360]
          } : { 
            y: '-10%', 
            opacity: [0, 1, 1, 0],
            rotate: 360
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: p.type === 'light' ? "easeInOut" : "linear"
          }}
          className={`absolute select-none ${p.type === 'light' ? 'rounded-full blur-xl' : ''}`}
          style={{ 
            fontSize: p.size,
            width: p.type === 'light' ? p.size * 2 : 'auto',
            height: p.type === 'light' ? p.size * 2 : 'auto',
          }}
        >
          {p.type === 'light' ? null : p.icon}
        </motion.div>
      ))}
      
      {mode === 'Splash' && (
        <div className="absolute inset-0 bg-cyan-500/10 backdrop-blur-[2px]" />
      )}
      
      {mode === 'Party!' && (
        <motion.div 
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-blue-500/20"
        />
      )}
    </div>
  );
};

// Sound System
const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

const playTone = (freq: number, type: OscillatorType = 'sine', duration: number = 0.1, volume: number = 0.1) => {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
};

const sounds = {
  play: () => playTone(440, 'sine', 0.1, 0.05),
  draw: () => playTone(220, 'triangle', 0.15, 0.05),
  special: () => {
    playTone(660, 'square', 0.1, 0.03);
    setTimeout(() => playTone(880, 'square', 0.1, 0.03), 50);
  },
  uno: () => {
    playTone(880, 'sine', 0.2, 0.05);
    setTimeout(() => playTone(1100, 'sine', 0.2, 0.05), 100);
  },
  win: () => {
    [440, 554, 659, 880].forEach((f, i) => setTimeout(() => playTone(f, 'sine', 0.5, 0.05), i * 100));
  },
  lose: () => {
    [440, 349, 261, 196].forEach((f, i) => setTimeout(() => playTone(f, 'sine', 0.5, 0.05), i * 100));
  },
  click: () => playTone(800, 'sine', 0.05, 0.02),
  error: () => playTone(150, 'sawtooth', 0.2, 0.1),
};

const DARES = [
  "Sing a song for 10 seconds!",
  "Do 5 jumping jacks!",
  "Tell a funny joke!",
  "Act like a monkey for 15 seconds!",
  "Balance a card on your nose for 10 seconds!",
  "Try to touch your nose with your tongue!",
  "Do your best celebrity impression!",
  "Spin around 5 times and try to walk straight!",
  "Make a funny face and hold it for 10 seconds!",
  "Say a tongue twister 3 times fast!",
  "Recite a poem!",
  "Dance like nobody is watching!",
  "Meow like a cat!",
  "Bark like a dog!",
  "Do a silly walk across the room!"
];

const CHAOS_TASKS = [
  "You found a hidden treasure! But it's guarded by a dragon. Solve a riddle to pass!",
  "A sudden storm has scattered your cards! Re-organize them quickly.",
  "You've entered the Enchanted Forest. Every card you play now has a magical twist!",
  "The Dark Knight challenges you to a duel! Win to gain a powerful card.",
  "A mysterious portal has opened! You must choose whether to step through or stay.",
  "You've reached the summit of Mount Chaos! The air is thin, and your next move is critical.",
  "A mischievous sprite has swapped one of your cards! Can you guess which one?",
  "The King of Chaos demands a tribute! Give up one card to continue your journey.",
  "You've discovered an ancient scroll! It contains a secret that could change the game.",
  "A giant troll blocks your path! You must distract it with a funny story."
];

const JackpotModal = ({ amount, onClaim }: { amount: number; onClaim: () => void }) => {
  const sayings = [
    "Fortune favors the bold! Claim your prize and dominate the table.",
    "The stars have aligned! Your luck is unmatched today.",
    "A massive windfall! Use these cards to crush your opponents.",
    "Jackpot! The Nexus has chosen you as its champion."
  ];
  const saying = sayings[Math.floor(Math.random() * sayings.length)];

  return (
    <motion.div 
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed inset-0 z-[500] flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
    >
      <div className="bg-gradient-to-b from-yellow-400 to-yellow-600 p-8 rounded-[3rem] shadow-[0_0_50px_rgba(250,204,21,0.5)] border-8 border-yellow-200 text-center max-w-md w-full relative overflow-hidden">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-64 h-64 bg-white/20 rounded-full blur-3xl"
        />
        <div className="relative z-10">
          <motion.div
            animate={{ y: [0, -20, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl mb-4"
          >
            🎰
          </motion.div>
          <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-2 italic drop-shadow-lg">BIG WIN!</h2>
          <p className="text-yellow-100 font-bold mb-6 text-xl">WILD JACKPOT HIT</p>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/30">
            <div className="text-6xl font-black text-white drop-shadow-lg">
              +{amount} <span className="text-2xl">CARDS</span>
            </div>
          </div>
          <p className="text-yellow-900 font-bold mb-8 italic text-lg leading-tight">
            "{saying}"
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onClaim}
            className="w-full py-5 bg-white text-yellow-600 font-black uppercase tracking-widest rounded-2xl shadow-2xl hover:bg-yellow-50 transition-all text-xl"
          >
            Claim & Continue
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const ChaosTaskModal = ({ task, onComplete }: { task: string; onComplete: () => void }) => {
  const sayings = [
    "The path ahead is treacherous. Complete this task to proceed!",
    "An unexpected challenge arises! Show your worth.",
    "The Nexus demands a sacrifice of effort. Finish the task!",
    "Adventure awaits those who overcome. Complete your mission."
  ];
  const saying = sayings[Math.floor(Math.random() * sayings.length)];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[500] flex items-center justify-center bg-purple-950/90 backdrop-blur-xl p-6"
    >
      <div className="bg-zinc-900 border-4 border-purple-500 p-10 rounded-[2.5rem] shadow-[0_0_40px_rgba(168,85,247,0.4)] max-w-md w-full text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        <div className="text-7xl mb-6 drop-shadow-lg">🗺️</div>
        <h2 className="text-3xl font-black text-purple-400 uppercase tracking-[0.2em] mb-2 italic">QUEST LOG</h2>
        <p className="text-purple-300/60 font-mono text-xs uppercase tracking-widest mb-6">{saying}</p>
        
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-2xl p-6 mb-8">
          <p className="text-white text-xl font-bold leading-relaxed italic">
            "{task}"
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#a855f7" }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="w-full py-5 bg-purple-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-purple-600/40 text-lg"
        >
          Finish Adventure Task
        </motion.button>
      </div>
    </motion.div>
  );
};

const PartyMessageModal = ({ message, onConfirm }: { message: { text: string; lyric: string }; onConfirm: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[600] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-6"
    >
      <motion.div 
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-lg overflow-hidden rounded-[3rem] border-4 border-pink-400/30 p-10 text-center shadow-2xl bg-gradient-to-br from-pink-600 to-purple-700"
      >
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-black/20 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-6 flex items-center justify-center gap-3">
            <Smile className="h-8 w-8 text-yellow-300" />
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white drop-shadow-lg">Party Time!</h2>
            <Smile className="h-8 w-8 text-yellow-300" />
          </div>

          <div className="mb-8 p-6 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
            <p className="text-2xl font-black text-white mb-4 leading-tight">
              {message.text}
            </p>
            <div className="h-1 w-20 bg-yellow-400 mx-auto mb-4 rounded-full" />
            <p className="text-lg font-medium text-pink-100 italic">
              "{message.lyric}"
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onConfirm}
            className="w-full py-4 bg-white text-pink-600 rounded-2xl text-xl font-black uppercase tracking-widest shadow-xl hover:bg-pink-50 transition-colors"
          >
            OK! Let's Go
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const QuizChallengeModal = ({ quiz, onAnswer, mode }: { quiz: QuizQuestion; onAnswer: (index: number) => void; mode: GameMode }) => {
  const [timeLeft, setTimeLeft] = useState(5);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const themeData = THEME_DATA[mode] || THEME_DATA['Classic'];

  useEffect(() => {
    if (result) return;
    if (timeLeft <= 0) {
      handleAnswer(-1);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, result]);

  const handleAnswer = (idx: number) => {
    const isCorrect = idx === quiz.correctIndex;
    setResult(isCorrect ? 'correct' : 'wrong');
    setTimeout(() => {
      onAnswer(idx);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[600] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-6"
    >
      <motion.div 
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className={`relative w-full max-w-lg overflow-hidden rounded-[3rem] border-4 border-white/20 p-8 text-center shadow-2xl ${themeData.color}`}
      >
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-black/20 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
            <h2 className="text-2xl font-black uppercase tracking-widest text-white drop-shadow-md">Theme Challenge</h2>
            <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
          </div>

          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="py-12"
              >
                <div className={`text-6xl font-black uppercase italic mb-4 drop-shadow-lg ${result === 'correct' ? 'text-green-400' : 'text-red-500'}`}>
                  {result === 'correct' ? 'Correct!' : 'Wrong!'}
                </div>
                <p className="text-white text-xl font-bold uppercase tracking-widest">
                  {result === 'correct' ? 'Challenge Passed' : 'Draw 3 Cards'}
                </p>
              </motion.div>
            ) : (
              <motion.div key="quiz" exit={{ opacity: 0, scale: 0.8 }}>
                <div className="mb-8 flex flex-col items-center">
                   <div className="relative mb-2 h-16 w-16">
                      <svg className="h-full w-full" viewBox="0 0 100 100">
                        <circle
                          cx="50" cy="50" r="45"
                          fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8"
                        />
                        <motion.circle
                          cx="50" cy="50" r="45"
                          fill="none" stroke="white" strokeWidth="8"
                          strokeDasharray="283"
                          animate={{ strokeDashoffset: 283 - (283 * timeLeft) / 5 }}
                          transition={{ duration: 1, ease: "linear" }}
                          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-white">
                        {timeLeft}
                      </div>
                   </div>
                   <p className="text-xs font-bold uppercase tracking-widest text-white/60">Seconds Left</p>
                </div>

                <div className="mb-10 rounded-3xl bg-black/20 p-6 backdrop-blur-sm border border-white/10">
                  <p className="text-2xl font-bold leading-tight text-white md:text-3xl">
                    {quiz.question}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {quiz.options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAnswer(idx)}
                      className="group relative flex items-center justify-center overflow-hidden rounded-2xl border-2 border-white/30 bg-white/10 p-5 transition-all hover:border-white"
                    >
                      <span className="relative z-10 text-lg font-black uppercase tracking-wider text-white">
                        {option}
                      </span>
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                    </motion.button>
                  ))}
                </div>
                
                <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-white/40">
                  Choose wisely or draw 3 cards
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AttackAnimation = ({ targetName, mode }: { targetName: string; mode: GameMode }) => {
  const getIcons = () => {
    switch (mode) {
      case 'Mario': return { left: '🔥', right: '🐢' };
      case 'Star Wars': return { left: '⚔️', right: '⚡' };
      case 'Jurassic World Dominion': return { left: '🦖', right: '🦕' };
      case 'DC': return { left: '🦸', right: '🦹' };
      case 'The Simpsons': return { left: '🍩', right: '🍺' };
      case 'Minions': return { left: '🚀', right: '🍌' };
      case 'Avengers':
      case 'Ultimate Marvel': return { left: '🔨', right: '🛡️' };
      default: return { left: '⚔️', right: '🛡️' };
    }
  };

  const icons = getIcons();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[600] flex items-center justify-center pointer-events-none"
    >
      {/* Intense Red Flash */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-red-600 z-[601]"
      />
      
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.5, 1] }}
        transition={{ duration: 0.5 }}
        className="relative z-[602]"
      >
        <div className="absolute inset-0 bg-red-600 blur-3xl opacity-50 animate-pulse" />
        <div className="flex items-center space-x-8 relative z-10">
          <motion.div
            initial={{ x: -300, rotate: -90, opacity: 0 }}
            animate={{ x: -40, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className="text-9xl drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]"
          >
            {icons.left}
          </motion.div>
          
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="px-10 py-6 bg-black border-4 border-red-600 rounded-[2rem] shadow-[0_0_40px_rgba(220,38,38,0.6)]"
            >
              <h2 className="text-5xl font-black text-red-600 uppercase italic tracking-tighter drop-shadow-lg">STRIKE!</h2>
              <p className="text-white font-black uppercase tracking-[0.3em] text-xs text-center mt-2">Target: {targetName}</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ x: 300, rotate: 90, opacity: 0 }}
            animate={{ x: 40, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className="text-9xl drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]"
          >
            {icons.right}
          </motion.div>
        </div>
        
        {/* Screen-Wide Slash Effect */}
        <motion.div
          initial={{ width: 0, opacity: 0, left: "-50%" }}
          animate={{ width: "200%", opacity: [0, 1, 1, 0], left: "-50%" }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="absolute top-1/2 h-4 bg-white shadow-[0_0_40px_white] rotate-[35deg] z-20"
        />
        <motion.div
          initial={{ width: 0, opacity: 0, left: "-50%" }}
          animate={{ width: "200%", opacity: [0, 1, 1, 0], left: "-50%" }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="absolute top-1/2 h-4 bg-white shadow-[0_0_40px_white] -rotate-[35deg] z-20"
        />
      </motion.div>
    </motion.div>
  );
};

const createDeck = (mode: GameMode = 'Classic'): CardData[] => {
  const deck: CardData[] = [];
  let id = 0;
  const themeChars = THEME_DATA[mode]?.characters || [];
  const getChar = (idx: number) => themeChars.length > 0 ? themeChars[idx % themeChars.length] : undefined;

  COLORS.forEach(color => {
    // One 0 per color
    deck.push({ id: `${id++}`, color, type: 'Number', value: 0, character: getChar(id) });
    // Two of each 1-9 per color
    for (let i = 1; i <= 9; i++) {
      deck.push({ id: `${id++}`, color, type: 'Number', value: i, character: getChar(id) });
      deck.push({ id: `${id++}`, color, type: 'Number', value: i, character: getChar(id) });
    }
    // Two of each special per color
    TYPES.filter(t => t !== 'Number').forEach(type => {
      let count = 2;
      if (mode === 'Chaos' || mode === 'Party!') count = 4;
      if (mode === 'Show Em No Mercy' || mode === 'Attack') count = 6;
      for (let j = 0; j < count; j++) {
        deck.push({ id: `${id++}`, color, type, character: getChar(id) });
      }
    });
  });

  // Wilds and Wild Draw Fours
  let wildCount = 4;
  if (mode === 'Chaos' || mode === 'Wild Twists' || mode === 'Wild Jackpot') wildCount = 8;
  if (mode === 'Show Em No Mercy') wildCount = 12;
  
  for (let i = 0; i < wildCount; i++) {
    deck.push({ id: `${id++}`, color: 'Wild', type: 'Wild', character: getChar(id) });
    deck.push({ id: `${id++}`, color: 'Wild', type: 'WildDrawFour', character: getChar(id) });
  }

  return deck;
};

const shuffle = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const MODES: { id: GameMode; icon: any; desc: string }[] = [
  { id: 'Classic', icon: Play, desc: 'Standard Rules // 7 Cards' },
  { id: 'Speed', icon: Zap, desc: 'Fast AI // Quick Decisions' },
  { id: 'Chaos', icon: Skull, desc: 'More Action Cards // Pure Mayhem' },
  { id: 'Flip!', icon: RefreshCw, desc: 'Cards Flip // Dark Side Rules' },
  { id: 'Revenge', icon: Sword, desc: 'Gain bonus when attacked' },
  { id: 'Sudden Death', icon: Skull, desc: 'Mistakes at 2 cards = +5 cards' },
  { id: 'Card Flood', icon: Layers, desc: 'Start with 15 cards' },
  { id: 'Dare!', icon: Info, desc: 'Play or Take a Dare' },
  { id: 'Attack', icon: Swords, desc: 'Random Card Attacks' },
  { id: 'Show Em No Mercy', icon: Skull, desc: 'Stackable Draws // No Mercy' },
  { id: 'Stacko', icon: Layers, desc: 'Stack Numbers // High Stakes' },
  { id: 'Spin', icon: RotateCw, desc: 'Spin the Wheel of Fate' },
  { id: 'Splash', icon: Droplets, desc: 'Water Theme // Splash Effects' },
  { id: 'Minimalista', icon: Square, desc: 'Clean UI // Simple Rules' },
  { id: 'Party!', icon: Users, desc: 'Group Effects // Party Time' },
  { id: 'Remix', icon: Shuffle, desc: 'Hands Constantly Remix' },
  { id: 'Power Grab', icon: Hand, desc: 'Steal Cards from Rivals' },
  { id: 'Wild Jackpot', icon: Coins, desc: 'Win the Card Jackpot' },
  { id: 'Wild Twists', icon: Wand2, desc: 'Wilds have Random Twists' },
  { id: 'Triple Play', icon: LayoutGrid, desc: 'Three Discard Piles' },
  { id: 'Ultimate Marvel', icon: Shield, desc: 'Heroic Action Cards' },
  { id: 'Mario', icon: Gamepad2, desc: 'Power-up with Mario' },
  { id: 'Jurassic World Dominion', icon: Footprints, desc: 'Dino Attacks // Survival' },
  { id: 'Star Wars', icon: Sword, desc: 'The Force is with You' },
  { id: 'DC', icon: Zap, desc: 'Super Heroic Showdown' },
  { id: 'The Simpsons', icon: Tv, desc: 'Doh! Special Rules' },
  { id: 'Minions', icon: Smile, desc: 'Bello! Minion Mayhem' },
  { id: 'Avengers', icon: Star, desc: 'Assemble the Team' },
];

const App: React.FC = () => {
  const [game, setGame] = useState<GameState | null>(null);
  const [isWildPicking, setIsWildPicking] = useState<{ card: CardData; index: number } | null>(null);
  const [shake, setShake] = useState(false);
  const [view, setView] = useState<'home' | 'menu' | 'playing' | 'spin_order'>('home');
  const [muted, setMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPlayerCount, setSelectedPlayerCount] = useState(4);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('Normal');
  const [showThemeIntro, setShowThemeIntro] = useState<GameMode | null>(null);
  const [comboEffect, setComboEffect] = useState<{ text: string; playerId: string } | null>(null);
  const [invalidCardId, setInvalidCardId] = useState<string | null>(null);
  const [winningCardId, setWinningCardId] = useState<string | null>(null);
  const [spinRotation, setSpinRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinWinner, setSpinWinner] = useState<string | null>(null);

  const triggerJuice = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const playSfx = (key: keyof typeof sounds) => {
    if (!muted) sounds[key]();
  };

  const initGame = useCallback((mode: GameMode = 'Classic', playerCount: number = 4, difficulty: Difficulty = 'Normal') => {
    const fullDeck = shuffle(createDeck(mode));
    const players: Player[] = [
      { id: 'player', name: 'You', hand: [], isAI: false, avatar: `https://api.dicebear.com/7.x/${THEME_DATA[mode].avatarStyle}/svg?seed=You` },
    ];

    const themeChars = THEME_DATA[mode].characters;
    let availableNames = themeChars && themeChars.length > 0 ? shuffle([...themeChars]) : shuffle([...AI_NAMES]);
    
    // If we need more names than the theme provides, add from AI_NAMES
    if (availableNames.length < playerCount) {
      const extraNames = shuffle(AI_NAMES.filter(n => !availableNames.includes(n)));
      availableNames = [...availableNames, ...extraNames];
    }

    for (let i = 1; i < playerCount; i++) {
      const name = availableNames[i-1];
      players.push({ 
        id: `ai${i}`, 
        name, 
        hand: [], 
        isAI: true, 
        avatar: `https://api.dicebear.com/7.x/${THEME_DATA[mode].avatarStyle}/svg?seed=${name}` 
      });
    }

    // Deal cards
    const startingCards = mode === 'Card Flood' ? 15 : 7;
    players.forEach(p => {
      p.hand = fullDeck.splice(0, startingCards);
    });

    // Initial discard
    let firstCard = fullDeck.splice(0, 1)[0];
    while (firstCard.color === 'Wild') {
      fullDeck.push(firstCard);
      firstCard = fullDeck.splice(0, 1)[0];
    }

    setGame({
      players,
      currentPlayerIndex: 0,
      direction: 1,
      discardPile: [firstCard],
      deck: fullDeck,
      currentColor: firstCard.color,
      currentValue: firstCard.type === 'Number' ? String(firstCard.value) : firstCard.type,
      isGameOver: false,
      winner: null,
      finishedPlayers: [],
      logs: [`Welcome to ZENNO-UNO GAME (${mode} Mode).`],
      pendingDrawCount: 0,
      unoCalled: new Array(players.length).fill(false),
      mode,
      difficulty,
    });
    setShowThemeIntro(mode);
    setTimeout(() => setShowThemeIntro(null), 3000);
    setSpinRotation(0);
    setSpinWinner(null);
    setView('spin_order');
  }, []);

  const handleSpinWheel = () => {
    if (isSpinning || !game) return;
    
    setIsSpinning(true);
    playSfx('special');
    
    // Random rotation: at least 5 full spins (1800 deg) + random segment
    // We have game.players.length segments.
    // Segment angle = 360 / players.length
    // We want to land on a specific player? No, random is fine.
    
    const segmentAngle = 360 / game.players.length;
    const randomOffset = Math.random() * 360;
    const totalRotation = spinRotation + 1800 + randomOffset;
    
    setSpinRotation(totalRotation);
    
    // Calculate winner
    // The wheel rotates clockwise. The pointer is usually at the top (0 deg) or right (90 deg).
    // Let's assume pointer is at Top (0 deg).
    // If wheel rotates X degrees, the segment at Top is determined by (360 - (X % 360)) % 360.
    // Actually, simpler:
    // Normalized rotation = totalRotation % 360.
    // If we have 4 players:
    // 0-90: Player 1?
    // It depends on how we render the segments.
    // Let's assume segments are rendered clockwise starting from 0.
    // Segment i is from i*angle to (i+1)*angle.
    // If pointer is at 0 (top), and wheel rotates clockwise by R degrees.
    // The segment under the pointer is the one that WAS at -R (or 360-R).
    
    setTimeout(() => {
      const normalizedRotation = totalRotation % 360;
      // The segment at the top (0 degrees) is what we want.
      // If wheel rotated by N degrees, the index at 0 is:
      // index = floor(((360 - normalizedRotation) % 360) / segmentAngle)
      
      const winningIndex = Math.floor(((360 - normalizedRotation) % 360) / segmentAngle);
      const winner = game.players[winningIndex];
      
      setSpinWinner(winner.name);
      playSfx('win');
      
      setTimeout(() => {
        setGame(prev => prev ? { ...prev, currentPlayerIndex: winningIndex, logs: [`${winner.name} starts first!`, ...prev.logs] } : null);
        setIsSpinning(false);
        setView('playing');
      }, 2500);
    }, 3000); // Animation duration
  };

  const addLog = (msg: string) => {
    setGame(prev => prev ? { ...prev, logs: [msg, ...prev.logs].slice(0, 5) } : null);
  };

  const nextTurn = (state: GameState, skip = 0) => {
    let nextIndex = (state.currentPlayerIndex + state.direction * (1 + skip)) % state.players.length;
    if (nextIndex < 0) nextIndex += state.players.length;
    
    // Skip finished players
    let attempts = 0;
    while (state.finishedPlayers.includes(state.players[nextIndex].id) && attempts < state.players.length) {
      nextIndex = (nextIndex + state.direction) % state.players.length;
      if (nextIndex < 0) nextIndex += state.players.length;
      attempts++;
    }
    
    return nextIndex;
  };

  const drawCards = (state: GameState, playerIndex: number, count: number) => {
    const newState = { ...state };
    let deck = [...newState.deck];
    let discard = [...newState.discardPile];

    if (deck.length < count) {
      const topCard = discard.pop()!;
      deck = shuffle(discard);
      discard = [topCard];
    }

    const drawn = deck.splice(0, count);
    newState.players[playerIndex].hand.push(...drawn);
    newState.deck = deck;
    newState.discardPile = discard;
    newState.unoCalled[playerIndex] = false;
    
    // Revenge Mode: If someone makes you draw cards, you gain a revenge bonus
    if (newState.mode === 'Revenge' && count > 0 && newState.currentPlayerIndex !== playerIndex) {
      if (!newState.revengeBonus) newState.revengeBonus = {};
      newState.revengeBonus[newState.players[playerIndex].id] = true;
      addLog(`${newState.players[playerIndex].name} is plotting REVENGE!`);
    }

    return newState;
  };

  const handleCallUno = () => {
    if (!game || game.isGameOver) return;
    const newState = { ...game };
    newState.unoCalled[0] = true;
    addLog("You called UNO!");
    playSfx('uno');
    setGame(newState);
  };

  const playCard = (card: CardData, colorPick?: CardColor) => {
    if (!game) return;
    const playerIndex = game.currentPlayerIndex;
    const player = game.players[playerIndex];
    
    let newState = { ...game };
    
    // Auto-drop logic: find all cards with same value
    let cardsToDrop: CardData[] = [card];
    if (card.type === 'Number') {
      const matchingNumbers = player.hand.filter(c => c.id !== card.id && c.type === 'Number' && c.value === card.value);
      if (matchingNumbers.length > 0) {
        cardsToDrop = [...cardsToDrop, ...matchingNumbers];
        setComboEffect({ text: `${cardsToDrop.length}X COMBO!`, playerId: player.id });
        setTimeout(() => setComboEffect(null), 1500);
        triggerJuice();
      }
    }

    newState.players[playerIndex].hand = player.hand.filter(c => !cardsToDrop.some(dc => dc.id === c.id));
    
    // Push all dropped cards to discard pile, but the last one determines the state
    cardsToDrop.forEach(c => newState.discardPile.push(c));
    
    const lastCard = cardsToDrop[cardsToDrop.length - 1];
    newState.currentColor = lastCard.color === 'Wild' ? colorPick! : lastCard.color;
    newState.currentValue = lastCard.type === 'Number' ? String(lastCard.value) : lastCard.type;

    if (cardsToDrop.length > 1) {
      addLog(`${player.name} dropped ${cardsToDrop.length} matching cards!`);
    } else {
      addLog(`${player.name} played ${card.color} ${card.type === 'Number' ? card.value : card.type}`);
    }
    
    playSfx(card.type === 'Number' ? 'play' : 'special');

    // Uno Penalty Check
    const cardsLeft = newState.players[playerIndex].hand.length;
    if ((cardsLeft === 1 || cardsLeft === 0) && !newState.unoCalled[playerIndex]) {
      if (player.isAI) {
        // If AI has 0 cards (about to win), auto-call to prevent issues
        if (cardsLeft === 0) {
           newState.unoCalled[playerIndex] = true;
           addLog(`${player.name} called UNO!`);
           playSfx('uno');
        } 
        // If 1 card left, we rely on the pre-play check (in useEffect).
        // If they forgot there, they are vulnerable to being caught.
      } else {
        const penalty = game.mode === 'Sudden Death' ? 5 : 2;
        addLog(`${player.name} forgot to call UNO! +${penalty} cards penalty.`);
        newState = drawCards(newState, playerIndex, penalty);
      }
    }

    // Check for win (only if no penalty was applied that gave them cards back)
    if (newState.players[playerIndex].hand.length === 0) {
      setWinningCardId(card.id);
      setTimeout(() => setWinningCardId(null), 2000);

      if (!newState.finishedPlayers.includes(player.id)) {
        newState.finishedPlayers.push(player.id);
        addLog(`${player.name} finished! Rank: ${newState.finishedPlayers.length}`);
        if (!player.isAI) playSfx('win');
      }

      // Check if game is over (only 1 player left)
      if (newState.finishedPlayers.length >= newState.players.length - 1) {
        // Add the last player to finished players as the loser
        const lastPlayer = newState.players.find(p => !newState.finishedPlayers.includes(p.id));
        if (lastPlayer) {
          newState.finishedPlayers.push(lastPlayer.id);
        }
        newState.isGameOver = true;
        newState.winner = newState.players.find(p => p.id === newState.finishedPlayers[0])?.name || 'Unknown';
        setGame(newState);
        return;
      }
      
      // If player finished, move to next turn immediately
      newState.currentPlayerIndex = nextTurn(newState, 0);
      setGame(newState);
      return;
    }

    // Party Mode Trigger
    if (game.mode === 'Party!' && !player.isAI) {
      const randomMsg = PARTY_MESSAGES[Math.floor(Math.random() * PARTY_MESSAGES.length)];
      newState.activePartyMessage = randomMsg;
    }

    // Special effects
    let skip = 0;
    let drawCount = 0;

    if (card.type === 'Skip') {
      skip = 1;
      if (game.mode === 'Show Em No Mercy') skip = 2; // Double skip
      triggerJuice();
    } else if (card.type === 'Reverse') {
      if (newState.players.length === 2) skip = 1;
      else newState.direction *= -1;
      triggerJuice();
    } else if (card.type === 'DrawTwo') {
      drawCount = 2;
      if (game.mode === 'Show Em No Mercy') drawCount = 4;
      triggerJuice();
    } else if (card.type === 'WildDrawFour') {
      drawCount = 4;
      if (game.mode === 'Show Em No Mercy') drawCount = 10;
      triggerJuice();
    }

    // Revenge Mode: Double attack effect if player has revenge bonus
    if (game.mode === 'Revenge' && drawCount > 0 && newState.revengeBonus?.[player.id]) {
      drawCount *= 2;
      addLog(`REVENGE STRIKE! ${player.name}'s attack is doubled!`);
      newState.revengeBonus[player.id] = false;
      playSfx('special');
    }

    if (card.type === 'DrawTwo' || card.type === 'WildDrawFour') {
      skip = 1;
    }

    // Mode specific twists
    if (game.mode === 'Attack' && Math.random() < 0.3) {
      const attackCount = Math.floor(Math.random() * 5) + 1;
      addLog(`ATTACK! Next player draws ${attackCount} cards!`);
      drawCount += attackCount;
    }

    if (game.mode === 'Flip!' && Math.random() < 0.2) {
      addLog("FLIP! The deck has been inverted!");
      newState.direction *= -1;
      triggerJuice();
    }

    if (game.mode === 'Wild Jackpot' && card.color === 'Wild') {
      const jackpot = Math.floor(Math.random() * 3) + 1;
      addLog(`JACKPOT! ${player.name} gets to discard ${jackpot} more cards!`);
    }

    if (game.mode === 'Spin' && Math.random() < 0.25) {
      const newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      newState.currentColor = newColor;
      addLog(`SPIN! The color is now ${newColor}!`);
      triggerJuice();
    }

    if (game.mode === 'Party!' && card.type !== 'Number') {
      addLog("PARTY TIME! Everyone draws 1 card!");
      newState.players.forEach((p, idx) => {
        if (idx !== playerIndex) {
          newState = drawCards(newState, idx, 1);
        }
      });
    }

    if (game.mode === 'Remix' && Math.random() < 0.1) {
      addLog("REMIX! Shuffling all hands!");
      const allCards: CardData[] = [];
      newState.players.forEach(p => {
        allCards.push(...p.hand);
        p.hand = [];
      });
      const shuffled = shuffle(allCards);
      let pIdx = 0;
      while (shuffled.length > 0) {
        newState.players[pIdx].hand.push(shuffled.pop()!);
        pIdx = (pIdx + 1) % newState.players.length;
      }
      triggerJuice();
    }

    if (game.mode === 'Splash' && card.color === 'Blue') {
      addLog("SPLASH! Next player gets soaked (+1 card)!");
      drawCount += 1;
    }

    if (game.mode === 'Mario' && card.type === 'Number' && card.value === 1) {
      addLog("MUSHROOM POWER! You get an extra turn!");
      skip = -1; // Effectively gives an extra turn
    }

    if (game.mode === 'Star Wars' && card.type === 'Reverse') {
      addLog("USE THE FORCE! You looked into the future and skipped the next player.");
      skip = 1;
    }

    // Theme Quiz Challenge: Chance to trigger for specific themes (player only)
    const quizThemes = ['Ultimate Marvel', 'Avengers', 'Mario', 'Star Wars', 'Jurassic World Dominion', 'DC', 'The Simpsons', 'Minions'];
    if (playerIndex === 0 && quizThemes.includes(game.mode) && Math.random() < 0.15) {
      const quizzes = THEME_QUIZZES[game.mode];
      if (quizzes && quizzes.length > 0) {
        const randomQuiz = quizzes[Math.floor(Math.random() * quizzes.length)];
        newState.activeQuiz = randomQuiz;
        addLog(`THEME CHALLENGE TRIGGERED!`);
        playSfx('special');
      }
    }

    if (drawCount > 0) {
      const nextIdx = nextTurn(newState);
      newState = drawCards(newState, nextIdx, drawCount);
      addLog(`${newState.players[nextIdx].name} draws ${drawCount}!`);
    }

    newState.currentPlayerIndex = nextTurn(newState, skip);

    // Chaos Mode: Chance for a task after playing (player only)
    if (playerIndex === 0 && newState.mode === 'Chaos' && Math.random() < 0.15) {
      const randomTask = CHAOS_TASKS[Math.floor(Math.random() * CHAOS_TASKS.length)];
      newState.activeChaosTask = randomTask;
      addLog(`Adventure Task: ${randomTask}`);
      playSfx('special');
    }

    // Attack Mode & Themed Attacks: Chance to attack an AI after playing (player only)
    const attackModes: GameMode[] = ['Attack', 'Ultimate Marvel', 'Mario', 'Jurassic World Dominion', 'Star Wars', 'DC', 'The Simpsons', 'Minions', 'Avengers'];
    if (playerIndex === 0 && attackModes.includes(newState.mode) && Math.random() < 0.25) {
      const targets = newState.players.filter((p, idx) => idx !== 0 && p.hand.length > 0);
      if (targets.length > 0) {
        const target = targets[Math.floor(Math.random() * targets.length)];
        const targetIdx = newState.players.findIndex(p => p.id === target.id);
        newState = drawCards(newState, targetIdx, 2);
        newState.attackTarget = target.name;
        addLog(`You attacked ${target.name}!`);
        playSfx('special');
        setTimeout(() => setGame(prev => prev ? { ...prev, attackTarget: null } : null), 1500);
      }
    }

    setGame(newState);
    setIsWildPicking(null);
  };

  const handleCompleteDare = () => {
    if (!game) return;
    addLog(`You completed the dare!`);
    let newState = { ...game, activeDare: null };
    newState.currentPlayerIndex = nextTurn(newState);
    setGame(newState);
    playSfx('play');
  };

  const handleClaimJackpot = () => {
    if (!game || !game.jackpotAmount) return;
    addLog(`You claimed the jackpot of ${game.jackpotAmount} cards!`);
    let newState = drawCards(game, 0, game.jackpotAmount);
    newState.jackpotAmount = 0;
    newState.currentPlayerIndex = nextTurn(newState);
    setGame(newState);
    playSfx('win');
  };

  const handlePartyConfirm = () => {
    if (!game) return;
    setGame({ ...game, activePartyMessage: null });
  };

  const handleQuizAnswer = (answerIndex: number) => {
    if (!game || !game.activeQuiz) return;
    
    let newState = { ...game, activeQuiz: null };
    const isCorrect = answerIndex === game.activeQuiz.correctIndex;
    
    if (isCorrect) {
      addLog("Correct! Challenge passed.");
      playSfx('win');
    } else {
      addLog("Wrong Answer! Draw 3 cards.");
      newState = drawCards(newState, 0, 3);
      playSfx('error');
    }
    
    setGame(newState);
  };

  const handleCompleteChaosTask = () => {
    if (!game) return;
    addLog(`You finished the adventure task!`);
    let newState = { ...game, activeChaosTask: null };
    newState.currentPlayerIndex = nextTurn(newState);
    setGame(newState);
    playSfx('play');
  };

  const handleSteal = (targetId: string) => {
    if (!game || game.currentPlayerIndex !== 0 || game.isGameOver) return;
    const targetPlayerIdx = game.players.findIndex(p => p.id === targetId);
    if (targetPlayerIdx === -1 || game.players[targetPlayerIdx].hand.length === 0) return;

    const newState = { ...game };
    const targetPlayer = newState.players[targetPlayerIdx];
    const cardIndex = Math.floor(Math.random() * targetPlayer.hand.length);
    const stolenCard = targetPlayer.hand.splice(cardIndex, 1)[0];
    
    newState.players[0].hand.push(stolenCard);
    newState.isStealing = false;
    newState.currentPlayerIndex = nextTurn(newState);
    addLog(`You stole a card from ${targetPlayer.name}!`);
    setGame(newState);
    playSfx('special');
    triggerJuice();
  };

  const handleFlip = () => {
    if (!game || game.currentPlayerIndex !== 0 || game.isGameOver) return;
    const isDark = !game.isDarkSide;
    addLog(`FLIP! Entering ${isDark ? 'DARK' : 'LIGHT'} mode!`);
    setGame({ ...game, isDarkSide: isDark });
    triggerJuice();
    playSfx('special');
  };

  const handlePlayerPlay = (card: CardData) => {
    if (!game || game.currentPlayerIndex !== 0 || game.isGameOver) return;

    const canPlay = card.color === 'Wild' || card.color === game.currentColor || 
                    (card.type === 'Number' && String(card.value) === game.currentValue) ||
                    (card.type !== 'Number' && card.type === game.currentValue);

    if (!canPlay) {
      if (game.mode === 'Sudden Death' && game.players[0].hand.length <= 2) {
        addLog(`SUDDEN DEATH MISTAKE! You played an illegal card and drew 5!`);
        let newState = drawCards(game, 0, 5);
        newState.currentPlayerIndex = nextTurn(newState);
        setGame(newState);
        playSfx('error');
      } else {
        setInvalidCardId(card.id);
        playSfx('error');
        setTimeout(() => setInvalidCardId(null), 500);
      }
      return;
    }

    if (card.color === 'Wild') {
      setIsWildPicking({ card, index: 0 });
    } else {
      playCard(card);
    }
  };

  const handleCatchEnemyUno = () => {
    if (!game || game.isGameOver) return;
    
    let caughtAny = false;
    let newState = { ...game };
    
    // Check all opponents
    newState.players.forEach((p, idx) => {
      if (idx !== 0 && p.hand.length === 1 && !newState.unoCalled[idx]) {
        const penalty = game.mode === 'Sudden Death' ? 5 : 2;
        addLog(`CAUGHT! ${p.name} didn't call UNO! +${penalty} cards.`);
        newState = drawCards(newState, idx, penalty);
        playSfx('special');
        caughtAny = true;
      }
    });

    if (caughtAny) {
      setGame(newState);
      triggerJuice();
    } else {
      playSfx('error');
    }
  };

  const handleDraw = () => {
    if (!game || game.currentPlayerIndex !== 0 || game.isGameOver) return;
    
    if (game.mode === 'Dare!') {
      const randomDare = DARES[Math.floor(Math.random() * DARES.length)];
      setGame({ ...game, activeDare: randomDare });
      addLog(`DARE! ${randomDare}`);
      playSfx('special');
      return;
    }

    // Wild Jackpot Mode: Chance to hit jackpot on draw
    if (game.mode === 'Wild Jackpot' && Math.random() < 0.1) {
      const amount = Math.floor(Math.random() * 8) + 5;
      setGame({ ...game, jackpotAmount: amount });
      playSfx('special');
      return;
    }

    let newState = drawCards(game, 0, 1);
    addLog(`You drew a card.`);
    playSfx('draw');
    newState.currentPlayerIndex = nextTurn(newState);
    setGame(newState);
  };

  // AI Logic
  useEffect(() => {
    if (!game || game.isGameOver || isPaused || !game.players[game.currentPlayerIndex].isAI || game.activeQuiz || game.activeChaosTask || game.activeDare || game.activePartyMessage) return;

    const baseDelay = game.mode === 'Speed' ? 600 : 1500;
    const difficultyMultiplier = 
      game.difficulty === 'Easy' ? 1.5 : 
      game.difficulty === 'Hard' ? 0.6 : 1;
    const delay = baseDelay * difficultyMultiplier;

    const timer = setTimeout(() => {
      const aiIndex = game.currentPlayerIndex;
      const ai = game.players[aiIndex];
      
      // AI calls UNO probability based on difficulty
      // Easy: 97% chance to be caught (3% chance to call)
      // Normal: 60% chance to be caught (40% chance to call)
      // Hard: 20% chance to be caught (80% chance to call)
      const callUnoChance = 
        game.difficulty === 'Easy' ? 0.03 :
        game.difficulty === 'Normal' ? 0.40 : 0.80;

      // AI calls UNO if they have 2 cards
      if (ai.hand.length === 2 && !game.unoCalled[aiIndex] && Math.random() < callUnoChance) {
        setGame(prev => {
          if (!prev) return null;
          const next = { ...prev };
          next.unoCalled[aiIndex] = true;
          return next;
        });
        addLog(`${ai.name} called UNO!`);
        playSfx('uno');
        return; // Wait for next tick to play
      }

      // AI in Flip mode (10% chance to flip)
      if (game.mode === 'Flip!' && Math.random() < 0.1) {
        const isDark = !game.isDarkSide;
        addLog(`${ai.name} flipped the deck to ${isDark ? 'DARK' : 'LIGHT'}!`);
        setGame(prev => prev ? { ...prev, isDarkSide: isDark } : null);
        playSfx('special');
        triggerJuice();
        return;
      }

      // AI in Power Grab mode (15% chance to steal)
      if (game.mode === 'Power Grab' && Math.random() < 0.15) {
        const targets = game.players.filter((p, idx) => idx !== aiIndex && p.hand.length > 0);
        if (targets.length > 0) {
          const target = targets[Math.floor(Math.random() * targets.length)];
          const targetIdx = game.players.findIndex(p => p.id === target.id);
          
          setGame(prev => {
            if (!prev) return null;
            const next = { ...prev };
            const cardIdx = Math.floor(Math.random() * next.players[targetIdx].hand.length);
            const stolen = next.players[targetIdx].hand.splice(cardIdx, 1)[0];
            next.players[aiIndex].hand.push(stolen);
            next.currentPlayerIndex = nextTurn(next);
            return next;
          });
          addLog(`${ai.name} stole a card from ${target.name}!`);
          playSfx('special');
          triggerJuice();
          return;
        }
      }

      // AI in Chaos mode (10% chance for a task)
      if (game.mode === 'Chaos' && Math.random() < 0.1) {
        const randomTask = CHAOS_TASKS[Math.floor(Math.random() * CHAOS_TASKS.length)];
        addLog(`${ai.name} encountered a chaos task: ${randomTask}`);
        setGame(prev => prev ? { ...prev, activeChaosTask: randomTask } : null);
        playSfx('special');
        return;
      }

      // AI in Attack mode or themed attack modes (20% chance to attack)
      const attackModes: GameMode[] = ['Attack', 'Ultimate Marvel', 'Mario', 'Jurassic World Dominion', 'Star Wars', 'DC', 'The Simpsons', 'Minions', 'Avengers'];
      if (attackModes.includes(game.mode) && Math.random() < 0.2) {
        const targets = game.players.filter((p, idx) => idx !== aiIndex && p.hand.length > 0);
        if (targets.length > 0) {
          const target = targets[Math.floor(Math.random() * targets.length)];
          addLog(`${ai.name} attacked ${target.name}!`);
          setGame(prev => {
            if (!prev) return null;
            const next = drawCards(prev, game.players.findIndex(p => p.id === target.id), 2);
            next.attackTarget = target.name;
            return next;
          });
          playSfx('special');
          setTimeout(() => setGame(prev => prev ? { ...prev, attackTarget: null } : null), 1500);
          return;
        }
      }

      // AI in Wild Jackpot mode (5% chance to hit jackpot)
      if (game.mode === 'Wild Jackpot' && Math.random() < 0.05) {
        const amount = Math.floor(Math.random() * 5) + 3;
        addLog(`${ai.name} hit the jackpot!`);
        setGame(prev => {
          if (!prev) return null;
          const next = drawCards(prev, aiIndex, amount);
          return next;
        });
        playSfx('win');
        return;
      }

      const playable = ai.hand.filter(card => 
        card.color === 'Wild' || card.color === game.currentColor || 
        (card.type === 'Number' && String(card.value) === game.currentValue) ||
        (card.type !== 'Number' && card.type === game.currentValue)
      );

      if (playable.length > 0) {
        // AI Strategy: 
        // 1. Prefer action cards (Skip, Reverse, DrawTwo) to mess with opponents
        // 2. Prefer matching color over matching value
        // 3. Save Wilds for last
        
        const actions = playable.filter(c => c.type !== 'Number' && c.type !== 'Wild' && c.type !== 'WildDrawFour');
        const numbers = playable.filter(c => c.type === 'Number');
        const wilds = playable.filter(c => c.color === 'Wild');
        
        let card: CardData;
        if (actions.length > 0) {
          card = actions[Math.floor(Math.random() * actions.length)];
        } else if (numbers.length > 0) {
          card = numbers[Math.floor(Math.random() * numbers.length)];
        } else {
          card = wilds[Math.floor(Math.random() * wilds.length)];
        }

        let colorPick: CardColor | undefined;
        if (card.color === 'Wild') {
          // Pick color AI has most of
          const colorCounts = COLORS.map(col => ({
            col,
            count: ai.hand.filter(c => c.color === col).length
          }));
          colorCounts.sort((a, b) => b.count - a.count);
          colorPick = colorCounts[0].col;
        }

        playCard(card, colorPick);
      } else {
        if (game.mode === 'Dare!') {
          const randomDare = DARES[Math.floor(Math.random() * DARES.length)];
          addLog(`${ai.name} took a dare: ${randomDare}`);
          playSfx('special');
          const newState = { ...game };
          newState.currentPlayerIndex = nextTurn(newState);
          setGame(newState);
        } else {
          let newState = drawCards(game, game.currentPlayerIndex, 1);
          addLog(`${ai.name} drew a card.`);
          playSfx('draw');
          newState.currentPlayerIndex = nextTurn(newState);
          setGame(newState);
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [game]);

  if (view === 'home') {
    return (
      <div className="fixed inset-0 w-full h-full bg-zinc-950 text-white font-sans selection:bg-red-500/30 overflow-y-auto scrollbar-hide flex flex-col items-center justify-center relative px-4">
        <SpiderWeb />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center space-y-8 md:space-y-12 max-w-2xl px-4 sm:px-6 w-full py-8"
        >
          <div className="space-y-4 md:space-y-6">
            <div className="inline-block p-4 md:p-6 bg-red-600 rounded-2xl md:rounded-full shadow-2xl shadow-red-600/40 mb-2 md:mb-4">
              <Swords className="w-12 h-12 md:w-20 md:h-20" />
            </div>
            <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black italic tracking-tighter uppercase leading-none">
              ZENNO<br />
              <span className="text-red-600">-UNO</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg font-mono opacity-60 uppercase tracking-widest leading-relaxed">
              A fast-paced, themed card game where matching numbers drop together. Outsmart your opponents and be the first to clear your hand!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4 md:pt-8 w-full">
            <button 
              onClick={() => {
                playSfx('click');
                setView('menu');
              }}
              className="w-full sm:w-auto px-8 py-4 md:px-16 md:py-6 bg-white text-black font-black uppercase tracking-widest rounded-full hover:bg-red-600 hover:text-white transition-all transform hover:scale-105 flex items-center justify-center space-x-3 md:space-x-4 shadow-2xl shadow-white/10"
            >
              <Play className="w-6 h-6 md:w-8 md:h-8" />
              <span className="text-base md:text-xl">Play Game</span>
            </button>
            <button 
              onClick={() => {
                playSfx('click');
                setMuted(!muted);
              }}
              className="w-full sm:w-auto px-8 py-4 md:px-12 md:py-6 bg-zinc-900 text-white font-black uppercase tracking-widest rounded-full hover:bg-white hover:text-black transition-all transform hover:scale-105 flex items-center justify-center space-x-3 md:space-x-4 border border-white/10"
            >
              {muted ? <VolumeX className="w-6 h-6 md:w-8 md:h-8" /> : <Volume2 className="w-6 h-6 md:w-8 md:h-8" />}
              <span className="text-base md:text-xl">{muted ? 'Unmute' : 'Mute'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (view === 'spin_order' && game) {
    const segmentAngle = 360 / game.players.length;
    
    return (
      <div className="fixed inset-0 w-full h-full bg-zinc-950 text-white font-sans overflow-y-auto scrollbar-hide flex flex-col items-center justify-center relative px-4 py-8">
        <SpiderWeb mode={game.mode} isDarkSide={game.isDarkSide} />
        
        <div className="relative z-10 flex flex-col items-center space-y-8 md:space-y-12 w-full max-w-4xl my-auto">
          <div className="text-center space-y-2">
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">Who Starts?</h1>
            <p className="text-sm md:text-base font-mono opacity-60 uppercase tracking-widest">Spin the Wheel of Fate</p>
          </div>

          <div className="relative">
            {/* Pointer */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 text-red-500 filter drop-shadow-lg">
              <ArrowDown className="w-12 h-12 md:w-16 md:h-16 fill-current" />
            </div>

            {/* Wheel Container */}
            <motion.div
              animate={{ rotate: spinRotation }}
              transition={{ duration: 3, ease: "circOut" }}
              className="w-64 h-64 md:w-96 md:h-96 max-w-[80vw] max-h-[80vw] rounded-full border-4 border-white/10 relative overflow-hidden shadow-2xl shadow-black/50 bg-zinc-900"
            >
              {/* Conic Gradient Background */}
              <div 
                className="absolute inset-0 rounded-full opacity-20"
                style={{
                  background: `conic-gradient(from 0deg, ${game.players.map((p, i) => 
                    `${i % 2 === 0 ? '#ef4444' : '#27272a'} ${i * segmentAngle}deg ${(i + 1) * segmentAngle}deg`
                  ).join(', ')})`
                }}
              />
              
              {/* Separator Lines */}
              {game.players.map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-white/20 origin-bottom"
                  style={{ transform: `translateX(-50%) rotate(${i * segmentAngle}deg)` }}
                />
              ))}

              {/* Player Content */}
              {game.players.map((p, i) => (
                <div
                  key={p.id}
                  className="absolute top-1/2 left-1/2 w-0 h-0 flex items-center justify-center"
                  style={{ transform: `rotate(${i * segmentAngle + segmentAngle / 2}deg)` }}
                >
                   <div className="-translate-y-20 md:-translate-y-32">
                      <div style={{ transform: `rotate(-${i * segmentAngle + segmentAngle / 2}deg)` }} className="flex flex-col items-center">
                         <img src={p.avatar} alt={p.name} className="w-8 h-8 md:w-12 md:h-12 rounded-full border border-white/20 bg-black" referrerPolicy="no-referrer" />
                         <span className="text-[8px] md:text-[10px] font-black uppercase bg-black/50 px-1 rounded mt-1 whitespace-nowrap">{p.name}</span>
                      </div>
                   </div>
                </div>
              ))}
              
              {/* Center Cap */}
              <div className="absolute top-1/2 left-1/2 w-8 h-8 md:w-12 md:h-12 bg-zinc-800 rounded-full border-2 border-white/20 -translate-x-1/2 -translate-y-1/2 z-10 shadow-lg" />
            </motion.div>
          </div>

          <div className="h-16 md:h-20 flex items-center justify-center">
            {spinWinner ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center"
              >
                <p className="text-sm md:text-base font-mono opacity-60 uppercase tracking-widest">Winner</p>
                <h2 className="text-3xl md:text-5xl font-black italic uppercase text-yellow-500">{spinWinner}</h2>
              </motion.div>
            ) : (
              <button
                onClick={handleSpinWheel}
                disabled={isSpinning}
                className={`px-8 py-3 md:px-12 md:py-4 bg-red-600 text-white font-black uppercase tracking-widest rounded-full shadow-lg shadow-red-600/40 transition-all ${isSpinning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:bg-red-500'}`}
              >
                {isSpinning ? 'Spinning...' : 'SPIN!'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'menu') {
    return (
      <div className="fixed inset-0 w-full h-full bg-zinc-950 text-white font-sans selection:bg-red-500/30 overflow-hidden flex flex-col items-center justify-center relative">
        <SpiderWeb />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center space-y-6 md:space-y-12 w-full max-w-6xl flex flex-col items-center h-full max-h-screen overflow-y-auto scrollbar-hide py-8 px-4"
        >
          <div className="space-y-2 md:space-y-4 pt-4 shrink-0">
            <div className="inline-block p-3 md:p-4 bg-red-600 rounded-2xl md:rounded-3xl shadow-2xl shadow-red-600/40 mb-2 md:mb-4">
              <Swords className="w-10 h-10 md:w-16 md:h-16" />
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
              ZENNO<br />
              <span className="text-red-600">-UNO</span>
            </h1>
            <p className="text-[10px] md:text-sm font-mono opacity-40 uppercase tracking-[0.2em] md:tracking-[0.3em]">The Nexus Awaits // Choose Your Mode</p>
          </div>

          {/* New Selectors */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-8 px-6 py-4 md:px-8 md:py-6 bg-zinc-900/30 rounded-2xl md:rounded-3xl border border-white/5 backdrop-blur-sm w-full max-w-4xl shrink-0">
            {/* Player Count */}
            <div className="space-y-2 md:space-y-3 w-full lg:w-auto">
              <p className="text-[10px] md:text-xs font-mono opacity-40 uppercase tracking-widest text-center lg:text-left">Player Count</p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                {[2, 3, 4, 5, 6, 7].map(num => (
                  <button
                    key={num}
                    onClick={() => { playSfx('click'); setSelectedPlayerCount(num); }}
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-xl font-black transition-all text-sm md:text-lg ${selectedPlayerCount === num ? 'bg-red-600 text-white scale-110 shadow-lg shadow-red-600/40' : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-2 md:space-y-3 w-full lg:w-auto">
              <p className="text-[10px] md:text-xs font-mono opacity-40 uppercase tracking-widest text-center lg:text-left">Difficulty</p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                {(['Easy', 'Normal', 'Hard'] as Difficulty[]).map(diff => (
                  <button
                    key={diff}
                    onClick={() => { playSfx('click'); setSelectedDifficulty(diff); }}
                    className={`px-4 py-2 md:px-6 md:py-3 rounded-xl font-black text-xs md:text-sm transition-all ${selectedDifficulty === diff ? 'bg-white text-black scale-105 shadow-lg shadow-white/20' : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'}`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 w-full px-2 md:px-4 pb-24">
            {MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  playSfx('click');
                  initGame(mode.id, selectedPlayerCount, selectedDifficulty);
                }}
                className="group relative p-4 md:p-5 bg-zinc-900/50 border border-white/5 rounded-xl md:rounded-2xl hover:bg-red-600 transition-all duration-300 text-left overflow-hidden flex items-center min-h-[80px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex items-center space-x-3 md:space-x-4 w-full">
                  <div className="p-2 md:p-3 bg-zinc-800 rounded-lg md:rounded-xl group-hover:bg-white/20 transition-colors shrink-0">
                    <mode.icon className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-black uppercase tracking-widest text-sm md:text-base truncate">{mode.id}</h3>
                    <p className="text-[10px] md:text-xs opacity-40 group-hover:opacity-100 transition-opacity uppercase font-mono line-clamp-2">{mode.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center space-x-6 opacity-40 pb-8 shrink-0">
            <button onClick={() => setMuted(!muted)} className="hover:opacity-100 transition-opacity flex items-center space-x-2 p-4">
              {muted ? <VolumeX className="w-6 h-6 md:w-8 md:h-8" /> : <Volume2 className="w-6 h-6 md:w-8 md:h-8" />}
              <span className="text-xs md:text-sm font-black uppercase tracking-widest">{muted ? 'Muted' : 'Sound On'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!game) return null;

  const currentPlayer = game.players[game.currentPlayerIndex];
  const topCard = game.discardPile[game.discardPile.length - 1];

  return (
    <div className={`fixed inset-0 w-full h-full ${game.isDarkSide ? 'bg-red-950' : 'bg-zinc-950'} text-white font-sans selection:bg-red-500/30 overflow-hidden flex flex-col overscroll-none transition-colors duration-1000 ${shake ? 'translate-x-2 translate-y-1 scale-[1.01]' : ''}`}>
      <SpiderWeb mode={game.mode} isDarkSide={game.isDarkSide} />
      <ThemeParticles mode={game.mode} isDarkSide={game.isDarkSide} />

      {/* New Mode Modals */}
      <AnimatePresence>
        {game.jackpotAmount && game.jackpotAmount > 0 && game.currentPlayerIndex === 0 && (
          <JackpotModal amount={game.jackpotAmount} onClaim={handleClaimJackpot} />
        )}
        {game.activePartyMessage && (
          <PartyMessageModal 
            message={game.activePartyMessage} 
            onConfirm={handlePartyConfirm} 
          />
        )}
        {game.activeQuiz && (
          <QuizChallengeModal 
            quiz={game.activeQuiz} 
            mode={game.mode} 
            onAnswer={handleQuizAnswer} 
          />
        )}
        {game.activeChaosTask && game.currentPlayerIndex === 0 && (
          <ChaosTaskModal task={game.activeChaosTask} onComplete={handleCompleteChaosTask} />
        )}
        {game.attackTarget && (
          <AttackAnimation targetName={game.attackTarget} mode={game.mode} />
        )}
      </AnimatePresence>

      {/* Dare Modal */}
      <AnimatePresence>
        {game.activeDare && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full bg-zinc-900 border border-white/10 p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] text-center space-y-6 sm:space-y-8 shadow-2xl"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-blue-600/20">
                <Info className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter">DARE TIME!</h2>
                <p className="text-lg sm:text-xl font-medium text-zinc-300 leading-relaxed italic">
                  "{game.activeDare}"
                </p>
              </div>
              <button
                onClick={handleCompleteDare}
                className="w-full py-3 sm:py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl sm:rounded-2xl hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 text-sm sm:text-base"
              >
                I've Done It!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Steal Target Selection */}
      <AnimatePresence>
        {game.isStealing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[350] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6"
          >
            <div className="max-w-4xl w-full space-y-6 sm:space-y-8">
              <h2 className="text-2xl sm:text-4xl font-black italic uppercase tracking-tighter text-center">Pick a target to steal from</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {game.players.filter(p => p.id !== 'player' && p.hand.length > 0).map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSteal(p.id)}
                    className="p-4 sm:p-6 bg-zinc-900 border border-white/10 rounded-2xl sm:rounded-3xl hover:bg-rose-600 transition-all group text-center space-y-2 sm:space-y-4"
                  >
                    <img src={p.avatar} alt={p.name} className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-zinc-800 p-1.5 sm:p-2 group-hover:bg-white/20" referrerPolicy="no-referrer" />
                    <div>
                      <p className="font-black uppercase tracking-widest text-[10px] sm:text-sm">{p.name}</p>
                      <p className="text-[10px] sm:text-xs opacity-40 group-hover:opacity-100">{p.hand.length} Cards</p>
                    </div>
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setGame({ ...game, isStealing: false })}
                className="mx-auto block px-6 py-2 sm:px-8 sm:py-3 bg-zinc-800 text-white font-black uppercase tracking-widest rounded-full hover:bg-white hover:text-black transition-all text-xs sm:text-base"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theme Intro Overlay */}
      <AnimatePresence>
        {showThemeIntro && THEME_DATA[showThemeIntro] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-xl pointer-events-none p-4"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="text-center space-y-6 sm:space-y-8 w-full max-w-4xl"
            >
              <div className={`inline-block p-4 sm:p-6 md:p-8 rounded-full ${THEME_DATA[showThemeIntro].color} shadow-2xl shadow-white/20`}>
                {MODES.find(m => m.id === showThemeIntro)?.icon && React.createElement(MODES.find(m => m.id === showThemeIntro)!.icon, { className: "w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 text-white" })}
              </div>
              <div className="space-y-2">
                <h2 className="text-5xl sm:text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
                  {THEME_DATA[showThemeIntro].title}
                </h2>
                <p className="text-sm sm:text-lg md:text-2xl font-mono uppercase tracking-[0.2em] sm:tracking-[0.5em] opacity-60">
                  {THEME_DATA[showThemeIntro].subtitle}
                </p>
              </div>
              
              {/* Character Animation */}
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-8 md:mt-12">
                {THEME_DATA[showThemeIntro].characters.map((char, idx) => (
                  <motion.div
                    key={char}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 rounded-full border border-white/10 backdrop-blur-sm"
                  >
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">{char}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex-none relative z-10 p-2 flex justify-between items-center border-b border-white/5 bg-black/40 backdrop-blur-sm h-[8vh] min-h-[50px]">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="p-1.5 sm:p-2 bg-red-600 rounded-lg shadow-lg shadow-red-600/20">
            <Swords className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-sm sm:text-xl font-black italic tracking-tighter uppercase leading-none">ZENNO-UNO</h1>
            <div className="flex items-center space-x-1 sm:space-x-2 mt-0.5 sm:mt-1">
              <p className="text-[8px] sm:text-[10px] font-mono opacity-40 uppercase tracking-widest hidden sm:block">Multiplayer Nexus</p>
              <span className="w-1 h-1 bg-red-600 rounded-full hidden sm:block" />
              <p className="text-[8px] sm:text-[10px] font-mono text-red-500 uppercase tracking-widest font-bold">{game.mode}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="flex items-center space-x-1 sm:space-x-2 px-2 py-1 sm:px-3 sm:py-1 bg-zinc-900 rounded-full border border-white/5">
            {game.direction === 1 ? <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" /> : <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />}
            <span className="text-[8px] sm:text-[10px] font-bold uppercase opacity-60">Flow</span>
          </div>
          <button onClick={() => setIsPaused(true)} className="p-1.5 sm:p-2 hover:bg-white/5 rounded-full transition-colors">
            <Pause className="w-4 h-4 sm:w-5 sm:h-5 opacity-40 hover:opacity-100" />
          </button>
          <button onClick={() => setMuted(!muted)} className="p-1.5 sm:p-2 hover:bg-white/5 rounded-full transition-colors">
            {muted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 opacity-40" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 opacity-40" />}
          </button>
          <button onClick={() => setView('menu')} className="p-1.5 sm:p-2 hover:bg-white/5 rounded-full transition-colors">
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 opacity-40 hover:opacity-100" />
          </button>
        </div>
      </header>

      {/* Game Board */}
      <main className={`flex-grow relative z-10 flex flex-col items-center justify-between p-2 transition-colors duration-1000 overflow-hidden ${
        game.mode === 'The Simpsons' ? 'bg-yellow-500/5' :
        game.mode === 'Star Wars' ? 'bg-blue-900/10' :
        game.mode === 'Jurassic World Dominion' ? 'bg-emerald-900/10' :
        'bg-transparent'
      }`}>
        
        {/* Theme Floating Elements */}
        {THEME_DATA[game.mode]?.characters.length > 0 && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
            {THEME_DATA[game.mode].characters.map((char, i) => (
              <motion.div
                key={char}
                animate={{
                  y: [0, -20, 0],
                  x: [0, 10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 5 + i,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute text-2xl sm:text-4xl font-black uppercase tracking-tighter"
                style={{
                  top: `${20 + i * 15}%`,
                  left: i % 2 === 0 ? '5%' : '85%'
                }}
              >
                {char}
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Opponents Row - Scrollable on mobile */}
        <div className="w-full max-w-7xl px-2 flex-none h-[18vh] min-h-[100px] flex items-center">
          <div className="w-full flex justify-start md:justify-center items-center gap-4 md:gap-8 overflow-x-auto pb-2 scrollbar-hide snap-x h-full">
            {game.players.slice(1).map((p, i) => (
              <div key={p.id} className={`flex flex-col items-center space-y-1 transition-all duration-300 shrink-0 snap-center ${game.currentPlayerIndex === i + 1 ? 'scale-110' : 'opacity-60 scale-90'}`}>
                <div className={`relative p-0.5 rounded-full border-2 ${game.currentPlayerIndex === i + 1 ? 'border-red-500 shadow-lg shadow-red-500/20' : 'border-transparent'}`}>
                  <div className="w-[8vh] h-[8vh] min-w-[50px] min-h-[50px] max-w-[80px] max-h-[80px] bg-zinc-900 rounded-full flex items-center justify-center overflow-hidden border border-white/10">
                    <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <AnimatePresence>
                    {comboEffect?.playerId === p.id && (
                      <motion.div
                        initial={{ scale: 0, y: 0, opacity: 0 }}
                        animate={{ scale: 1.5, y: -40, opacity: 1 }}
                        exit={{ scale: 2, y: -80, opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
                      >
                        <span className="text-xl font-black italic text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)] whitespace-nowrap">
                          {comboEffect.text}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {game.unoCalled[i + 1] && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-red-600 text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-lg shadow-red-600/40 z-20"
                    >
                      UNO!
                    </motion.div>
                  )}
                  <div className="absolute -bottom-1 -right-1 bg-zinc-800 border border-white/10 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg">
                    {p.hand.length}
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-center bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center Play Area */}
        <div className="flex-grow w-full flex flex-row items-center justify-center gap-4 md:gap-16 my-2 md:my-4 max-h-[40vh]">
          {/* Deck */}
          <div className="relative group cursor-pointer flex flex-col items-center h-[18vh] min-h-[100px] max-h-[400px] aspect-[2.5/3.5]" onClick={handleDraw}>
            <div className="absolute inset-0 bg-red-600/20 blur-2xl rounded-full group-hover:bg-red-600/40 transition-colors" />
            <SpiderCard card={{} as any} isBack className="w-full h-full" mode={game.mode} isDarkSide={game.isDarkSide} />
            <div className="absolute -bottom-6 text-[8px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">Draw Deck</div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <PlusCircle className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Discard Pile */}
          <div className="relative flex flex-col items-center h-[18vh] min-h-[100px] max-h-[400px] aspect-[2.5/3.5]">
            <div className={`absolute -inset-12 blur-[100px] rounded-full opacity-30 transition-colors duration-700 ${
              game.currentColor === 'Red' ? 'bg-red-500' :
              game.currentColor === 'Blue' ? 'bg-blue-500' :
              game.currentColor === 'Green' ? 'bg-emerald-500' :
              game.currentColor === 'Yellow' ? 'bg-amber-500' : 'bg-zinc-500'
            }`} />
            
            {/* Current Color Indicator */}
            <div className="absolute -top-12 md:-top-16 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-1">
              <span className="text-[6px] md:text-[8px] font-black uppercase tracking-[0.2em] opacity-40">Current Color</span>
              <div className={`px-3 py-0.5 md:px-4 md:py-1 rounded-full border-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-lg transition-all duration-500 ${
                game.currentColor === 'Red' ? 'bg-red-600 border-red-400 text-white shadow-red-500/20' :
                game.currentColor === 'Blue' ? 'bg-blue-600 border-blue-400 text-white shadow-blue-500/20' :
                game.currentColor === 'Green' ? 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-500/20' :
                'bg-amber-500 border-amber-300 text-amber-950 shadow-amber-500/20'
              }`}>
                {game.currentColor}
              </div>
            </div>

            <div className="relative w-full h-full">
              {/* Ghost cards for stack effect */}
              <div className="absolute top-1 left-1 w-full h-full opacity-20 rotate-3">
                <SpiderCard card={{} as any} isBack className="w-full h-full" disabled mode={game.mode} isDarkSide={game.isDarkSide} />
              </div>
              <div className="absolute -top-1 -left-1 w-full h-full opacity-10 -rotate-2">
                <SpiderCard card={{} as any} isBack className="w-full h-full" disabled mode={game.mode} isDarkSide={game.isDarkSide} />
              </div>

              <AnimatePresence mode="popLayout">
                <motion.div
                  key={topCard.id}
                  layoutId={topCard.id}
                  initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 1.2, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="w-full h-full"
                >
                  <SpiderCard 
                    card={{ ...topCard, color: game.currentColor }} 
                    className="w-full h-full"
                    disabled 
                    mode={game.mode} 
                    isWinning={winningCardId === topCard.id}
                    isDarkSide={game.isDarkSide}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="absolute -bottom-6 text-[8px] font-black uppercase tracking-widest opacity-40">Discard Pile</div>
          </div>
        </div>

        {/* Player Hand */}
        <div className="w-full max-w-7xl flex flex-col items-center space-y-2 md:space-y-4 flex-none h-[30vh] min-h-[180px] justify-end pb-2">
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 px-2">
             <div className={`px-3 py-1 md:px-4 md:py-1 rounded-full border text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-colors relative ${
               game.currentPlayerIndex === 0 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-900 border-white/5 opacity-40'
             }`}>
               {game.currentPlayerIndex === 0 ? "Your Turn" : "Waiting..."}
               
               <AnimatePresence>
                {comboEffect?.playerId === 'player' && (
                  <motion.div
                    initial={{ scale: 0, y: 0, opacity: 0 }}
                    animate={{ scale: 1.5, y: -40, opacity: 1 }}
                    exit={{ scale: 2, y: -80, opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
                  >
                    <span className="text-lg md:text-xl font-black italic text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)] whitespace-nowrap">
                      {comboEffect.text}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
             </div>
             
             {game.players[0].hand.length === 2 && !game.unoCalled[0] && (
               <motion.button
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 whileHover={{ scale: 1.1 }}
                 whileTap={{ scale: 0.9 }}
                 onClick={handleCallUno}
                 className="px-4 py-1 md:px-6 md:py-1 bg-red-600 text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-red-600/40"
               >
                 Call UNO!
               </motion.button>
             )}

             {game.players.some((p, i) => i !== 0 && p.hand.length === 1) && (
               <motion.button
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 whileHover={{ scale: 1.1 }}
                 whileTap={{ scale: 0.9 }}
                 onClick={handleCatchEnemyUno}
                 className="px-4 py-1 md:px-6 md:py-1 bg-yellow-500 text-black text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-yellow-500/40 ml-2 animate-pulse"
               >
                 CATCH UNO!
               </motion.button>
             )}

             {game.unoCalled[0] && (
               <div className="px-3 py-1 md:px-4 md:py-1 bg-red-600/20 border border-red-500 text-red-500 text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-full">
                 UNO Called
               </div>
             )}

             {game.mode === 'Flip!' && game.currentPlayerIndex === 0 && (
               <motion.button
                 whileHover={{ scale: 1.1 }}
                 whileTap={{ scale: 0.9 }}
                 onClick={handleFlip}
                 className={`px-4 py-1 md:px-6 md:py-1 border text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg transition-colors ${
                   game.isDarkSide ? 'bg-red-600 border-red-400 text-white' : 'bg-zinc-900 border-white/20 text-white'
                 }`}
               >
                 Flip to {game.isDarkSide ? 'Light' : 'Dark'}
               </motion.button>
             )}

             {game.mode === 'Power Grab' && game.currentPlayerIndex === 0 && (
               <motion.button
                 whileHover={{ scale: 1.1 }}
                 whileTap={{ scale: 0.9 }}
                 onClick={() => setGame({ ...game, isStealing: !game.isStealing })}
                 className={`px-4 py-1 md:px-6 md:py-1 text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg transition-colors ${
                   game.isStealing ? 'bg-rose-600 text-white' : 'bg-zinc-900 border border-white/20 text-white'
                 }`}
               >
                 {game.isStealing ? 'Cancel Steal' : 'Steal Card'}
               </motion.button>
             )}
          </div>
          
          <div className="flex justify-center items-end px-2 sm:px-4 md:px-12 w-full overflow-x-visible overflow-y-visible pt-4 sm:pt-6 md:pt-10 h-[22vh] min-h-[140px]">
            <AnimatePresence>
              {game.finishedPlayers.includes(game.players[0].id) ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="py-8 sm:py-12 text-center w-full"
                >
                  <div className="inline-block p-3 sm:p-4 bg-emerald-600/20 border border-emerald-500 rounded-xl sm:rounded-2xl mb-2 sm:mb-4">
                    <Trophy className="w-8 h-8 sm:w-12 sm:h-12 text-emerald-500" />
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black italic uppercase tracking-tighter">You Finished!</h3>
                  <p className="text-zinc-400 font-mono uppercase tracking-widest text-[8px] sm:text-[10px] md:text-xs">Waiting for others to finish...</p>
                </motion.div>
              ) : (
                <div className="flex items-end justify-center h-full w-full relative">
                  {game.players[0].hand.map((card, index) => {
                    const handSize = game.players[0].hand.length;
                    const centerIndex = (handSize - 1) / 2;
                    const relativeIndex = index - centerIndex;
                    
                    // Calculate rotation: -10 to +10 degrees
                    const rotation = relativeIndex * (20 / Math.max(handSize - 1, 1));
                    
                    // Calculate Y offset for the arc: subtle parabolic curve
                    const yOffset = Math.pow(Math.abs(relativeIndex), 2) * (handSize > 10 ? 1 : 2);
                    
                    // Calculate overlap class based on hand size to ensure they fit on screen
                    let overlap = '-ml-[12vw] sm:-ml-8'; // Default
                    if (handSize > 5) overlap = '-ml-[18vw] sm:-ml-12';
                    if (handSize > 10) overlap = '-ml-[22vw] sm:-ml-16';
                    if (handSize > 15) overlap = '-ml-[25vw] sm:-ml-20';
                    if (handSize > 20) overlap = '-ml-[28vw] sm:-ml-24';

                    return (
                      <motion.div
                        key={card.id}
                        layoutId={card.id}
                        initial={{ y: 100, opacity: 0, rotate: 0 }}
                        animate={{ 
                          y: yOffset, 
                          rotate: rotation,
                          opacity: 1, 
                          scale: 1 
                        }}
                        exit={{ y: -100, opacity: 0, scale: 0.5 }}
                        whileHover={{ 
                          y: yOffset - 30, 
                          scale: 1.1, 
                          zIndex: 100,
                          rotate: 0,
                          transition: { duration: 0.2 }
                        }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 260, 
                          damping: 20,
                          delay: index * 0.01 
                        }}
                        className={`relative group ${overlap} first:ml-0 transition-shadow h-[20vh] min-h-[120px] max-h-[350px] aspect-[2.5/3.5] origin-bottom`}
                      >
                        <SpiderCard 
                          card={card} 
                          className="w-full h-full"
                          mode={game.mode}
                          onClick={() => handlePlayerPlay(card)}
                          disabled={game.currentPlayerIndex !== 0}
                          isInvalid={invalidCardId === card.id}
                          isDarkSide={game.isDarkSide}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Wild Color Picker */}
      <AnimatePresence>
        {isWildPicking && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
          >
            <div className="max-w-md w-full space-y-6 sm:space-y-8 text-center">
              <h2 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter">Choose a Color</h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => {
                      playCard(isWildPicking.card, color);
                      setIsWildPicking(null);
                    }}
                    className={`h-20 sm:h-24 rounded-xl sm:rounded-2xl border-2 border-white/10 flex items-center justify-center text-lg sm:text-xl font-black uppercase tracking-widest transition-all hover:scale-105 ${
                      color === 'Red' ? 'bg-red-600 hover:shadow-red-500/40' :
                      color === 'Blue' ? 'bg-blue-600 hover:shadow-blue-500/40' :
                      color === 'Green' ? 'bg-emerald-600 hover:shadow-emerald-500/40' :
                      'bg-amber-500 text-amber-950 hover:shadow-amber-500/40'
                    } shadow-lg`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pause Menu Overlay */}
      <AnimatePresence>
        {isPaused && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6"
          >
            <div className="text-center space-y-8 sm:space-y-12 max-w-sm w-full">
              <div className="space-y-3 sm:space-y-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-red-600/40 rotate-12">
                  <Pause className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h2 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tighter">Paused</h2>
                <p className="text-zinc-400 font-mono uppercase tracking-widest text-[10px] sm:text-xs">The Nexus is Frozen</p>
              </div>

              <div className="flex flex-col space-y-3 sm:space-y-4">
                <button 
                  onClick={() => {
                    playSfx('click');
                    setIsPaused(false);
                  }}
                  className="group relative px-8 py-4 sm:px-12 sm:py-5 bg-white text-black font-black uppercase tracking-widest rounded-xl sm:rounded-2xl hover:bg-red-600 hover:text-white transition-all transform hover:scale-105 flex items-center justify-center space-x-2 sm:space-x-3 shadow-2xl shadow-white/10 text-sm sm:text-base"
                >
                  <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Resume Game</span>
                </button>

                <button 
                  onClick={() => {
                    playSfx('click');
                    setIsPaused(false);
                    initGame(game.mode, game.players.length, game.difficulty);
                  }}
                  className="px-8 py-4 sm:px-12 sm:py-5 bg-zinc-900 text-white font-black uppercase tracking-widest rounded-xl sm:rounded-2xl hover:bg-white hover:text-black transition-all transform hover:scale-105 flex items-center justify-center space-x-2 sm:space-x-3 border border-white/10 text-sm sm:text-base"
                >
                  <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Restart Match</span>
                </button>

                <button 
                  onClick={() => {
                    playSfx('click');
                    setIsPaused(false);
                    setView('menu');
                  }}
                  className="px-8 py-4 sm:px-12 sm:py-5 bg-zinc-900 text-white font-black uppercase tracking-widest rounded-xl sm:rounded-2xl hover:bg-white hover:text-black transition-all transform hover:scale-105 flex items-center justify-center space-x-2 sm:space-x-3 border border-white/10 text-sm sm:text-base"
                >
                  <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Main Menu</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Overlay (Leaderboard) */}
      <AnimatePresence>
        {game.isGameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto scrollbar-hide"
          >
            <div className="max-w-2xl w-full py-8 sm:py-12 space-y-8 sm:space-y-12">
              <div className="text-center space-y-3 sm:space-y-4">
                <div className="relative inline-block">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 blur-2xl sm:blur-3xl bg-red-500/30 rounded-full"
                  />
                  <Trophy className="w-20 h-20 sm:w-32 sm:h-32 text-yellow-500 relative z-10 mx-auto drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]" />
                </div>
                <h2 className="text-5xl sm:text-7xl font-black italic uppercase tracking-tighter leading-none">Leaderboard</h2>
                <p className="text-zinc-400 font-mono uppercase tracking-widest text-[10px] sm:text-sm">Final Standings // {game.mode}</p>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {game.finishedPlayers.map((playerId, index) => {
                  const player = game.players.find(p => p.id === playerId);
                  if (!player) return null;
                  
                  const isWinner = index === 0;
                  const isLoser = index === game.players.length - 1;
                  
                  return (
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      key={playerId}
                      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all gap-4 sm:gap-0 ${
                        isWinner ? 'bg-yellow-500/10 border-yellow-500/50 shadow-lg shadow-yellow-500/10' :
                        isLoser ? 'bg-red-500/10 border-red-500/50 grayscale opacity-60' :
                        'bg-zinc-900/50 border-white/5'
                      }`}
                    >
                      <div className="flex items-center space-x-3 sm:space-x-6 w-full sm:w-auto">
                        <div className={`w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl sm:rounded-2xl font-black text-lg sm:text-2xl shrink-0 ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-zinc-300 text-black' :
                          index === 2 ? 'bg-amber-700 text-white' :
                          'bg-zinc-800 text-zinc-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
                          <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl shrink-0 ${isWinner ? 'bg-yellow-500/20' : 'bg-zinc-800'}`}>
                            {player.isAI ? <Bot className="w-4 h-4 sm:w-6 sm:h-6" /> : <User className="w-4 h-4 sm:w-6 sm:h-6" />}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-base sm:text-xl font-black uppercase tracking-tight truncate">{player.name}</h3>
                            <p className="text-[8px] sm:text-[10px] font-mono opacity-40 uppercase tracking-widest truncate">
                              {isWinner ? 'Champion' : isLoser ? 'Loser' : `Ranked #${index + 1}`}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-left sm:text-right w-full sm:w-auto pl-[3.25rem] sm:pl-0">
                        <div className="text-[8px] sm:text-xs font-mono opacity-40 uppercase tracking-widest mb-0.5 sm:mb-1">Status</div>
                        <div className={`text-[10px] sm:text-sm font-black uppercase tracking-widest ${
                          isWinner ? 'text-yellow-500' : isLoser ? 'text-red-500' : 'text-zinc-400'
                        }`}>
                          {isWinner ? 'Ascended' : isLoser ? 'Eliminated' : 'Finished'}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 sm:pt-8">
                <button 
                  onClick={() => {
                    playSfx('click');
                    initGame(game.mode, game.players.length, game.difficulty);
                  }}
                  className="w-full sm:w-auto px-8 py-4 sm:px-12 sm:py-5 bg-white text-black font-black uppercase tracking-widest rounded-xl sm:rounded-2xl hover:bg-red-600 hover:text-white transition-all transform hover:scale-105 flex items-center justify-center space-x-2 sm:space-x-3 shadow-2xl shadow-white/10 text-sm sm:text-base"
                >
                  <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Play Again</span>
                </button>
                <button 
                  onClick={() => {
                    playSfx('click');
                    setView('menu');
                  }}
                  className="w-full sm:w-auto px-8 py-4 sm:px-12 sm:py-5 bg-zinc-900 text-white font-black uppercase tracking-widest rounded-xl sm:rounded-2xl hover:bg-white hover:text-black transition-all transform hover:scale-105 flex items-center justify-center space-x-2 sm:space-x-3 border border-white/10 text-sm sm:text-base"
                >
                  <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Exit to Menu</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logs */}
      <div className="fixed bottom-4 left-4 z-50 pointer-events-none">
        <div className="space-y-1">
          {game.logs.map((log, i) => (
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1 - i * 0.2, x: 0 }}
              key={i} 
              className="text-[10px] font-mono bg-black/60 backdrop-blur-sm px-3 py-1 rounded border border-white/5"
            >
              <span className="text-red-500 mr-2">#</span>
              {log}
            </motion.p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
