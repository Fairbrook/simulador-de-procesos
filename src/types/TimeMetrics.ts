export type TimeMetrics = {
  arrival_time: number;
  finish_time: number | undefined;
  waiting_seconds: number;
  service_seconds: number;
  response_seconds: number | undefined;
  blocked_seconds: number;
};

export function calcReturnSeconds(metrics: TimeMetrics): number | undefined {
  if (!metrics.finish_time) return undefined;
  return metrics.finish_time - metrics.arrival_time;
}