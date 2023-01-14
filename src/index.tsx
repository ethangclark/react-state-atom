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
    // using `() => state` instead of `state` in case `state` is a function
    const [hookState, setHookState] = React.useState(() => state);
    React.useEffect(() => {
      const unsubscribe = subscribe((value) => {
        // using `() => value` instead of `value` in case `value` is a function
        setHookState(() => value);
      });
      return unsubscribe;
    }, []);
    return hookState;
  }

  return { getValue, setValue, subscribe, useValue };
}

export function resetGlobalState() {
  resetters.forEach((reset) => reset());
}
