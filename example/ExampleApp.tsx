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

const otherValueAtom = createAtom(9900);

const HybridState = ({ onRender }: { onRender: Function }) => {
  const count = countAtom.useValue();
  const otherValue = otherValueAtom.useValue();

  onRender();

  return (
    <button
      onClick={() => otherValueAtom.setValue(otherValueAtom.getValue() + 1)}
    >
      {count}/{otherValue} (click to increment latter)
    </button>
  );
};

export const ExampleApp = ({
  onValue = console.log,
  onCounterRender = () => {},
  onHybridStateRender = () => {},
}: {
  onValue?: (value: number, prev: number) => void;
  onCounterRender?: Function;
  onHybridStateRender?: Function;
}) => {
  const count = countAtom.useValue();
  const unsubscribeRef = React.useRef(() => {});

  onCounterRender();

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
          unsubscribeRef.current = countAtom.subscribe(onValue);
        }}
      >
        Subscribe
      </button>
      <button onClick={() => unsubscribeRef.current()}>Unsubscribe</button>
      <button onClick={resetGlobalState}>Reset</button>
      <HybridState onRender={onHybridStateRender} />
    </div>
  );
};
