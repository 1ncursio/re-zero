import client from '../client';

const logout = async () => {
  await client.post('/auth/logout');
};

export default logout;
