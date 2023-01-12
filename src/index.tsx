import * as React from 'react';

const resetters: Array<Function> = [];

export function createAtom<T>(base: T): {
  get: () => T;
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

  resetters.push(() => set(base));

  function use() {
    // using `() => state` instead of `state` in case `state` is a function
    const [hookState, setHookState] = React.useState(() => state);
    React.useEffect(() => {
      const unsubscribe = subscribe((s) => {
        // using `() => s` instead of `s` in case `s` is a function
        setHookState(() => s);
      });
      return unsubscribe;
    }, []);
    return hookState;
  }

  return { get, set, subscribe, use };
}

export function resetAtoms() {
  resetters.forEach((reset) => reset());
}
