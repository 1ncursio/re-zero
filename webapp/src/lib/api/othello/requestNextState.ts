import othelloClient from '../othelloClient';

export type TState = {
  action: number;
  is_done: boolean;
  is_draw: boolean;
  is_loss: boolean;
  pass_end: boolean;
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
  const response = await othelloClient.post('/next_state', {
    pieces,
    enemyPieces,
    depth,
  });
  return response.data.payload;
}
