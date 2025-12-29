
import { Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'animals', name: '동물 친구들', icon: '🐶', color: 'bg-orange-400' },
  { id: 'food', name: '맛있는 음식', icon: '🍕', color: 'bg-red-400' },
  { id: 'school', name: '학교 물건', icon: '🎒', color: 'bg-blue-400' },
  { id: 'fruits', name: '달콤한 과일', icon: '🍓', color: 'bg-pink-400' },
  { id: 'places', name: '재미있는 장소', icon: '🎡', color: 'bg-green-400' },
  { id: 'sports', name: '신나는 운동', icon: '⚽', color: 'bg-yellow-400' },
];

export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 10;

export const THEME = {
  primary: '#FFD93D',
  secondary: '#FF8400',
  accent: '#4F709C',
  background: '#FFFBEB',
  card: '#FFFFFF',
};
