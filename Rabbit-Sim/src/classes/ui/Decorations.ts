import { type Sprite } from '../../canvas';

export interface Decoration {
    x: number;
    y: number;
    sprites: Sprite[];
}


export const TreeSprite: Sprite[] = [
  { x: 3, y: 0, color: '#0D3B12' },
  { x: 2, y: 1, color: '#14561C' },
  { x: 3, y: 1, color: '#14561C' },
  { x: 4, y: 1, color: '#14561C' },
  { x: 3, y: 2, color: '#0D3B12' },
  { x: 2, y: 2, color: '#14561C' },
  { x: 4, y: 2, color: '#14561C' },
  { x: 3, y: 3, color: '#603d1da9' },
  { x: 3, y: 4, color: '#603d1da9' },
];

export const RockSprite: Sprite[] = [
  { x: 1, y: 0, color: '#6f665dff' },
  { x: 0, y: 0, color: '#5c5752ff' },
];

export const BurrowSprite: Sprite[] = [
  { x: 0, y: 0, color: '#29231eff' },
  { x: 0, y: 1, color: '#29231eff' },
  { x: 1, y: 1, color: '#3b3429ff' },
  { x: -1, y: 1, color: '#29231eff' },
    
  { x: 1, y: 0, color: '#b39667ff' },
  { x: 2, y: 1, color: '#8c6f42ff' },
  { x: 2, y: 0, color: '#b29b76ff' },
  { x: 3, y: 1, color: '#c4a77bff' }
];