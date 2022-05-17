import { QUANTUM } from 'config/constants';
import { generateRandomProcess } from 'utils';
import {
  allocate, deallocate, hasSpace, MMU,
} from './MMU';
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
  mmu: MMU;
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

export function updateState(snapshot: StateSnapshot) {
  if (snapshot.state === State.Paused) return State.Paused;
  if (snapshot.ready.length || snapshot.blocked.length || snapshot.active) {
    return State.Active;
  }
  return State.Finished;
}

export function checkActiveProcess(snapshot: StateSnapshot): StateSnapshot {
  if (snapshot.ready.length === 0) return snapshot;
  if (snapshot.active) return snapshot;
  const newSnapshot = { ...snapshot };
  newSnapshot.active = start(newSnapshot.ready[0]);
  newSnapshot.ready = [...newSnapshot.ready.slice(1)];
  return newSnapshot;
}

export function checkProcesses(snapshot: StateSnapshot): StateSnapshot {
  let activeSnapshot = checkActiveProcess(snapshot);
  activeSnapshot.state = updateState(activeSnapshot);

  if (activeSnapshot.news.length === 0) return activeSnapshot;

  const nextReady = activeSnapshot.news.findIndex(
    (proc) => hasSpace(activeSnapshot.mmu, proc) !== undefined,
  );
  if (nextReady < 0) return activeSnapshot;

  const spaceIndex = hasSpace(
    activeSnapshot.mmu,
    activeSnapshot.news[nextReady],
  );
  if (spaceIndex === undefined) return activeSnapshot;

  const newSnapshot = { ...activeSnapshot };
  newSnapshot.mmu = allocate(
    newSnapshot.mmu,
    spaceIndex,
    newSnapshot.news[nextReady],
  );
  newSnapshot.ready = [
    ...newSnapshot.ready,
    ready(newSnapshot.news[nextReady]),
  ];
  newSnapshot.news = [
    ...newSnapshot.news.slice(0, nextReady),
    ...newSnapshot.news.slice(nextReady + 1),
  ];

  activeSnapshot = checkActiveProcess(newSnapshot);
  activeSnapshot.state = updateState(newSnapshot);
  return activeSnapshot;
}

export function addProcess(snapshot: StateSnapshot) {
  const index = nextIndex(snapshot);
  const process = generateRandomProcess(index, snapshot.time);
  const newSnapshot = {
    ...snapshot,
    news: [...snapshot.news, process],
  };

  return checkProcesses(newSnapshot);
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
      newSnapshot.mmu = deallocate(newSnapshot.mmu, newSnapshot.active);
      newSnapshot.finished = [...newSnapshot.finished, newSnapshot.active];
      newSnapshot.active = undefined;
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
      newSnapshot.ready.push(procCopy);
    });
    newSnapshot.blocked = stillBlocked;
  }

  return checkProcesses(newSnapshot);
}

export function error(state: StateSnapshot): StateSnapshot {
  if (!state.active) return state;
  const copy = { ...state };
  copy.active = processError(state.active);
  copy.mmu = deallocate(copy.mmu, copy.active);
  copy.finished = [...copy.finished, copy.active];
  copy.active = undefined;
  copy.quantum = 0;

  return checkProcesses(copy);
}

export function interrupt(state: StateSnapshot): StateSnapshot {
  if (!state.active) return state;
  const copy = { ...state };
  copy.active = processInterrupt(state.active);
  copy.blocked = [...copy.blocked, copy.active];
  copy.active = undefined;
  copy.quantum = 0;

  return checkProcesses(copy);
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
