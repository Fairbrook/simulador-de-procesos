import TableRow from 'components/atoms/TableRow';
import TimeStampt from 'components/atoms/TimeStampt';
import { Process } from 'types/Process';

export interface TableProps {
  data: Process[];
  className?: string;
}
export default function NewsTable({ data, className }: TableProps) {
  return (
    <div className={className}>
      <h1 className="text-lg text-blue-200 text-left mb-4">
        Procesos Nuevos #
        {data.length}
      </h1>

      <TableRow className="border-b-2">
        <h2 className="font-bold">PID</h2>
        <h2 className="font-bold">Estimado</h2>
        <h2 className="font-bold">Espacio</h2>
      </TableRow>
      <div>
        {data.map((proc) => (
          <TableRow key={proc.PID}>
            <div>{proc.PID}</div>
            <TimeStampt seconds={proc.estimated} />
            <div>{proc.space}</div>
          </TableRow>
        ))}
      </div>
    </div>
  );
}
