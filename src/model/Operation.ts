import Statement, { StatementEvent } from './Statement';
import TimedEvent from '../sync/TimedEvent';

export type OperationEvent = {
  model?: string
  operation: string
  args: any
}

export default class Operation extends TimedEvent {
  public statements: Statement[] = [];

  public model?: string;
  public operation: string;
  public args: any;

  constructor(o: OperationEvent) {
    super();
    this.model = o.model;
    this.operation = o.operation;
    this.args = o.args;
  }

  public addStatement(s: StatementEvent) {
    this.statements.push(new Statement(s));
  }
}
