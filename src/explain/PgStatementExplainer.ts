import Statement from '../model/Statement';
import StatementExplainer from './StatementExplainer';

import {Pool} from 'pg';
import Console from '../print/Console';

export default class PgStatementExplainer implements StatementExplainer {
  private pgClient: Pool;

  public constructor(pgClient: Pool) {
    this.pgClient = pgClient;
  }

  public async explainStatement(statement: Statement): Promise<string> {
    try {
      const explainQuery = `EXPLAIN ${statement.query}`;
      const params = JSON.parse(statement.params);

      const result = await this.pgClient.query(explainQuery, params);

      return result.rows.map((r: any) => r['QUERY PLAN']).join(Console.Break);
    } catch (e: any) {
      return `Error: ${e?.message}`;
    }
  }
}