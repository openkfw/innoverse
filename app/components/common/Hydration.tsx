import { useEffect, useState } from 'react';

export default function useHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(
    function setHydration() {
      setHydrated(true);
    },
    [setHydrated],
  );

  return { hydrated };
}
