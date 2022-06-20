import client from '../client';

type CreateAIHistoryParams = {
  blackId: number;
  whiteId: null;
  status: 'black_win' | 'white_win' | 'draw';
};

export default async function createAIHistory({
  blackId,
  whiteId,
  status,
}: CreateAIHistoryParams): Promise<any> {
  const response = await client.post('/api/history/ai', {
    blackId,
    whiteId,
    status,
  });

  return response.data.payload;
}
