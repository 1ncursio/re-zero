import { StateCreator } from 'zustand';
import { AppState, Mis } from '../useStore';

export interface ReversiHistory {
  action: number;
  turn: Turn;
  elapsed: number;
  pieces: number[];
  enemyPieces: number[];
}

export type Turn = 'black' | 'white';

export type ReversiSlice = {
  reversi: {
    histories: ReversiHistory[];
    turn: Turn;
    lastTime: number;
    // undoHistory: () => void;
    // redoHistory: () => void;
  };
};

//define the initial state
export const initialReversiState: ReversiSlice = {
  reversi: {
    histories: [],
    turn: 'black',
    lastTime: new Date().getTime(),
  },
};

const createReversiSlice: StateCreator<AppState, Mis, [], ReversiSlice> = (...args) => ({
  ...initialReversiState,
});

export default createReversiSlice;
