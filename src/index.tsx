import * as React from 'react';

const resetters: Array<Function> = [];

export function createAtom<T>(base: T): {
  get: () => T;
  reset: () => void;
  set: (state: T) => void;
  subscribe: (subFn: (state: T, prev: T) => void) => () => void;
  use: () => T;
} {
  let state = base;

  const get = () => state;

  let subscribers = new Set<(state: T, prev: T) => void>();
  function subscribe(subscriber: (state: T, prev: T) => void) {
    subscribers.add(subscriber);
    return () => {
      subscribers.delete(subscriber);
    };
  }

  function set(s: T) {
    const prev = state;
    state = s;
    subscribers.forEach((subscriber) => subscriber(state, prev));
  }

  const reset = () => set(base);
  resetters.push(reset);

  function use() {
    const [s, setS] = React.useState(state);
    React.useEffect(() => subscribe(setS), []);
    return s;
  }

  return { get, reset, set, subscribe, use };
}

export function resetAtoms() {
  resetters.forEach((reset) => reset());
}