import {
  asapScheduler,
  asyncScheduler,
  bindCallback,
  catchError,
  map,
  of,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';

function makeTitle(str: string) {
  console.log();
  console.log(`---------- ${str} ----------`);
}

// ajax
// only work in browser
(() => {
  //
  // ajax(`https://api.github.com/users?per_page=5`)
  //   .pipe(
  //     map((r) => console.log('users,', r)),
  //     catchError((err) => {
  //       console.log('error:', err);
  //       return of(err);
  //     }),
  //   )
  //   .subscribe((n) => {
  //     console.log(n);
  //   });
})();

// bindCallback
// Give it a function f of type f(x, callback) and it will return a function g that when called as g(x) will output an Observable.
(() => {
  console.log('---- bindCallback ----');
  // 1.最基本的
  // 不传递任何参数
  const simpleFnWithCallback = function (cb: (n: unknown) => unknown) {
    cb(Math.random());
  };
  // 创建一个observable
  const boundSimpleFunc = bindCallback(simpleFnWithCallback);
  boundSimpleFunc().subscribe(console.log);

  // 2. 要绑定的函数本身是需要传递参数的（要确保最后一个参数是cb）
  const whihParam = function (n: number, cb: (...args: unknown[]) => unknown) {
    cb(n + 1);
  };
  const boundWithParam = bindCallback(whihParam);

  boundWithParam(2).subscribe(console.log);

  // 3.不确定长度的参数
  function anyParams(...args: [...unknown[], (...res: unknown[]) => void]) {
    const cb = args[args.length - 1] as (...res: unknown[]) => void;
    const params = args.slice(0, args.length - 1) as number[];
    const cbParams = params.map((o) => o ** 2);

    cb(cbParams);
  }

  const boundAnyParams = bindCallback(anyParams);

  boundAnyParams(1, 2, 3, 5).subscribe(console.log);

  // 4. 使用result selector 和schedule
  function withResultSelectorFn(...args: any[]) {
    const cb = args[args.length - 1] as (...res: any[]) => void;
    const params = args.slice(0, args.length - 1) as string[];
    const cbParams = params.map((o) => `${o} -> withResultSelectorFn`);

    cb(cbParams);
  }

  const boundWithResultSelectorFn = bindCallback(
    withResultSelectorFn,
    (...args: string[]) => {
      return args.map((s) => {
        return `${s} -> resultSelector`;
      });
    },
    asapScheduler,
  );

  console.log('Start 我最厉害');
  boundWithResultSelectorFn('我', '最', '厉', '害').subscribe(console.log);
  console.log('Done 我最厉害');
})();
