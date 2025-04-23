import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { createAppState } from '../src/createAppState';

interface CounterState {
  count: number;
  timestamp: number;
}

const initialValue: CounterState = { count: 0, timestamp: Date.now() };

describe('createAppState', () => {
  const {
    Provider,
    useAppState,
    Consumer,
  } = createAppState<CounterState>(initialValue);

  const TestComponent = () => {
    const { state, dispatch } = useAppState();
    return (
      <div>
        <span data-testid="count">{state.count}</span>
        <button onClick={() => dispatch(s => ({ ...s, count: s.count + 1 }))}>
          Increment
        </button>
      </div>
    );
  };

  test('renders initial state and dispatches update', () => {
    render(
      <Provider>
        <TestComponent />
      </Provider>
    );

    expect(screen.getByTestId('count')).toHaveTextContent('0');

    fireEvent.click(screen.getByText('Increment'));

    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  test('Consumer works properly', () => {
    render(
      <Provider>
        <Consumer>
          {({ state }) => (
            <div data-testid="consumer">{state.count}</div>
          )}
        </Consumer>
      </Provider>
    );

    expect(screen.getByTestId('consumer')).toHaveTextContent('0');
  });
});
