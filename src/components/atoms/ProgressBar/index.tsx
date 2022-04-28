export interface ProgressBarProps {
  percentage: number;
}
export default function ProgressBar({ percentage }: ProgressBarProps) {
  return (
    <div className="w-full bg-gray-100 h-7 rounded-md">
      <div
        className="bg-green-400 h-full rounded-md"
        style={{ width: `${percentage * 100}%` }}
      />
    </div>
  );
}
