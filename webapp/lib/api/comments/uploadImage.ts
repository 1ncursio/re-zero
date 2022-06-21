import { Comment } from '@typings/comment';
import client from '../client';

export default async function uploadImage(formData: FormData): Promise<Comment> {
  const response = await client.post('/api/posts/image', formData);
  return response.data.payload;
}
