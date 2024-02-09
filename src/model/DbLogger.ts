import OperationEvent from './Operation';
import RequestPrinter from '../print/RequestPrinter';
import Request from './Request';
import StatementEvent from './Statement';
import SyncManager from '../sync/SyncManager';

export default class DbLogger {
  private requestMux = new SyncManager<Request>(false);

  constructor(private printer: RequestPrinter) {
  }

  public async startRequest() {
    await this.requestMux.start(new Request());
  }

  public async endRequest() {
    if (!this.requestMux.current) {
      throw new Error('Request not started');
    }
    this.requestMux.endTimer();
    await this.printer.printRequest(this.requestMux.current);
    this.requestMux.release();
  }

  public async startOperation(event: OperationEvent) {
    if (!this.requestMux.current) {
      throw new Error('Request not started');
    }
    await this.requestMux.current.startOperation(event);
  }

  public endOperation() {
    if (!this.requestMux.current) {
      throw new Error('Request not started');
    }
    this.requestMux.current.endOperation();
  }

  public addStatement(s: StatementEvent) {
    if (!this.requestMux.current) {
      throw new Error('Request not started');
    }
    this.requestMux.current.addStatement(s);
  }
}
