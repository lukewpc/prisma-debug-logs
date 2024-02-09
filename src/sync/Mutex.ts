export default class Mutex {
  private lock = false;
  private queue: (() => void)[] = [];

  public async acquire() {
    return new Promise<void>(resolve => {
      if (this.lock) {
        this.queue.push(resolve as any);
      } else {
        this.lock = true;
        resolve();
      }
    });
  }

  public release() {
    if (this.queue.length) {
      this.queue.shift()!();
    } else {
      this.lock = false;
    }
  }
}
