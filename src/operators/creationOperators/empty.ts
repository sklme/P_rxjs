import {
  EMPTY,
  empty,
  interval,
  mergeMap,
  of,
  queueScheduler,
  scheduled,
} from 'rxjs';

/**
 * Creates an Observable that emits no items to the Observer and immediately emits a complete notification
 */
// (() => {
//   // 1. basic
//   empty().subscribe({
//     next(x: any) {
//       console.log(x);
//     },
//     complete() {
//       console.log('done');
//     },
//   });

//   // 2. use for filter
//   const interval$ = interval(1000);
//   const result = interval$.pipe(
//     mergeMap((n) => {
//       return n % 2 === 1 ? of('a', 'b', 'c') : empty();
//     }),
//   );
//   result.subscribe(console.log);
// })();

/**
 * empty() is deprecated, use EMPTY or scheduled instead.
 */
(() => {
  // 1. basic
  EMPTY.subscribe({
    next(x: any) {
      console.log(x);
    },
    complete() {
      console.log('done');
    },
  });

  scheduled([], queueScheduler).subscribe({
    next(x: any) {
      console.log(x);
    },
    complete() {
      console.log('done');
    },
  });

  //   // 2. use for filter
  const interval$ = interval(1000);
  const result = interval$.pipe(
    mergeMap((n) => {
      return n % 2 === 1 ? of('a', 'b', 'c') : EMPTY;
    }),
  );
  result.subscribe(console.log);
})();
