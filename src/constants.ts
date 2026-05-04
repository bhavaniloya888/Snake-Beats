import { Song } from './types';

export const DUMMY_SONGS: Song[] = [
  {
    id: '1',
    title: 'Neon Dreams',
    artist: 'AI Synth-01',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&h=300&auto=format&fit=crop',
    color: '#ff00ff' // Neon Pink
  },
  {
    id: '2',
    title: 'Cyber Runner',
    artist: 'AI Pulse',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=300&h=300&auto=format&fit=crop',
    color: '#00ffff' // Neon Cyan
  },
  {
    id: '3',
    title: 'Midnight Grid',
    artist: 'AI Echo',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=300&h=300&auto=format&fit=crop',
    color: '#39ff14' // Neon Green
  }
];

export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 }
];
export const INITIAL_DIRECTION = { x: 0, y: -1 };
export const GAME_SPEED = 100;
