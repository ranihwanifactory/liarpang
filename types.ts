
export type GameStep = 'SETUP' | 'CATEGORY' | 'REVEAL' | 'PLAY' | 'VOTE' | 'RESULT' | 'LIAR_CHANCE';

export interface Player {
  id: string;
  name: string;
  role: 'CITIZEN' | 'LIAR';
  isRevealed: boolean;
  votes: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface GameState {
  step: GameStep;
  players: Player[];
  selectedCategory: Category | null;
  targetWord: string;
  liarId: string;
  currentPlayerIndex: number;
  winner: 'CITIZENS' | 'LIAR' | null;
  caughtLiarId: string | null;
}
