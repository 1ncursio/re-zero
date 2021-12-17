import produce from 'immer';
import create from 'zustand';
import Reversi from '../lib/othello/Reversi';

type AppState = {
  reversi: {
    piecesCount: number;
    enemyPiecesCount: number;
    resetPiecesCount: (c1?: number, c2?: number) => void;
    rState: Reversi;
    resetRState: (rState?: Reversi) => void;
  };
};

const useStore = create<AppState>((set) => ({
  reversi: {
    piecesCount: 2,
    enemyPiecesCount: 2,
    resetPiecesCount: (c1, c2) =>
      set(
        produce((state: AppState) => {
          state.reversi.piecesCount = c1 ?? 0;
          state.reversi.enemyPiecesCount = c2 ?? 0;
        }),
      ),
    rState: new Reversi(),
    resetRState: (rState) =>
      set((state: AppState) => ({
        // if (rState) {
        //   state.reversi.rState = rState;
        // } else {
        //   state.reversi.rState = new Reversi();
        // }
        //   console.log({ next: rState });
        //   state.reversi.rState = rState ?? new Reversi();
        //   console.log({ next2: state.reversi.rState });
        ...state,
        reversi: {
          ...state.reversi,
          rState: rState ?? new Reversi(),
        },
      })),
  },
}));

export default useStore;
