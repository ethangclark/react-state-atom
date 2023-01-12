import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ExampleApp } from '../example/ExampleApp';
import { createAtom, resetAtoms } from '../src';

describe('ExampleApp', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ExampleApp />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('atom', () => {
  it('reflects set value', () => {
    const a = createAtom(0);
    expect(a.get()).toBe(0);
    a.set(a.get() + 1);
    expect(a.get()).toBe(1);
    a.set(a.get() + 2);
    expect(a.get()).toBe(3);
  });
  it('calls subscription appropriately', () => {
    const a = createAtom(2);
    const mock1 = jest.fn();
    a.subscribe(mock1);
    a.set(3);
    expect(mock1).toHaveBeenCalledWith(3, 2);
    const mock2 = jest.fn();
    a.subscribe(mock2);
    a.set(4);
    expect(mock1).toHaveBeenCalledTimes(2);
    expect(mock1).toHaveBeenCalledWith(4, 3);
    expect(mock2).toHaveBeenCalledWith(4, 3);
  });
  it('unsubscribes', () => {
    const a = createAtom(2);
    const mock1 = jest.fn();
    const unsub = a.subscribe(mock1);
    a.set(3);
    expect(mock1).toHaveBeenCalledWith(3, 2);
    a.set(4);
    expect(mock1).toHaveBeenCalledTimes(2);
    unsub();
    a.set(5);
    expect(mock1).toHaveBeenCalledTimes(2);
  });
});

describe('resetAtoms', () => {
  it('resets all atoms', () => {
    const a = createAtom(2);
    const b = createAtom(3);
    a.set(4);
    b.set(5);
    resetAtoms();
    expect(a.get()).toBe(2);
    expect(b.get()).toBe(3);
  });
});
