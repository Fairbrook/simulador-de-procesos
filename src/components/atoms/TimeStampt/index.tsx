import { formatSeconds } from "utils";

export interface TimeStamptProps {
  seconds: number | undefined;
  className?: string;
}
export default function TimeStampt({ seconds, className }: TimeStamptProps) {
  return <span className={className}>{formatSeconds(seconds)}</span>;
}
