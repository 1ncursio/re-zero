import produce from 'immer';
import Reversi from '../lib/othello/Reversi';
import { CELL_COUNT, TOTAL_CELL_COUNT } from '../lib/othelloConfig';
import { AppSlice, AppState } from './useStore';

export interface ReversiHistory {
  action: number;
  turn: Turn;
  elapsed: number;
  pieces: number[];
  enemyPieces: number[];
}

export type Turn = 'black' | 'white';

export interface ReversiSlice {
  reversi: {
    histories: ReversiHistory[];
    turn: Turn;
    lastActionTime: Date;
    addHistory: (reversi: Reversi, action: number) => void;
    undoHistory: () => void;
    redoHistory: () => void;
    clearHistory: () => void;
    resetLastActionTime: () => void;
    convertActionToNotation: (action: number) => string;
  };
}

const createReversiSlice: AppSlice<ReversiSlice> = (set, get) => ({
  reversi: {
    histories: [],
    turn: 'black',
    lastActionTime: new Date(),
    addHistory(reversi: Reversi, action: number) {
      const elapsed = new Date().getTime() - get().reversi.lastActionTime.getTime();
      get().reversi.resetLastActionTime();
      const history: ReversiHistory = {
        action,
        turn: reversi.isBlackTurn() ? 'black' : 'white',
        elapsed,
        pieces: [...reversi.pieces],
        enemyPieces: [...reversi.enemyPieces],
      };

      set(
        produce((state: AppState) => {
          state.reversi.histories.push(history);
        }),
      );
    },
    undoHistory() {},
    redoHistory() {},
    clearHistory() {
      set(
        produce((state: AppState) => {
          state.reversi.histories = [];
        }),
      );
    },
    resetLastActionTime() {
      set(
        produce((state: AppState) => {
          state.reversi.lastActionTime = new Date();
        }),
      );
    },
    convertActionToNotation(action: number) {
      if (action === TOTAL_CELL_COUNT) return '--';

      const row = String.fromCharCode((action % CELL_COUNT) + 65);
      const col = Math.floor(action / CELL_COUNT) + 1;
      return `${row}${col}`;
    },
  },
});

export default createReversiSlice;
