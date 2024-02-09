export default abstract class TimedEvent {
  public startTime = 0;
  public endTime = 0;

  public startTimer() {
    this.startTime = performance.now();
  }

  public endTimer() {
    this.endTime = performance.now();
  }

  public duration() {
    return this.startTime && this.endTime
      ? Math.round(this.endTime - this.startTime)
      : 0;
  }
}
