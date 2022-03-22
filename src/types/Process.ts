import { Operation } from "./Operation";
import { TimeMetrics } from "./TimeMetrics";

export enum State {
  Executing,
  Blocked,
  Ready,
  Finished,
  Error,
}

export class Process {
  public metrics: TimeMetrics;
  public state: State = State.Ready;

  constructor(
    public PID: number,
    public estimated: number,
    public operation: Operation,
    current_time: number
  ) {
    this.metrics = {
      arrival_time: current_time,
      service_seconds: 0,
      blocked_seconds: 0,
      finish_time: undefined,
      waiting_seconds: undefined,
      response_seconds: undefined,
      return_seconds: () =>
        typeof this.metrics.finish_time === "number"
          ? this.metrics.finish_time - this.metrics.arrival_time
          : undefined,
      remaining_seconds: () => this.estimated - this.metrics.service_seconds,
    };
  }

  calcCurrentTime() {
    return (
      this.metrics.arrival_time +
      (this.metrics.waiting_seconds || 0) +
      this.metrics.service_seconds +
      this.metrics.blocked_seconds
    );
  }

  public tick() {
    if (this.state === State.Error || this.state === State.Finished) return;
    if (this.state === State.Ready) {
      this.metrics.waiting_seconds = (this.metrics.waiting_seconds || 0) + 1;
      return;
    }
    if (this.state === State.Blocked) {
      this.metrics.blocked_seconds += 1;
      if (this.metrics.blocked_seconds % 10 === 0) {
        this.state = State.Ready;
      }
      return;
    }
    if (this.state === State.Executing) {
      this.metrics.service_seconds += 1;
      if (this.metrics.service_seconds >= this.estimated) {
        this.state = State.Finished;
        this.metrics.finish_time = this.calcCurrentTime();
        this.operation.calc();
      }
      return;
    }
  }

  public error() {
    this.state = State.Error;
    this.metrics.finish_time = this.calcCurrentTime();
  }

  public interrupt() {
    this.state = State.Blocked;
  }

  public start() {
    this.state = State.Executing;
    if (
      this.metrics.service_seconds === 0 &&
      this.metrics.blocked_seconds === 0
    ) {
      this.metrics.response_seconds = this.metrics.waiting_seconds;
    }
  }
}
