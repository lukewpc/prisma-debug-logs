import Statement from '../model/Statement';

export default interface StatementExplainer {
  explainStatement(statement: Statement): Promise<string>;
}
