import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExampleApp } from '../example/ExampleApp';
import { createAtom, resetGlobalState } from '../src';

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

describe('ExampleApp (hooks use example)', () => {
  beforeEach(() => {
    resetGlobalState();
  });
  it('renders without crashing', () => {
    render(<ExampleApp />);
  });
  it('updates and resets states across components', async () => {
    render(<ExampleApp />);
    await screen.findByText('Count: 0');
    await userEvent.click(screen.getByText('Add 1 to 0'));
    await screen.findByText('Count: 1');
    await userEvent.click(screen.getByText('Add 2 to 1'));
    await screen.findByText('Count: 3');
    await userEvent.click(screen.getByText('Reset'));
    await screen.findByText('Count: 0');
  });
  it('calls subscription and unsubscribes', async () => {
    const onValue = jest.fn();
    render(<ExampleApp onValue={onValue} />);
    await userEvent.click(screen.getByText('Add 1 to 0'));
    expect(onValue).not.toHaveBeenCalled();
    await userEvent.click(screen.getByText('Subscribe'));
    await userEvent.click(screen.getByText('Add 1 to 1'));
    expect(onValue).toHaveBeenCalledWith(2, 1);
    await userEvent.click(screen.getByText('Add 2 to 2'));
    expect(onValue).toHaveBeenCalledWith(4, 2);
    expect(onValue).toHaveBeenCalledTimes(2);
    await userEvent.click(screen.getByText('Unsubscribe'));
    await userEvent.click(screen.getByText('Add 2 to 4'));
    expect(onValue).toHaveBeenCalledTimes(2);
    await userEvent.click(screen.getByText('Subscribe'));
    await userEvent.click(screen.getByText('Add 2 to 6'));
    expect(onValue).toHaveBeenCalledTimes(3);
  });
  it('only rerenders necessary components', async () => {
    const onCounterRender = jest.fn();
    const onHybridStateRender = jest.fn();
    render(
      <ExampleApp
        onCounterRender={onCounterRender}
        onHybridStateRender={onHybridStateRender}
      />
    );
    expect(onCounterRender).toHaveBeenCalledTimes(1);
    expect(onHybridStateRender).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByText('Add 1 to 0'));
    expect(onCounterRender).toHaveBeenCalledTimes(2);
    expect(onHybridStateRender).toHaveBeenCalledTimes(2);
    await userEvent.click(
      screen.getByText('1/9900 (click to increment latter)')
    );
    expect(onCounterRender).toHaveBeenCalledTimes(2);
    expect(onHybridStateRender).toHaveBeenCalledTimes(3);
    await userEvent.click(screen.getByText('Add 2 to 1'));
    expect(onCounterRender).toHaveBeenCalledTimes(3);
    expect(onHybridStateRender).toHaveBeenCalledTimes(4);
    await await userEvent.click(
      screen.getByText('3/9901 (click to increment latter)')
    );
    expect(onHybridStateRender).toHaveBeenCalledTimes(5);
    await screen.findByText('3/9902 (click to increment latter)');
  });
});
