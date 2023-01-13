import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ExampleApp } from '../example/ExampleApp';
import { createAtom, resetGlobalState } from '../src';

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
    expect(a.getValue()).toBe(0);
    a.setValue(a.getValue() + 1);
    expect(a.getValue()).toBe(1);
    a.setValue(a.getValue() + 2);
    expect(a.getValue()).toBe(3);
  });
  it('calls subscription appropriately', () => {
    const a = createAtom(2);
    const mock1 = jest.fn();
    a.subscribe(mock1);
    a.setValue(3);
    expect(mock1).toHaveBeenCalledWith(3, 2);
    const mock2 = jest.fn();
    a.subscribe(mock2);
    a.setValue(4);
    expect(mock1).toHaveBeenCalledTimes(2);
    expect(mock1).toHaveBeenCalledWith(4, 3);
    expect(mock2).toHaveBeenCalledWith(4, 3);
  });
  it('unsubscribes', () => {
    const a = createAtom(2);
    const mock1 = jest.fn();
    const unsub = a.subscribe(mock1);
    a.setValue(3);
    expect(mock1).toHaveBeenCalledWith(3, 2);
    a.setValue(4);
    expect(mock1).toHaveBeenCalledTimes(2);
    unsub();
    a.setValue(5);
    expect(mock1).toHaveBeenCalledTimes(2);
  });
});

describe('resetAtoms', () => {
  it('resets all atoms', () => {
    const a = createAtom(2);
    const b = createAtom(3);
    a.setValue(4);
    b.setValue(5);
    resetGlobalState();
    expect(a.getValue()).toBe(2);
    expect(b.getValue()).toBe(3);
  });
});
