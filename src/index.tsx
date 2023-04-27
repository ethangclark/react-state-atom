import * as React from 'react';

const resetters: Array<Function> = [];

export function atom<T>(initial: T): {
  getValue: () => T;
  setValue: (value: T) => void;
  subscribe: (subFn: (value: T, prev: T) => void) => () => void;
  useValue: () => T;
} {
  let state = initial;

  const getValue = () => state;

  let subscribers = new Set<(state: T, prev: T) => void>();
  function subscribe(subscriber: (value: T, prev: T) => void) {
    subscribers.add(subscriber);
    return () => {
      subscribers.delete(subscriber);
    };
  }

  function setValue(value: T) {
    const prev = state;
    state = value;
    subscribers.forEach((subscriber) => subscriber(state, prev));
  }

  resetters.push(() => setValue(initial));

  function useValue() {
    const [, setRerender] = React.useState(1);
    React.useEffect(() => {
      const unsubscribe = subscribe(() => {
        setRerender((prev) => prev + 1);
      });
      return unsubscribe;
    }, []);
    return state;
  }

  return { getValue, setValue, subscribe, useValue };
}

export function resetGlobalState() {
  resetters.forEach((reset) => reset());
}
