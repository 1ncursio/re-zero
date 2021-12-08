import othelloClient from '../othelloClient';

type TState = {
  action: number;
  depth: number;
  isDone: boolean;
  isDraw: boolean;
  isLoss: boolean;
  pieces: number[];
  enemyPieces: number[];
};

export default async function requestNextState({
  pieces,
  enemyPieces,
  depth,
}: {
  pieces: number[];
  enemyPieces: number[];
  depth: number;
}): Promise<TState> {
  const response = await othelloClient.post('/next_action', {
    pieces,
    enemyPieces,
    depth,
  });
  return response.data.payload;
}
