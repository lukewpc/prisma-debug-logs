import Operation, { OperationEvent } from './Operation';
import StatementEvent from './Statement';
import SyncManager from '../sync/SyncManager';
import TimedEvent from '../sync/TimedEvent';
import OperationPrinter from '../print/OperationPrinter';

export default class DbLogger extends TimedEvent {
  public operationMux = new SyncManager<Operation>(true);

  constructor(private printer: OperationPrinter) {
    super()
  }

  public async startOperation(event: OperationEvent) {
    await this.operationMux.start(new Operation(event));
  }

  public async endOperation() {
    if (!this.operationMux.current) throw new Error('Operation not started');
    this.operationMux.endTimer();
    await this.printer.printOperation(this.operationMux.current);
    this.operationMux.release();
  }

  public addStatement(s: StatementEvent) {
    if (!this.operationMux.current) throw new Error('Operation not started');
    this.operationMux.current.addStatement(s);
  }
}
