import TableRow from "components/atoms/TableRow";
import TimeStampt from "components/atoms/TimeStampt";
import { Process } from "types/Process";

export interface TableProps {
  data: Process[];
  className?: string;
}
export default function BlockedTable({ data, className }: TableProps) {
  return (
    <div className={className}>
      <h1 className="text-lg text-blue-200 text-left mb-4">
        Procesos bloqueados
      </h1>
      <TableRow className="border-b-2">
        <h2 className="font-bold">PID</h2>
        <h2 className="font-bold">Tiempo</h2>
      </TableRow>
      <div>
        {data.map((proc) => (
          <TableRow key={proc.PID}>
            <div>{proc.PID}</div>
            <TimeStampt seconds={proc.metrics.blocked_seconds}></TimeStampt>
          </TableRow>
        ))}
      </div>
    </div>
  );
}
