import React, { ReactElement, useReducer } from "react";
import { State, StateSnapshot } from "types/GlobalState";
import { Action } from "./actions";
import StateReducer from "./reducer";

interface ContextInterface {
  dispatch: React.Dispatch<Action>;
  state: StateSnapshot;
}

interface GlobalProviderProps {
  children: ReactElement;
}

const initialState: StateSnapshot = {
  blocked: [],
  finished: [],
  ready: [],
  state: State.Finished,
  time: 0,
  active: undefined,
};

export const GlobalContext = React.createContext<ContextInterface>({
  dispatch: () => initialState,
  state: initialState,
});

export default function GlobalProvider({ children }: GlobalProviderProps) {
  const [state, dispatch] = useReducer(StateReducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
}
