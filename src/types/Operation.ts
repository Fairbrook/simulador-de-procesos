export enum Operator {
  Add,
  Sub,
  Mul,
  Div,
  Pow,
}

const operatorToStr = {
  [Operator.Add]: "+",
  [Operator.Sub]: "-",
  [Operator.Mul]: "*",
  [Operator.Div]: "/",
  [Operator.Pow]: "^",
};
export interface Operation {
  result?: number;
  operator: Operator;
  operand_a: number;
  operand_b: number;
}

export function calc(operation: Operation): Operation {
  const _copy = { ...operation };
  _copy.result = _copy.operand_a;
  switch (_copy.operator) {
    case Operator.Add:
      _copy.result += _copy.operand_b;
      return _copy;
    case Operator.Sub:
      _copy.result -= _copy.operand_b;
      return _copy;
    case Operator.Div:
      _copy.result /= _copy.operand_b;
      return _copy;
    case Operator.Mul:
      _copy.result *= _copy.operand_b;
      return _copy;
    case Operator.Pow:
      _copy.result = Math.pow(_copy.result, _copy.operand_b);
      return _copy;
  }
}
export function formatOperation(operation: Operation): string {
  return `${operation.operand_a} ${operatorToStr[operation.operator]} ${
    operation.operand_b
  }`;
}
