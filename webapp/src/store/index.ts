import produce from 'immer';
import create, { GetState, SetState, StoreApi } from 'zustand';
import Reversi from '../lib/othello/Reversi';
import { TOTAL_CELL_COUNT } from '../lib/othelloConfig';

type AppState = {
  reversi: {
    dxy: number[][];
    piecesCount: number;
    enemyPiecesCount: number;
    isDone: boolean;
    isLoss: boolean;
    isDraw: boolean;
    depth: number;
    histories: string[];
    lastAction: number;
    passEnd: boolean;
    pieces: number[];
    enemyPieces: number[];
    resetPiecesCount: (c1?: number, c2?: number) => void;
    rState: Reversi;
    resetRState: (rState?: Reversi) => void;
  };
};

const useStore = create<AppState, SetState<AppState>, GetState<AppState>, StoreApi<AppState>>((set) => ({
  reversi: {
    dxy: [
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
      [0, -1],
      [1, -1],
    ],
    piecesCount: 2,
    enemyPiecesCount: 2,
    isDone: false,
    isLoss: false,
    isDraw: false,
    depth: 0,
    histories: [],
    lastAction: -1,
    passEnd: false,
    pieces: [],
    enemyPieces: [],
    resetPiecesCount: (c1, c2) =>
      set(
        produce((state: AppState) => {
          state.reversi.piecesCount = c1 ?? 0;
          state.reversi.enemyPiecesCount = c2 ?? 0;
        }),
      ),
    rState: new Reversi(),
    resetRState: (rState) =>
      set(
        produce((state: AppState) => {
          state.reversi.pieces = rState?.pieces ?? new Array(TOTAL_CELL_COUNT).fill(0);
          state.reversi.enemyPieces = rState?.enemyPieces ?? new Array(TOTAL_CELL_COUNT).fill(0);
          state.reversi.histories = rState?.histories ?? [];
          state.reversi.depth = rState?.depth ?? 0;
          state.reversi.lastAction = rState?.lastAction ?? -1;
          state.reversi.passEnd = false;
        }),
      ),
  },
}));

export default useStore;
