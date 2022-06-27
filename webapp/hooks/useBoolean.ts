import { useCallback, useState } from 'react';

export default function useBoolean(defaultValue: boolean) {
  const [value, setValue] = useState(defaultValue);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, setTrue, setFalse] as [boolean, typeof setTrue, typeof setFalse];
}
