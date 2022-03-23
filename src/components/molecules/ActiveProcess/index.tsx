import ProgressBar from "components/atoms/ProgressBar";
import TimeStampt from "components/atoms/TimeStampt";
import { formatOperation } from "types/Operation";
import { calcRemainingSeconds, Process } from "types/Process";


interface ActiveProcessProps {
  process?: Process;
  className?: string;
}
export default function ActiveProcess({
  process,
  className,
}: ActiveProcessProps) {
  if (!process) {
    return (
      <div className={className}>
        <h1 className="text-xl text-blue-200 text-center mb-4">
          No hay proceso activo
        </h1>
      </div>
    );
  }
  return (
    <div className={className}>
      <h1 className="text-xl text-blue-200 text-left mb-4">Proceso activo</h1>
      <div className="flex">
        <h2 className="text-left flex flex-1">
          <b className="w-32 block">PID: </b>
          <span>{process.PID}</span>
        </h2>
        <h2 className="text-left flex flex-1">
          <b className="w-32 block">Operación: </b>
          <span>{formatOperation(process.operation)}</span>
        </h2>
      </div>
      <div className="flex">
        <h2 className="text-left flex flex-1">
          <b className="w-32 block">Estimado: </b>
          <TimeStampt seconds={process.estimated} />
        </h2>
        <h2 className="text-left flex flex-1 mb-2">
          <b className="w-32 block">Restante: </b>
          <TimeStampt seconds={calcRemainingSeconds(process)} />
        </h2>
      </div>
      <ProgressBar
        percentage={process.metrics.service_seconds / process.estimated}
      />
    </div>
  );
}
