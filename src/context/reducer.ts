import {
  addProcess,
  error,
  interrupt,
  pause,
  play,
  StateSnapshot,
  tick,
} from 'types/GlobalState';
import { Action, ActionsTypes } from './actions';

export default function ReducerState(snapshot: StateSnapshot, action: Action) {
  switch (action.type) {
    case ActionsTypes.Continue:
      return play(snapshot);
    case ActionsTypes.Error:
      return error(snapshot);
    case ActionsTypes.Interrupt:
      return interrupt(snapshot);
    case ActionsTypes.New:
      return addProcess(snapshot);
    case ActionsTypes.Pause:
      return pause(snapshot);
    case ActionsTypes.Tick:
      return tick(snapshot);
    default:
      return snapshot;
  }
}
