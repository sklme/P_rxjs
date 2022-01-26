import { defer, of } from 'rxjs';

// 每次subscribe才去建立observable
// 动态的方法
(() => {
  const o = defer(() => {
    if (Math.random() < 0.5) {
      return of(1, 2, 3);
    }

    return of(4, 5, 6);
  });
  // 结果可能是不同的，
  o.subscribe(console.log);
  o.subscribe(console.log);
})();
