// ref: https://benlesh.com/posts/learning-observable-by-building-observable/

/**
 * A simple object with a `next` and `complete` callback on it.
 */
interface Observer<T = unknown> {
  next?: (value: T) => void;
  complete?: () => void;
  error?: (err: unknown) => void;
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
      this.destination.next?.(value);
    }
  }

  complete() {
    // Make sure we're not completing an already "closed" subscriber.
    if (!this.closed) {
      // We're closed now
      this.#closeSubcription();
      // send compete signal
      this.destination.complete?.();
    }
  }

  error(err: unknown) {
    if (!this.closed) {
      this.#closeSubcription();
      this.destination.error?.(err);
    }
  }
}

/**
 * A class to wrap our function, to ensure that when the function is
 * called with an observer, that observer is wrapped with a SafeSubscriber
 */
class Observable<T> {
  constructor(
    private _wrappedFunction: (subscriber: SafeSubscriber<T>) => void,
  ) {}

  subscribe(observer: Observer<T>): void {
    // We can wrap our observer in a "safe subscriber" that
    // does the work of making sure it's not closed.
    const subscriber = new SafeSubscriber(observer);
    // 执行
    this._wrappedFunction(subscriber);
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
  const source = (subscriber: Required<Observer<number>>) => {
    subscriber.next?.(1);
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
    error: (err) => console.log(err),
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

/**
 * 提供一个可以取消订阅的能力
 * 先在我们最
 * 最简单的取消函数
 */
(() => {
  const source = (subscriber: Observer<number>) => {
    const timer = (() => {
      let i = 0;
      return setInterval(() => {
        subscriber.next?.(i++);
      }, 1000);
    })();

    return () => clearInterval(timer);
  };

  const teardown = source({
    next: console.log,
  });

  setTimeout(() => {
    console.log('取消订阅（simple）');
    teardown();
  }, 5000);
})();

/**
 * 引入Subscription来处理取消订阅的能力
 * 就是我们最终的版本
 */
(() => {
  class Subscription {
    private teardowns = new Set<() => void>();

    add(teardown: () => void) {
      this.teardowns.add(teardown);
    }

    unsubscribe() {
      console.log('teardowns size', this.teardowns.size);
      for (const teardown of this.teardowns) {
        teardown();
      }

      this.teardowns.clear();
    }
  }

  class SafeSubscriber<T> {
    // 是否已经调用complete或者error
    closed = false;

    constructor(
      private destination: Observer<T>,
      private subscription: Subscription,
    ) {
      // Make sure that if the subscription is unsubscribed,
      // we don't let any more notifications through this subscriber.
      this.subscription.add(() => (this.closed = true));
    }

    #closeSubcription() {
      this.closed = true;
    }

    next(value: T) {
      // Check to see if this is "closed" before nexting.
      if (!this.closed) {
        this.destination.next?.(value);
      }
    }

    complete() {
      // Make sure we're not completing an already "closed" subscriber.
      if (!this.closed) {
        // We're closed now
        this.#closeSubcription();
        // send compete signal
        this.destination.complete?.();
        this.subscription.unsubscribe();
      }
    }

    error(err: unknown) {
      if (!this.closed) {
        this.#closeSubcription();
        this.destination.error?.(err);
        this.subscription.unsubscribe();
      }
    }
  }

  /**
   * A class to wrap our function, to ensure that when the function is
   * called with an observer, that observer is wrapped with a SafeSubscriber
   */
  class Observable<T> {
    constructor(
      private _wrappedFunction: (subscriber: SafeSubscriber<T>) => () => void,
    ) {}

    subscribe(observer: Observer<T>): Subscription {
      // We can wrap our observer in a "safe subscriber" that
      // does the work of making sure it's not closed.
      const subscription = new Subscription();
      const subscriber = new SafeSubscriber(observer, subscription);
      subscription.add(this._wrappedFunction(subscriber));
      return subscription;
    }
  }

  // Usage
  const observable = new Observable((subscriber) => {
    const timer = (() => {
      let i = 0;
      return setInterval(() => {
        subscriber.next(i++);
      }, 1000);
    })();

    return () => clearInterval(timer);
  });

  const subscription = observable.subscribe({
    next(n) {
      console.log('最终的版本的返回值', n);
    },
  });

  setTimeout(() => {
    console.log('取消订阅了最终版本');
    subscription.unsubscribe();
  }, 5500);
})();
