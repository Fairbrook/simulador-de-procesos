import { useMemo } from 'react';
import { Frame as FrameType } from 'types/MMU';
import { State } from 'types/Process';
import styles from './style.module.css';

export interface FrameProps {
  frame:FrameType;
  clasName?:string;
  state?: State;
}

export default function Frame({ frame, clasName, state }:FrameProps) {
  const pid = useMemo(() => {
    if (frame.PID === undefined) return '-';
    if (frame.PID === -1) return 'OS';
    return `PID: ${frame.PID}`;
  }, [frame]);

  const color = useMemo(() => {
    if (frame.PID === -1) return 'bg-yellow-300';
    if (state === State.Blocked) return 'bg-purple-300';
    if (state === State.Executing) return 'bg-green-300';
    return 'bg-blue-300';
  }, [frame, state]);

  return (
    <div className={`flex border-white mr-3 overflow-hidden ${styles.frame} ${clasName || ''}`}>
      <div className="w-20 text-left  px-3">
        #
        {frame.id}
      </div>
      <div className="w-24 text-left border-x-2 border-white px-3">{pid}</div>
      <div className="flex w-44">
        {frame.spaces.map((used) => <div className={`border-l-2 ${used ? `${color} border-white` : 'bg-transparent border-transparent'} flex-1`} />)}
      </div>
    </div>
  );
}
