export enum Operator {
  Add,
  Sub,
  Mul,
  Div,
  Pow,
}

const operatorToStr = {
  [Operator.Add]: '+',
  [Operator.Sub]: '-',
  [Operator.Mul]: '*',
  [Operator.Div]: '/',
  [Operator.Pow]: '^',
};
export interface Operation {
  result?: number;
  operator: Operator;
  operand_a: number;
  operand_b: number;
}

export function calc(operation: Operation): Operation {
  const copy = { ...operation };
  copy.result = copy.operand_a;
  switch (copy.operator) {
    case Operator.Add:
      copy.result += copy.operand_b;
      return copy;
    case Operator.Sub:
      copy.result -= copy.operand_b;
      return copy;
    case Operator.Div:
      copy.result /= copy.operand_b;
      return copy;
    case Operator.Mul:
      copy.result *= copy.operand_b;
      return copy;
    case Operator.Pow:
      copy.result **= copy.operand_b;
      return copy;
    default:
      return copy;
  }
}
export function formatOperation(operation: Operation): string {
  return `${operation.operand_a} ${operatorToStr[operation.operator]} ${
    operation.operand_b
  }`;
}
