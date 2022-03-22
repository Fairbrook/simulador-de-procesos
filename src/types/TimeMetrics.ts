export type TimeMetrics = {
  arrival_time: number;
  finish_time: number | undefined;
  waiting_seconds: number | undefined;
  service_seconds: number;
  response_seconds: number | undefined;
  blocked_seconds: number;
  return_seconds: () => number | undefined;
  remaining_seconds: () => number;
};
