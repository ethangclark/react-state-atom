import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createAtom, resetAtoms } from '../src/index';

const countAtom = createAtom(0);

const Counter1 = () => {
  const count = countAtom.use();
  return (
    <button onClick={() => countAtom.set(countAtom.get() + 1)}>
      Add 1 to {count}
    </button>
  );
};
const Counter2 = () => {
  const count = countAtom.use();
  return (
    <button onClick={() => countAtom.set(countAtom.get() + 2)}>
      Add 2 to {count}
    </button>
  );
};

const App = () => {
  const count = countAtom.use();
  const unsubscribeRef = React.useRef(() => {});
  return (
    <div
      style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}
    >
      <div>Count: {count}</div>
      <Counter1 />
      <Counter2 />
      <button onClick={countAtom.reset}>Reset</button>
      <button
        onClick={() => {
          unsubscribeRef.current();
          unsubscribeRef.current = countAtom.subscribe(console.log);
        }}
      >
        Subscribe
      </button>
      <button onClick={() => unsubscribeRef.current()}>Unsubscribe</button>
      <button onClick={resetAtoms}>Reset all</button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
