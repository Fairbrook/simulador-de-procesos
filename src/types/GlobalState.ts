import { MAX_MEMORY_PROC, QUANTUM } from 'config/constants';
import { generateRandomProcess } from 'utils';
import {
  Process,
  start,
  State as ProcessState,
  tick as tickProcess,
  error as processError,
  interrupt as processInterrupt,
  ready,
} from './Process';

export enum State {
  Active,
  Paused,
  Finished,
}

export const stateToStr = {
  [State.Active]: 'Procesando',
  [State.Paused]: 'Pausado',
  [State.Finished]: 'Terminado',
};

export interface StateSnapshot {
  news: Process[];
  ready: Process[];
  finished: Process[];
  blocked: Process[];
  active: Process | undefined;
  time: number;
  state: State;
  quantum: number;
}

function nextIndex(snapshot: StateSnapshot) {
  return (
    snapshot.finished.length
    + snapshot.ready.length
    + snapshot.blocked.length
    + snapshot.news.length
    + (snapshot.active ? 1 : 0)
    + 1
  );
}

function procInMemory(snapshot: StateSnapshot) {
  return (
    (snapshot.active ? 1 : 0) + snapshot.ready.length + snapshot.blocked.length
  );
}

export function addProcess(snapshot: StateSnapshot) {
  const index = nextIndex(snapshot);
  const process = generateRandomProcess(index, snapshot.time);
  const newSnapshot = {
    ...snapshot,
  };

  if (!newSnapshot.active) {
    newSnapshot.active = start(process);
    return newSnapshot;
  }

  if (procInMemory(snapshot) < MAX_MEMORY_PROC) {
    newSnapshot.ready = [...newSnapshot.ready, ready(process)];
    return newSnapshot;
  }

  return {
    ...snapshot,
    state: State.Active,
    news: [...snapshot.news, process],
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
  newSnapshot.quantum += 1;
  newSnapshot.news = newSnapshot.news.map((proc) => tickProcess(proc));
  newSnapshot.ready = newSnapshot.ready.map((proc) => tickProcess(proc));

  if (newSnapshot.active) {
    if (newSnapshot.quantum > QUANTUM) {
      if (newSnapshot.ready.length) {
        newSnapshot.ready.push(ready(newSnapshot.active));
        newSnapshot.active = start(newSnapshot.ready[0]);
        newSnapshot.ready.splice(0, 1);
      }
      newSnapshot.quantum = 0;
    }

    newSnapshot.active = tickProcess(newSnapshot.active);

    if (newSnapshot.active.state === ProcessState.Finished) {
      newSnapshot.finished = [...newSnapshot.finished, newSnapshot.active];
      newSnapshot.active = undefined;
      if (newSnapshot.ready.length) {
        newSnapshot.active = start(newSnapshot.ready[0]);
        newSnapshot.ready.splice(0, 1);
      }
      newSnapshot.quantum = 0;
    }
  }

  if (newSnapshot.blocked.length) {
    const stillBlocked: Array<Process> = [];
    newSnapshot.blocked.forEach((proc) => {
      const procCopy = tickProcess(proc);
      if (procCopy.state === ProcessState.Blocked) {
        stillBlocked.push(procCopy);
        return;
      }
      if (!newSnapshot.active) {
        newSnapshot.active = start(procCopy);
        return;
      }
      newSnapshot.ready.push(procCopy);
    });
    newSnapshot.blocked = stillBlocked;
  }

  if (newSnapshot.news.length && procInMemory(newSnapshot) < MAX_MEMORY_PROC) {
    newSnapshot.ready.push(ready(newSnapshot.news[0]));
    newSnapshot.news = newSnapshot.news.slice(1);
  }

  newSnapshot.state = updateState(newSnapshot);
  return newSnapshot;
}

export function error(state: StateSnapshot): StateSnapshot {
  if (!state.active) return state;
  const copy = { ...state };
  copy.active = processError(state.active);
  copy.finished = [...copy.finished, copy.active];
  copy.active = undefined;
  copy.quantum = 0;
  if (copy.ready.length) {
    copy.active = start(copy.ready[0]);
    copy.ready = copy.ready.slice(1);
  }
  if (copy.news.length && procInMemory(copy) < MAX_MEMORY_PROC) {
    copy.ready = [...copy.ready, ready(copy.news[0])];
    copy.news = copy.news.slice(1);
  }
  return copy;
}

export function interrupt(state: StateSnapshot): StateSnapshot {
  if (!state.active) return state;
  const copy = { ...state };
  copy.quantum = 0;
  copy.active = processInterrupt(state.active);
  copy.blocked = [...copy.blocked, copy.active];
  copy.active = undefined;
  if (copy.ready.length) {
    copy.active = start(copy.ready[0]);
    copy.ready = copy.ready.slice(1);
  }
  return copy;
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
