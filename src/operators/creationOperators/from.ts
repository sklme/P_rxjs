import { from, of } from 'rxjs';
// Creates an Observable from an Array, an array-like object, a Promise, an iterable object, or an Observable-like object.

/**
 * Valid types that can be converted to observables.
 */
//  export type ObservableInput<T> =
//  | Observable<T>
//  | InteropObservable<T>
//  | AsyncIterable<T>
//  | PromiseLike<T>
//  | ArrayLike<T>
//  | Iterable<T>
//  | ReadableStreamLike<T>;
(() => {
  // 1. from a observable
  const observable = of(1, 2, 3);
  const source1 = from(observable);
  source1.subscribe(console.log);

  // 2. from InteropObservable
  // TODO: 咋弄？
  // const interopObservable: InteropObservable<number> = {
  //   [Symbol.observable]: () => observable,
  // };
  // const source2 = from(interopObservable);
  // source2.subscribe(console.log);

  // 3. from asyncIterable
  const asyncIterable = {
    // eslint-disable-next-line @typescript-eslint/require-await
    [Symbol.asyncIterator]: async function* () {
      yield 1;
      yield 2;

      yield new Promise((r) => {
        setTimeout(() => {
          r(3);
        }, 1000);
      });
    },
  };
  const myAsyncIterable: AsyncIterable<number> = {
    [Symbol.asyncIterator]: () => ({
      next: () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const random = Math.random();
            if (random < 0.7) {
              resolve({
                value: random,
              });
            } else {
              resolve({
                done: true,
                value: random,
              });
            }
          }, 1000);
        });
      },
    }),
  };
  const source3 = from(asyncIterable);
  const source3_1 = from(myAsyncIterable);
  console.log('start from asyncIterable');
  source3.subscribe((n) => console.log('from asyncIterable:', n));
  source3_1.subscribe((n) => console.log(`from myAsyncIterable`, n));
  console.log('stop from asyncIterable');

  // 4. from PromiseLike
  const p = new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, 1000);
  });
  const source4 = from(p);
  source4.subscribe((n) => console.log('from Promise', n));

  // 5. from arrayLike
  from([1, 2, 3]).subscribe((n) => console.log('from array', n));
  const arrayLike = {
    length: 3,
    0: 1,
    1: 2,
    2: 3,
  };

  from(arrayLike).subscribe((n) => console.log('from arrayLike', n));

  // from iterable
  const iterable = {
    *[Symbol.iterator]() {
      yield 1;
      yield 2;
      yield 3;
    },
  };
  const iterable2: Iterable<number> = {
    [Symbol.iterator]: () => ({
      next() {
        const random = Math.random();
        if (random < 0.7) {
          return {
            value: random,
          };
        } else {
          return {
            value: random,
            done: true,
          };
        }
      },
    }),
  };

  from(iterable).subscribe((n) => console.log('from iterable', n));
  from(iterable2).subscribe((n) => console.log('from iterable2', n));

  // 6. from ReadableStreamLike
  // TODO
})();
