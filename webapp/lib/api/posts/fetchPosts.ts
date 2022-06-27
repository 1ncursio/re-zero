import client from '../client';

export default async function fetchPosts() {
  return client.get('/api/posts').then((res) => res.data.payload);
}
