export type StatementEvent = {
  query: string
  params: string
  timestamp: string
  duration: number
}

export default class Statement {
  public query: string;
  public params: string;
  public timestamp: string;
  public duration: number;

  constructor(s: StatementEvent) {
    this.query = s.query;
    this.params = s.params;
    this.timestamp = s.timestamp;
    this.duration = s.duration;
  }
}
