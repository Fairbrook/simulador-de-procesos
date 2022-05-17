import useGlobal from 'hooks/useGlobal';
import { useMemo } from 'react';
import { Process } from 'types/Process';
import Frame from './frame';
import style from './style.module.css';

export default function FramesTable() {
  const { state, processesInMemory } = useGlobal();
  const processesDictionary = useMemo<{
    [key:number]:Process
  }>(
    () => processesInMemory.reduce(
      (res, proc) => ({ ...res, [proc.PID]: proc }),
      {},
    ),
    [processesInMemory],
  );

  return (
    <div>
      <h1 className="text-lg text-blue-200 text-left mb-4">
        Tabla de páginas
      </h1>
      <div className={style.table}>
        {state.mmu.frames.map((frame) => (
          <Frame
            key={frame.id}
            frame={frame}
            state={frame.PID ? processesDictionary[frame.PID]?.state : undefined}
          />
        ))}
      </div>

    </div>
  );
}
