import Mutex from './Mutex';
import TimedEvent from './TimedEvent';

export default class SyncManager<T extends TimedEvent> {
  private readonly keepCompleted: boolean;
  private mutex = new Mutex();

  public current: T | null = null;
  public completed: T[] = [];

  public constructor(keepCompleted: boolean) {
    this.keepCompleted = keepCompleted;
  }

  public async start(event: T) {
    await this.mutex.acquire();
    this.current = event;
    event.startTimer();
  }

  public endTimer() {
    this.current?.endTimer();
  }

  public release() {
    if (this.keepCompleted) this.completed.push(this.current!);
    this.current = null;
    this.mutex.release();
  }
}
