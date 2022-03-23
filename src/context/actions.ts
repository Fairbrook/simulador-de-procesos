export enum ActionsTypes {
  New,
  Error,
  Interrupt,
  Pause,
  Continue,
  Tick,
}

export interface Action {
  type: ActionsTypes;
  [key: string]: string | number;
}

export const GlobalActions: { [key: string]: Action } = {
  tick: { type: ActionsTypes.Tick },
  new: { type: ActionsTypes.New },
  error: { type: ActionsTypes.Error },
  continue: { type: ActionsTypes.Continue },
  interrupt: { type: ActionsTypes.Interrupt },
  pause: { type: ActionsTypes.Pause },
};
