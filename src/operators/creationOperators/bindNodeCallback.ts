import { readFile } from 'fs';
import path from 'path';
import { bindNodeCallback } from 'rxjs';
import { makeTitle } from '../../util/makeTitle';

/**
 * bindNodeCallback
 * node风格的bindCallback
 * 回调函数的第一个参数是err
 */
(() => {
  makeTitle('bindNodeCallback');
  // 1.测试node自带
  const filePath = path.resolve(process.cwd(), 'package.json');
  const readFileAsObservable = bindNodeCallback(
    readFile as (...args: any[]) => void, // 这里需要修正readFile，否则会自动infer，导致报错
  );
  readFileAsObservable(filePath, {
    encoding: 'utf-8',
  }).subscribe(console.log);
})();
