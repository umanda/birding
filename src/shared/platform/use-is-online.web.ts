import { useEffect, useState } from 'react';

import { isOnline } from './is-online';

// Re-renders when the browser goes online or offline.
export function useIsOnline(): boolean {
  const [online, setOnline] = useState(isOnline);
  useEffect(() => {
    const update = (): void => setOnline(isOnline());
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);
  return online;
}
