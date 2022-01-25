// ref: https://benlesh.com/posts/learning-observable-by-building-observable/

/**
 * A simple object with a `next` and `complete` callback on it.
 */
interface Observer<T = any> {
  next(value: T): void;
  complete(): void;
}

/**
 * A class used to wrap a user-provided Observer. Since the
 * observer is just a plain objects with a couple of callbacks on it,
 * this type will wrap that to ensure `next` does nothing if called after
 * `complete` has been called, and that nothing happens if `complete`
 * is called more than once.
 */
class SafeSubscriber<T> {
  // 是否已经调用complete或者error
  closed = false;

  constructor(private destination: Observer<T>) {}

  #closeSubcription() {
    this.closed = true;
  }

  next(value: T) {
    // Check to see if this is "closed" before nexting.
    if (!this.closed) {
      this.destination.next(value);
    }
  }

  complete() {
    // Make sure we're not completing an already "closed" subscriber.
    if (!this.closed) {
      // We're closed now
      this.#closeSubcription();
      // send compete signal
      this.destination.complete();
    }
  }
}

/**
 * 一个最简单的rxjs模型
 */
(() => {
  /**
   * A function that takes a simple object with callbacks
   * and does something them.
   */
  const source = (subscriber: Observer<number>) => {
    subscriber.next(1);
    subscriber.next(2);
    subscriber.next(3);
    subscriber.complete();
    subscriber.next(4); // 不应该能执行
  };

  // Usage
  console.log('start');
  source({
    next: console.log,
    complete: () => console.log('done!'),
  });
  console.log('stop');
})();

/**
 * 在这个情况下，当调用了subscriber.complete()之后
 * 还是可以继续调用subscriber.next(3)的，
 * 这是不安全的。
 *
 * 所以observer是有状态的，需要记住是否已经complete
 */
(() => {
  const source = (subscriber: SafeSubscriber<number>) => {
    subscriber.next(1);
    subscriber.next(2);
    subscriber.next(3);
    subscriber.complete();
    subscriber.next(4); // 不会被执行
  };

  // Usage
  console.log('----------------');
  console.log('start with safe subscriber');
  source(
    new SafeSubscriber<number>({
      next: console.log,
      complete: () => console.log('done!'),
    }),
  );
  console.log('stop with safe subscriber');
  console.log('----------------');
})();

/**
 * 避免subscribe的时候手动创建SafeSubscriber
 * 也避免暴露了SafeSubscriber
 */
(() => {
  /**
   * A class to wrap our function, to ensure that when the function is
   * called with an observer, that observer is wrapped with a SafeSubscriber
   */
  class Observable<T> {
    constructor(private _wrappedFunction: (subscriber: Observer<T>) => void) {}

    subscribe(observer: Observer<T>): void {
      // We can wrap our observer in a "safe subscriber" that
      // does the work of making sure it's not closed.
      const subscriber = new SafeSubscriber(observer);
      // 执行
      this._wrappedFunction(subscriber);
    }
  }

  // usage
  console.log('----------------');
  console.log('start with safe subscriber and wrapped Observable class');
  const source = new Observable<number>((subscriber) => {
    subscriber.next(1);
    subscriber.next(2);
    subscriber.next(3);
    subscriber.complete();
    subscriber.next(4); // 不会被执行
  });
  source.subscribe({
    next: console.log,
    complete: () => console.log('done!'),
  });
  console.log('start with safe subscriber and wrapped Observable class');
  console.log('----------------');
})();
