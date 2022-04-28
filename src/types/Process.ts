import { calc, Operation } from './Operation';
import { TimeMetrics } from './TimeMetrics';

export enum State {
  Executing,
  Blocked,
  Ready,
  Finished,
  Error,
  New,
}
export const stateTostr = {
  [State.Executing]: 'En ejecución',
  [State.Blocked]: 'Bloqueado',
  [State.Ready]: 'Listo',
  [State.Finished]: 'Terminado',
  [State.Error]: 'Error',
  [State.New]: 'Nuevo',
};

export interface Process {
  metrics: TimeMetrics;
  state: State;
  PID: number;
  estimated: number;
  operation: Operation;
}

export function newProcess(
  PID: number,
  estimated: number,
  operation: Operation,
  current_time: number,
): Process {
  const metrics = {
    arrival_time: current_time,
    service_seconds: 0,
    blocked_seconds: 0,
    waiting_seconds: 0,
    finish_time: undefined,
    response_seconds: undefined,
  };
  return {
    metrics,
    state: State.New,
    PID,
    operation,
    estimated,
  };
}

export function calcCurrentTime(proc: Process) {
  return (
    proc.metrics.arrival_time
    + (proc.metrics.waiting_seconds || 0)
    + proc.metrics.service_seconds
    + proc.metrics.blocked_seconds
  );
}

export function tick(proc: Process): Process {
  if (proc.state === State.Error || proc.state === State.Finished) return proc;
  const copy = { ...proc };
  copy.metrics = { ...copy.metrics };

  if (copy.state === State.Ready) {
    copy.metrics.waiting_seconds = (copy.metrics.waiting_seconds || 0) + 1;
    return copy;
  }
  if (copy.state === State.Blocked) {
    copy.metrics.blocked_seconds += 1;
    if (copy.metrics.blocked_seconds % 10 === 0) {
      copy.state = State.Ready;
    }
    return copy;
  }
  if (copy.state === State.Executing) {
    copy.metrics.service_seconds += 1;
    if (copy.metrics.service_seconds >= copy.estimated) {
      copy.state = State.Finished;
      copy.metrics.finish_time = calcCurrentTime(proc);
      copy.operation = calc(copy.operation);
    }
    return copy;
  }
  return copy;
}

export function error(proc: Process): Process {
  const copy = { ...proc };
  copy.state = State.Error;
  copy.metrics.finish_time = calcCurrentTime(copy);
  return copy;
}

export function interrupt(proc: Process): Process {
  const copy = { ...proc };
  copy.state = State.Blocked;
  return copy;
}

export function start(proc: Process): Process {
  const copy = { ...proc };
  copy.state = State.Executing;
  if (
    copy.metrics.service_seconds === 0
    && copy.metrics.blocked_seconds === 0
  ) {
    copy.metrics.response_seconds = copy.metrics.waiting_seconds;
  }
  return copy;
}

export function calcRemainingSeconds(proc: Process): number | undefined {
  if (proc.state === State.Error || proc.state === State.Finished) return undefined;
  return proc.estimated - proc.metrics.service_seconds;
}

export function calcRemainingBlocked(proc: Process) {
  if (proc.state !== State.Blocked) return undefined;
  const seconds = proc.metrics.blocked_seconds;
  return 10 - (seconds % 10);
}

export function ready(proc:Process):Process {
  return { ...proc, state: State.Ready };
}
