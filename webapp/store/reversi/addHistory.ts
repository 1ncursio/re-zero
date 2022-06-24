import Reversi from '../../lib/othello/Reversi';
import useStore from '../useStore';
import { ReversiHistory } from './slice';

export default function addHistory(reversi: Reversi, action: number) {
  const { lastTime } = useStore.getState().reversi;
  const currentTime = new Date().getTime();
  const elapsed = currentTime - lastTime;

  const history: ReversiHistory = {
    action,
    turn: reversi.isBlackTurn() ? 'black' : 'white',
    elapsed,
    pieces: [...reversi.pieces],
    enemyPieces: [...reversi.enemyPieces],
  };

  useStore.setState((state) => {
    state.reversi.lastTime = currentTime;
    state.reversi.histories.push(history);
  });
}
