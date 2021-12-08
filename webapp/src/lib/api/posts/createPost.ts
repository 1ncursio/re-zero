import { Post } from '../../../typings/post';
import client from '../client';

export default async function createPost({
  content,
  title,
}: {
  content: string;
  title: string;
}): Promise<Post> {
  const response = await client.post('/api/posts', {
    content,
    title,
  });
  return response.data.payload;
}
