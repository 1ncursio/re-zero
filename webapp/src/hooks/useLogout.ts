import { useCallback } from 'react';
import logout from '../lib/api/auth/logout';

const useLogout = () => {
  const handler = useCallback(async () => {
    await logout();
    (window as Window).location.href = '/';
  }, []);

  return handler;
};

export default useLogout;
