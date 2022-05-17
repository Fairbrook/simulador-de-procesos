import { formatOperation } from 'types/Operation';
import {
  calcRemainingBlocked,
  calcRemainingSeconds,
  Process,
  stateTostr,
} from 'types/Process';
import { calcReturnSeconds } from 'types/TimeMetrics';
import { fixNumber } from 'utils';
import TimeStampt from '../TimeStampt';

export interface ProcessRowProps {
  process: Process;
}
export default function ProcessRow({ process }: ProcessRowProps) {
  return (
    <div className="my-4">
      <h1 className="text-lg font-bold">
        <u>
          {process.PID}
          {' '}
          |
          {stateTostr[process.state]}
        </u>
      </h1>
      <div className="flex">
        <div className="flex-1 flex">
          <b className="w-52">Operación: </b>
          <span>
            {formatOperation(process.operation)}
            {' '}
            {process.operation.result === undefined
              ? ''
              : `= ${fixNumber(process.operation.result)}`}
          </span>
        </div>
        <div className="flex-1 flex">
          <b className="w-52">Hora de entrada: </b>
          <TimeStampt seconds={process.metrics.arrival_time} />
        </div>
        <div className="flex-1 flex">
          <b className="w-52">Hora de finalización: </b>
          <TimeStampt seconds={process.metrics.finish_time} />
        </div>
      </div>

      <div className="flex">
        <div className="flex-1 flex">
          <b className="w-52">Tiempo de Retorno: </b>
          <TimeStampt seconds={calcReturnSeconds(process.metrics)} />
        </div>
        <div className="flex-1 flex">
          <b className="w-52">Tiempo de espera: </b>
          <TimeStampt seconds={process.metrics.waiting_seconds} />
        </div>
        <div className="flex-1 flex">
          <b className="w-52">Tiempo de servicio: </b>
          <TimeStampt seconds={process.metrics.service_seconds} />
        </div>
      </div>

      <div className="flex">
        <div className="flex-1 flex">
          <b className="w-52">Tiempo restante: </b>
          <TimeStampt seconds={calcRemainingSeconds(process)} />
        </div>
        <div className="flex-1 flex">
          <b className="w-52">Tiempo de respuesta: </b>
          <TimeStampt seconds={process.metrics.response_seconds} />
        </div>
        <div className="flex-1 flex">
          <b className="w-52">Tiempo bloqueo: </b>
          <TimeStampt seconds={calcRemainingBlocked(process)} />
        </div>
      </div>

      <div className="flex">
        <div className="flex-1 flex">
          <b className="w-52">Espacio: </b>
          <span>
            {process.space}
          </span>
        </div>
      </div>

    </div>
  );
}
