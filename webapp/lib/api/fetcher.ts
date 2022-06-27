import client from './client';

const fetcher = (url: string, isPaginated = false) => {
  if (isPaginated) {
    return client.get(url).then((res) => res.data.payload.data);
  }

  return client.get(url).then((res) => res.data.payload);
};

export default fetcher;
