import Console from './Console';
import OperationPrinter from './OperationPrinter';
import Operation from '../model/Operation';
import Statement from '../model/Statement';

import { format } from 'sql-formatter';

export default class ConsolePrinter implements OperationPrinter {
  private readonly log: (message: string) => void;

  public constructor(log = console.log.bind(console)) {
    this.log = log;
  }

  public async printOperation(operation: Operation): Promise<void> {
    try {
      const statementLogs = await Promise.all(operation.statements.map(s => this.printStatement(s)));

      this.log(
        Console.FgGreen + Console.Break +
        `${operation.duration()} ms - ${operation.model}.${operation.operation}` + Console.Break +
        JSON.stringify(operation.args, null, 2) +
        Console.EmptyLine + Console.Reset +
        statementLogs.join('\n\n'),
      );
    } catch (e: any) {
      this.log('Error: ' + e?.message);
    }
  }

  protected async printStatement(statement: Statement): Promise<string> {
    try {
      const query = this.formatQuery(statement);

      return Console.FgRed + `${statement.duration} ms` + Console.Reset
        + Console.Break + query;
    } catch (e: any) {
      return 'Error: ' + e?.message;
    }
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
