import { Observable } from 'rxjs';

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
