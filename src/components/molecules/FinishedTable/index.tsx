import TableRow from 'components/atoms/TableRow';
import { formatOperation } from 'types/Operation';
import { Process, State } from 'types/Process';
import { fixNumber } from 'utils';

export interface TableProps {
  data: Process[];
  className?: string;
}
export default function FinishedTable({ data, className }: TableProps) {
  return (
    <div className={className}>
      <h1 className="text-lg text-blue-200 text-left mb-4">
        Procesos Terminados
      </h1>

      <TableRow className="border-b-2">
        <h2 className="font-bold">PID</h2>
        <h2 className="font-bold">Operación</h2>
        <h2 className="font-bold">Resultado</h2>
      </TableRow>
      <div>
        {data.map((proc) => (
          <TableRow key={proc.PID}>
            <div>{proc.PID}</div>
            <div>{formatOperation(proc.operation)}</div>
            <div className="text-left">
              {proc.state === State.Error
                ? 'Error'
                : fixNumber(proc.operation.result || 0)}
            </div>
          </TableRow>
        ))}
      </div>
    </div>
  );
}
