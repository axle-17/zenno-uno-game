export type CardColor = 'Red' | 'Blue' | 'Green' | 'Yellow' | 'Wild';
export type CardType = 'Number' | 'Skip' | 'Reverse' | 'DrawTwo' | 'Wild' | 'WildDrawFour';

export interface CardData {
  id: string;
  color: CardColor;
  type: CardType;
  value?: number; // 0-9 for Number type
  character?: string;
}

export interface Player {
  id: string;
  name: string;
  hand: CardData[];
  isAI: boolean;
  avatar: string;
}

export type GameMode = 
  | 'Classic' 
  | 'Speed' 
  | 'Chaos' 
  | 'Flip!' 
  | 'Revenge' 
  | 'Sudden Death' 
  | 'Card Flood' 
  | 'Dare!' 
  | 'Attack' 
  | 'Show Em No Mercy' 
  | 'Stacko' 
  | 'Spin' 
  | 'Splash' 
  | 'Minimalista' 
  | 'Party!' 
  | 'Remix' 
  | 'Power Grab' 
  | 'Wild Jackpot' 
  | 'Wild Twists' 
  | 'Triple Play' 
  | 'Ultimate Marvel' 
  | 'Mario' 
  | 'Jurassic World Dominion' 
  | 'Star Wars' 
  | 'DC' 
  | 'The Simpsons' 
  | 'Minions' 
  | 'Avengers';

export type Difficulty = 'Easy' | 'Normal' | 'Hard';

export interface QuizQuestion {
  question: string;
  options: [string, string];
  correctIndex: number;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  direction: 1 | -1;
  discardPile: CardData[];
  deck: CardData[];
  currentColor: CardColor;
  currentValue?: string; // Number or Type
  isGameOver: boolean;
  winner: string | null;
  finishedPlayers: string[]; // List of player IDs in order of finishing
  logs: string[];
  pendingDrawCount: number;
  unoCalled: boolean[]; // Index matches player index
  mode: GameMode;
  difficulty: Difficulty;
  isDarkSide?: boolean; // For Flip! mode
  activeDare?: string | null; // For Dare! mode
  isStealing?: boolean; // For Power Grab mode
  jackpotAmount?: number; // For Wild Jackpot mode
  activeChaosTask?: string | null; // For Chaos mode
  attackTarget?: string | null; // For Attack mode
  revengeBonus?: Record<string, boolean>; // For Revenge mode
  activeQuiz?: QuizQuestion | null; // For Theme Quiz Challenge
  activePartyMessage?: { text: string; lyric: string } | null; // For Party! mode
}
