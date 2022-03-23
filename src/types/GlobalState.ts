import { generateRandomProcess } from "utils";
import {
  Process,
  start,
  State as ProcessState,
  tick as tickProcess,
  error as processError,
  interrupt as processInterrupt,
} from "./Process";

export enum State {
  Active,
  Paused,
  Finished,
}

export const stateToStr = {
  [State.Active]: "Procesando",
  [State.Paused]: "Pausado",
  [State.Finished]: "Terminado",
};

export interface StateSnapshot {
  ready: Process[];
  finished: Process[];
  blocked: Process[];
  active: Process | undefined;
  time: number;
  state: State;
}

export function addProcess(snapshot: StateSnapshot) {
  const nextIndex =
    snapshot.finished.length +
    snapshot.ready.length +
    snapshot.blocked.length +
    (snapshot.active ? 1 : 0) +
    1;
  const process = generateRandomProcess(nextIndex, snapshot.time);
  const newSnapshot = {
    ...snapshot,
  };
  if (!newSnapshot.active) {
    newSnapshot.active = start(process);
    return newSnapshot;
  }
  return {
    ...snapshot,
    state: State.Active,
    ready: [...snapshot.ready, process],
  };
}

export function updateState(snapshot: StateSnapshot) {
  if (snapshot.state === State.Paused) return State.Paused;
  if (snapshot.ready.length || snapshot.blocked.length || snapshot.active) {
    return State.Active;
  }
  return State.Finished;
}

export function tick(snapshot: StateSnapshot): StateSnapshot {
  if (snapshot.state === State.Paused) return snapshot;
  const newSnapshot = {
    ...snapshot,
  };
  newSnapshot.time += 1;
  newSnapshot.ready = newSnapshot.ready.map((proc) => tickProcess(proc));
  if (newSnapshot.active) {
    newSnapshot.active = tickProcess(newSnapshot.active);
    if (newSnapshot.active.state === ProcessState.Finished) {
      newSnapshot.finished = [...newSnapshot.finished, newSnapshot.active];
      newSnapshot.active = undefined;
      if (newSnapshot.ready.length) {
        newSnapshot.active = start(newSnapshot.ready[0]);
        newSnapshot.ready.splice(0, 1);
      }
    }
  }

  if (newSnapshot.blocked.length) {
    const still_blocked: Array<Process> = [];
    newSnapshot.blocked.forEach((proc) => {
      const _proc = tickProcess(proc);
      if (_proc.state === ProcessState.Blocked) {
        still_blocked.push(_proc);
        return;
      }
      if (!newSnapshot.active) {
        newSnapshot.active = start(_proc);
        return;
      }
      newSnapshot.ready.push(_proc);
    });
    newSnapshot.blocked = still_blocked;
  }

  newSnapshot.state = updateState(newSnapshot);
  return newSnapshot;
}

export function error(state: StateSnapshot): StateSnapshot {
  if (!state.active) return state;
  const _copy = { ...state };
  _copy.active = processError(state.active);
  _copy.finished = [..._copy.finished, _copy.active];
  _copy.active = undefined;
  if (_copy.ready.length) {
    _copy.active = start(_copy.ready[0]);
    _copy.ready = _copy.ready.slice(1);
  }
  return _copy;
}

export function interrupt(state: StateSnapshot): StateSnapshot {
  if (!state.active) return state;
  const _copy = { ...state };
  _copy.active = processInterrupt(state.active);
  _copy.blocked = [..._copy.blocked, _copy.active];
  _copy.active = undefined;
  if (_copy.ready.length) {
    _copy.active = start(_copy.ready[0]);
    _copy.ready = _copy.ready.slice(1);
  }
  return _copy;
}

export function pause(snapshot: StateSnapshot) {
  return {
    ...snapshot,
    state: State.Paused,
  };
}

export function play(snapshot: StateSnapshot) {
  return {
    ...snapshot,
    state: State.Active,
  };
}


// export function run() {
//   this.state = State.Active;
// }
