import client from '../client';

export default async function updateUserProfile({ name }: { name: string }) {
  const response = await client.put('/api/user/profile', { name });
  return response.data.payload;
}
