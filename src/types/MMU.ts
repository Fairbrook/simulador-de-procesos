import { FRAME_SIZE } from 'config/constants';
import type { Process } from './Process';

export interface Frame {
  spaces: boolean[];
  PID?: number;
  id: number;
}

export interface MMU {
  frames: Frame[];
}

export function newFrame(id: number) {
  return {
    spaces: Array(FRAME_SIZE).fill(false),
    id,
  };
}

export function isFrameOccupied(frame: Frame) {
  return typeof frame.PID === 'number';
}

export function markFrameAsOS(frame: Frame): Frame {
  return {
    spaces: Array(FRAME_SIZE).fill(true),
    id: frame.id,
    PID: -1,
  };
}

export function allocateFrame(frame: Frame, PID: number, space: number): Frame {
  if (space > FRAME_SIZE) throw Error('Space out of frame size');
  return {
    id: frame.id,
    PID,
    spaces: [
      ...Array(space).fill(true),
      ...Array(FRAME_SIZE - space).fill(false),
    ],
  };
}

export function deallocateFrame(frame: Frame): Frame {
  return {
    id: frame.id,
    spaces: Array(FRAME_SIZE).fill(false),
  };
}

export function initMMU(memorySize: number): MMU {
  const frames: Frame[] = Array(memorySize / FRAME_SIZE)
    .fill(0)
    .map((_, i) => newFrame(i));
  frames[0] = markFrameAsOS(frames[0]);
  frames[1] = markFrameAsOS(frames[1]);
  return {
    frames,
  };
}

export function hasSpace(mmu: MMU, process: Process): number | undefined {
  let emptyContiguous = 0;
  let frameStart;
  const processFrames = Math.ceil(process.space / FRAME_SIZE);
  // eslint-disable-next-line no-restricted-syntax
  for (const frame of mmu.frames) {
    if (emptyContiguous >= processFrames) {
      break;
    }

    if (isFrameOccupied(frame)) {
      emptyContiguous = 0;
      frameStart = undefined;
      // eslint-disable-next-line no-continue
      continue;
    }

    emptyContiguous += 1;
    if (frameStart === undefined) {
      frameStart = frame.id;
    }
  }
  if (emptyContiguous < processFrames) {
    frameStart = undefined;
  }
  return frameStart;
}

export function allocate(mmu: MMU, frameID: number, process: Process): MMU {
  let remmaingSpaceToAllocate = process.space;
  const processFrames = Math.ceil(process.space / FRAME_SIZE);
  const mmuFrames = [...mmu.frames];
  for (let i = frameID; i < processFrames + frameID; i += 1) {
    const currentAllocationSize = remmaingSpaceToAllocate > FRAME_SIZE
      ? FRAME_SIZE
      : remmaingSpaceToAllocate;
    remmaingSpaceToAllocate -= FRAME_SIZE;
    mmuFrames[i] = allocateFrame(mmu.frames[i], process.PID, currentAllocationSize);
  }
  return {
    frames: mmuFrames,
  };
}

export function deallocate(mmu: MMU, process: Process):MMU {
  const mmuFrames = [...mmu.frames];
  const firstIndex = mmuFrames.findIndex((frame) => frame.PID === process.PID);
  if (firstIndex < 0) return mmu;
  let deleteIndex = firstIndex;
  while (mmuFrames[deleteIndex]?.PID === process.PID) {
    mmuFrames[deleteIndex] = deallocateFrame(mmuFrames[deleteIndex]);
    deleteIndex += 1;
  }
  return {
    frames: mmuFrames,
  };
}
