import { Observable, Subscriber } from 'rxjs';

// 第一个例子
(function () {
  const observable = new Observable<number>((subscribe) => {
    subscribe.next(1);
    subscribe.next(2);
    subscribe.next(3);

    setTimeout(() => {
      subscribe.next(4);
      subscribe.complete();
    }, 1000);
  });

  console.log('just before subscribe');

  observable.subscribe({
    next(x) {
      console.log('got value ' + x.toString());
    },

    error(err: string) {
      console.error('something wrong occurred: ' + err);
    },
    complete() {
      console.log('done');
    },
  });
})();

// executing observables
(function () {
  // next and complete
  const observable1 = new Observable<number>(function subscribe(subscriber) {
    //
    subscriber.next(1);
    subscriber.next(2);
    subscriber.next(3);
    subscriber.complete();
    subscriber.next(4); // not reached
  });

  observable1.subscribe((x) => console.log(`next and complete`, x));

  // next and error
  const observable2 = new Observable<number>(function subscribe(subscriber) {
    //
    subscriber.next(1);
    subscriber.next(2);
    subscriber.next(3);
    subscriber.error('一个巨大的错误发生了');
    subscriber.next(4); // not reached
  });

  observable2.subscribe({
    next(x) {
      console.log('next and error', x);
    },
    error(err) {
      console.log(err);
    },
  });
})();

(() => {
  // Disposing Obervable Executions
  const subscribe = function (subscriber: Subscriber<string>) {
    const intervalId = setInterval(() => {
      subscriber.next('hi');
    }, 1000);

    return function unsubscribe() {
      clearInterval(intervalId);
    };
  };

  const observable = new Observable<string>(subscribe);

  const subscription = observable.subscribe((x) => console.log(x));
  setTimeout(() => {
    subscription.unsubscribe();
  }, 3000);
})();
