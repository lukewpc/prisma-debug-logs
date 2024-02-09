import Request from '../model/Request';

export default interface RequestPrinter {
  printRequest(request: Request): Promise<void>;
}
