import * as React from 'react';

const resetters: Array<Function> = [];

export function createAtom<State extends { [key: string]: any }>(
  initial: State
): {
  get: () => State;
  reset: () => void;
  set: (state: State) => void;
  use: () => State;
  subscribe: (subFn: (state: State, previous: State) => void) => () => void;
} {
  let state = initial;

  const reset = () => {
    state = initial;
  };
  resetters.push(reset);

  const get = () => state;

  let subscribers = new Set<(state: State, previous: State) => void>();
  function subscribe(subscriber: (state: State, previous: State) => void) {
    subscribers.add(subscriber);
    return () => {
      subscribers.delete(subscriber);
    };
  }

  function set(s: State) {
    const previous = state;
    state = s;
    subscribers.forEach((subscriber) => subscriber(state, previous));
  }

  function use() {
    const [s, setS] = React.useState(state);
    React.useEffect(() => subscribe(setS), []);
    return s;
  }

  return { get, reset, set, use, subscribe };
}

export function resetAtoms() {
  resetters.forEach((reset) => reset());
}
