import { formatOperation } from "types/Operation";
import {
    calcRemainingBlocked,
  calcRemainingSeconds,
  Process,
  stateTostr,
} from "types/Process";
import { calcReturnSeconds } from "types/TimeMetrics";
import { fixNumber } from "utils";
import TimeStampt from "../TimeStampt";

export interface ProcessRowProps {
  process: Process;
}
export default function ProcessRow({ process }: ProcessRowProps) {
  return (
    <div className="my-4">
      <h1 className="text-lg font-bold">
        <u>
          {process.PID} | {stateTostr[process.state]}
        </u>
      </h1>
      <div className="flex">
        <div className="flex-1 flex">
          <b className="w-52">Operación: </b>
          <span>
            {formatOperation(process.operation)}{" "}
            {process.operation.result === undefined
              ? ""
              : `= ${fixNumber(process.operation.result)}`}
          </span>
        </div>
        <div className="flex-1 flex">
          <b className="w-52">Hora de entrada: </b>
          <TimeStampt seconds={process.metrics.arrival_time}></TimeStampt>
        </div>
        <div className="flex-1 flex">
          <b className="w-52">Hora de finalización: </b>
          <TimeStampt seconds={process.metrics.finish_time}></TimeStampt>
        </div>
      </div>

      <div className="flex">
        <div className="flex-1 flex">
          <b className="w-52">Tiempo de Retorno: </b>
          <TimeStampt seconds={calcReturnSeconds(process.metrics)}></TimeStampt>
        </div>
        <div className="flex-1 flex">
          <b className="w-52">Tiempo de espera: </b>
          <TimeStampt seconds={process.metrics.waiting_seconds}></TimeStampt>
        </div>
        <div className="flex-1 flex">
          <b className="w-52">Tiempo de servicio: </b>
          <TimeStampt seconds={process.metrics.service_seconds}></TimeStampt>
        </div>
      </div>

      <div className="flex">
        <div className="flex-1 flex">
          <b className="w-52">Tiempo restante: </b>
          <TimeStampt seconds={calcRemainingSeconds(process)}></TimeStampt>
        </div>
        <div className="flex-1 flex">
          <b className="w-52">Tiempo de respuesta: </b>
          <TimeStampt seconds={process.metrics.response_seconds}></TimeStampt>
        </div>
        <div className="flex-1 flex">
          <b className="w-52">Tiempo bloqueo: </b>
          <TimeStampt seconds={calcRemainingBlocked(process)}></TimeStampt>
        </div>
      </div>
    </div>
  );
}
