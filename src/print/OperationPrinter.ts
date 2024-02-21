import Operation from '../model/Operation';

export default interface OperationPrinter {
  printOperation(request: Operation): Promise<void>;
}
