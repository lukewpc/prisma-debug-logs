import Console from './Console';
import ConsolePrinter from './ConsolePrinter';
import StatementExplainer from '../explain/StatementExplainer';
import Statement from '../model/Statement';

export default class ExplainingConsolePrinter extends ConsolePrinter {
  private readonly explainer: StatementExplainer;

  public constructor(explainer: StatementExplainer) {
    super();
    this.explainer = explainer;
  }

  protected async printStatement(statement: Statement): Promise<string> {
    try {
      const queryPlan = await this.explainer.explainStatement(statement);

      return (
          await super.printStatement(statement)
          + Console.Break + Console.FgMagenta
          + queryPlan + Console.Reset
      );
    } catch (e: any) {
      return 'Error: ' + e?.message;
    }
  }
}
