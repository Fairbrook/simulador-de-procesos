import { Process, State as ProcessState } from "./Process";

export enum State {
  Active,
  Paused,
  Finished,
}

export class GlobalState {
  private processes: Array<Process> = [];
  private blocked: Array<Process> = [];
  private current = 0;
  public seconds = 0;
  public state = State.Active;

  public addProcess(process: Process) {
    this.processes.push(process);
  }

  public tick() {
    this.processes.forEach((proc) => proc.tick());
    if (
      this.processes.length &&
      this.processes[this.current].state === ProcessState.Finished
    ) {
      this.current += 1;
    }
    const still_blocked: Array<Process> = [];
    this.blocked.forEach((proc) => {
      proc.tick();
      if (proc.state === ProcessState.Ready) {
        still_blocked.push(proc);
      }
      this.processes.push(proc);
    });
    this.blocked = still_blocked;
  }
}
