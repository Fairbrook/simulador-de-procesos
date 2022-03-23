import TimeStampt from "components/atoms/TimeStampt";
import { useMemo } from "react";
import { StateSnapshot, stateToStr } from "types/GlobalState";

export interface GlobalMetricsProps {
  state: StateSnapshot;
}
export default function GlobalMetrics({ state }: GlobalMetricsProps) {
  const total_proc = useMemo(
    () =>
      state.ready.length +
      state.finished.length +
      state.blocked.length +
      (state.active ? 1 : 0),
    [state]
  );

  const status = useMemo(() => stateToStr[state.state], [state.state]);
  const statusClass = useMemo(() => {
    switch (status) {
      case "Procesando":
        return "text-green-300";
      case "Pausado":
        return "text-red-200";
      case "Terminado":
        return "text-gray-100";
    }
  }, [status]);

  return (
    <div className="p-3 text-left">
      <div className="flex mb-2">
        <div className="flex flex-1 ">
          <b className="block w-36">Hora: </b>
          <TimeStampt seconds={state.time}></TimeStampt>
        </div>
        <div className="flex flex-1 ">
          <b className="block w-36">Procesos: </b>
          <span>{total_proc}</span>
        </div>
      </div>
      <div className="flex mb-3">
        <div className="flex flex-1 ">
          <b className="block w-36">Bloqueados: </b>
          <span>{state.blocked.length}</span>
        </div>
        <div className="flex flex-1 ">
          <b className="block w-36">Terminados: </b>
          <span>{state.finished.length}</span>
        </div>
      </div>
      <div className="text-3xl flex flex-1 text-center mt-6">
        <b className="mr-5">Estado: </b>
        <h1 className={statusClass}>{status}</h1>
      </div>
    </div>
  );
}
