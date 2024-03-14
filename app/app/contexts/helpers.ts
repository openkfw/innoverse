'use client';
import { useEffect, useState } from 'react';

export function useSessionItem<T>(itemName: string) {
  const [value, setValue] = useState<T | undefined>();

  useEffect(() => {
    const itemValue = sessionStorage.getItem(itemName);
    const loadedValue = itemValue ? (JSON.parse(itemValue) as T) : undefined;
    setValue(loadedValue);
  }, [itemName]);

  const set = (value: T) => {
    sessionStorage.setItem(itemName, JSON.stringify(value));
    setValue(value);
  };

  const remove = () => {
    sessionStorage.removeItem(itemName);
    setValue(undefined);
  };

  return {
    value,
    set,
    remove,
  };
}
