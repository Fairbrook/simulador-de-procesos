export enum Operator {
  Add,
  Sub,
  Mul,
  Div,
  Pow,
}

export class Operation {
  public result: number | undefined;

  constructor(
    public operator: Operator,
    public operand_a: number,
    public operant_b: number
  ) {}

  public calc() {
    this.result = this.operand_a;
    switch (this.operator) {
      case Operator.Add:
        this.result += this.operant_b;
        return;
      case Operator.Sub:
        this.result += this.operant_b;
        return;
      case Operator.Div:
        this.result /= this.operant_b;
        return;
      case Operator.Mul:
        this.result *= this.operant_b;
        return;
      case Operator.Pow:
        this.result = Math.pow(this.result, this.operant_b);
        return;
    }
  }
}
