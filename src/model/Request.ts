import Operation, { OperationEvent } from './Operation';
import StatementEvent from './Statement';
import SyncManager from '../sync/SyncManager';
import TimedEvent from '../sync/TimedEvent';

export default class Request extends TimedEvent {
  public operationMux = new SyncManager<Operation>(true);

  public async startOperation(event: OperationEvent) {
    await this.operationMux.start(new Operation(event));
  }

  public endOperation() {
    if (!this.operationMux.current) throw new Error('Operation not started');
    this.operationMux.endTimer();
    this.operationMux.release();
  }

  public addStatement(s: StatementEvent) {
    if (!this.operationMux.current) throw new Error('Operation not started');
    this.operationMux.current.addStatement(s);
  }
}
