import othelloClient from '../othelloClient';

export type TState = {
  action: number;
  depth: number;
  is_done: boolean;
  is_draw: boolean;
  is_loss: boolean;
  pass_end: boolean;
  pieces: number[];
  pieces_count: number;
  enemy_pieces: number[];
  enemy_pieces_count: number;
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
