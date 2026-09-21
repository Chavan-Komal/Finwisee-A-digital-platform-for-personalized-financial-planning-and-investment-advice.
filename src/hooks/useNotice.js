import { useCallback, useEffect, useRef, useState } from 'react';

/** A short-lived toast message: notify('Saved'), notify('Failed', 'error') */
export const useNotice = () => {
  const [notice, setNotice] = useState(null);
  const timer = useRef();

  const notify = useCallback((message, type = 'success') => {
    clearTimeout(timer.current);
    setNotice({ message, type });
    timer.current = setTimeout(() => setNotice(null), 3500);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return { notice, notify };
};
