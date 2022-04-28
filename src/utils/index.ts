import { Operation, Operator } from 'types/Operation';
import { newProcess } from 'types/Process';

function randomOperator() {
  const r = Math.floor(Math.random() * 5);
  if (r === 0) return Operator.Add;
  if (r === 1) return Operator.Sub;
  if (r === 2) return Operator.Mul;
  if (r === 3) return Operator.Div;
  if (r === 4) return Operator.Pow;
  return Operator.Add;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomProcess(index: number, time: number) {
  const operation: Operation = {
    operator: randomOperator(),
    operand_a: randomInt(0, 100),
    operand_b: randomInt(0, 100),
  };

  return newProcess(index, randomInt(7, 18), operation, time);
}

export function formatSeconds(seconds: number | undefined): string {
  if (seconds === undefined) return 'N/A';
  return `${`${Math.floor(seconds / 60) + 100}`.substring(1)}:${`${
    (seconds % 60) + 100
  }`.substring(1)}`;
}

export function fixNumber(num: number): string {
  let str = num.toString();
  const [int, decWithEx] = str.split('.');
  str = int;
  if (decWithEx) {
    const [dec, ex] = decWithEx.split('e');
    str += `.${dec.substring(0, 4)}`;
    if (ex) {
      str += `e${ex}`;
    }
  }
  return str;
}
