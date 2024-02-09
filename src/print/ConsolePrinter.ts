import Console from './Console';
import RequestPrinter from './RequestPrinter';
import Operation from '../model/Operation';
import Request from '../model/Request';
import Statement from '../model/Statement';

import { format } from 'sql-formatter';

export default class ConsolePrinter implements RequestPrinter {
  private log: (message: string) => void;

  public constructor(log = console.log.bind(console)) {
    this.log = log;
  }

  public async printRequest(request: Request): Promise<void> {
    const operationLogs = await Promise.all(request.operationMux.completed.map(o => this.printOperation(o)));

    this.log(
      Console.Break +
      Console.FgBlue +
      Console.DoubleLine +
      `Request completed in ${request.duration()} ms\n` +
      Console.DoubleLine +
      Console.Reset +
      operationLogs.join(Console.Break + Console.SingleLine),
    );
  }

  protected async printOperation(operation: Operation): Promise<string> {
    const statementLogs = await Promise.all(operation.statements.map(s => this.printStatement(s)));

    return (
      Console.FgGreen +
      `${operation.duration()} ms - ${operation.model}.${operation.operation}` + Console.Break +
      JSON.stringify(operation.args, null, 2) +
      Console.EmptyLine + Console.Reset +
      statementLogs.join('\n\n')
    );
  }

  protected async printStatement(statement: Statement): Promise<string> {
    const query = this.formatQuery(statement);

    return Console.FgRed + `${statement.duration} ms` + Console.Reset
      + Console.Break + query;
  }

  private formatQuery(statement: Statement): string {
    const query = format(statement.query, { language: 'postgresql' } as any);

    const params = JSON.parse(statement.params) as any[];

    return params.reduce((query, param, i) =>
      this.substituteParam(query, i, param), query);
  }

  private substituteParam(query: string, i: number, value: any): string {
    const replaceValue = JSON.stringify(value)
      .replace(/"/g, '\'')
      .replace(/'/g, '\\\'');

    return query.replace(`$${i + 1}`, replaceValue);
  }
}
