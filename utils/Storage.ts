import { useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof localStorage === "undefined") return initialValue;

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (err) {
      console.error(err);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      // setState allows value to be a function
      //so that setState(increment) is basically
      // -> setState(increment(currentState))
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof localStorage !== "undefined")
        localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (err) {
      console.error(err);
    }
  };

  return [storedValue, setValue];
}
