import { Observable, of } from 'rxjs';

// 创建一个最基本的operator
(() => {
  //
  const double = (source: Observable<number>) =>
    new Observable<number>((subscriber) => {
      const subscription = source.subscribe({
        // Here we alter our value and "send it along" to our consumer.
        next: (value) => subscriber.next(2 * value),
        error: (error) => subscriber.error(error),
        complete: () => subscriber.complete(),
      });

      // 返回teardown的方法
      return () => {
        subscription.unsubscribe();
      };
    });

  of(1, 2, 3, 4).pipe(double, double, double).subscribe(console.log);
})();
