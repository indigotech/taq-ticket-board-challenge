export class OverrideManager {
  private readonly restorers: Array<() => void> = [];

  set<T extends object, K extends keyof T>(target: T, key: K, value: T[K]): void {
    const oldValue = target[key];
    this.restorers.push(() => {
      target[key] = oldValue;
    });

    target[key] = value;
  }

  restoreAll(): void {
    while (this.restorers.length) {
      this.restorers.pop()!();
    }
  }
}
