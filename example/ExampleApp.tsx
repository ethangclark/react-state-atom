import * as React from 'react';
import { createAtom, resetGlobalState } from '../src/index';

const countAtom = createAtom(0);

const Counter1 = () => {
  const count = countAtom.useValue();
  return (
    <button onClick={() => countAtom.setValue(countAtom.getValue() + 1)}>
      Add 1 to {count}
    </button>
  );
};
const Counter2 = () => {
  const count = countAtom.useValue();
  return (
    <button onClick={() => countAtom.setValue(countAtom.getValue() + 2)}>
      Add 2 to {count}
    </button>
  );
};

export const ExampleApp = () => {
  const count = countAtom.useValue();
  const unsubscribeRef = React.useRef(() => {});
  return (
    <div
      style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}
    >
      <div>Count: {count}</div>
      <Counter1 />
      <Counter2 />
      <button
        onClick={() => {
          unsubscribeRef.current();
          unsubscribeRef.current = countAtom.subscribe(console.log);
        }}
      >
        Subscribe
      </button>
      <button onClick={() => unsubscribeRef.current()}>Unsubscribe</button>
      <button onClick={resetGlobalState}>Reset</button>
    </div>
  );
};
