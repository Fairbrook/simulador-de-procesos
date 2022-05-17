import { MEMORY_SIZE } from 'config/constants';
import React, { ReactElement, useMemo, useReducer } from 'react';
import { State, StateSnapshot } from 'types/GlobalState';
import { initMMU } from 'types/MMU';
import { Action } from './actions';
import StateReducer from './reducer';

interface ContextInterface {
  dispatch: React.Dispatch<Action>;
  state: StateSnapshot;
}

interface GlobalProviderProps {
  children: ReactElement;
}

const initialState: StateSnapshot = {
  news: [],
  blocked: [],
  finished: [],
  ready: [],
  state: State.Finished,
  time: 0,
  active: undefined,
  mmu: initMMU(MEMORY_SIZE),
  quantum: 0,
};

export const GlobalContext = React.createContext<ContextInterface>({
  dispatch: () => initialState,
  state: initialState,
});

export default function GlobalProvider({ children }: GlobalProviderProps) {
  const [state, dispatch] = useReducer(StateReducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
}
