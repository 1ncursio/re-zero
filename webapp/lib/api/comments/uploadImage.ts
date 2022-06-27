import client from '../client';

export default async function uploadImage(formData: FormData): Promise<string> {
  const response = await client.post('/api/posts/image', formData);
  return response.data.payload;
}
