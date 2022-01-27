import { makeTitle } from '../util/makeTitle';

/**
 * ArrayBuffer对象代表储存二进制数据的一段内存，它不能直接读写，只能通过视图（TypedArray视图和DataView视图)来读写，视图的作用是以指定格式解读二进制数据。
 */
(() => {
  makeTitle('ArrayBuffer');
  // 创建一段内存
  const buf = new ArrayBuffer(32);
  // 为了读写，我们指定DataView视图
  const dataView = new DataView(buf);
  // 使用某种Type视图获取数据
  console.log(dataView.getUint8(0)); // 0
  // 使用视图修改内存
  dataView.setUint8(0, 1);
  console.log(dataView.getUint8(0)); // 1

  // 也可以指定具体的视图
  const uint32View = new Uint8Array(buf);
  uint32View[0] = 200;
  console.log(uint32View[0]); // 200
  // 对同一个buffer指定不同的视图
  const int8View = new Int8Array(buf);
  console.log(int8View[0]); //  -56， 有符号，变成负数了

  // arrayBuffer实例属性与方法
  makeTitle('arrayBuffer实例方法');
  // byteLength
  console.log(buf.byteLength); // 32
  // slice 创建一个新的arrayBuffer切片
  const sliceBuf = buf.slice(0, 1);
  console.log(sliceBuf.byteLength); // 1

  // arrayBuffer静态属性
  makeTitle('arrayBuffer静态属性');
  // isView 判断是否是视图
  console.log(ArrayBuffer.isView(buf)); //fasle
})();

/**
 * TypedArray构造函数除了接受buffer之外，也接受数组：ArrayLike<number> | ArrayBufferLike
 */
(() => {
  makeTitle('TypeBuffer构造函数');
  // 使用 arrayLike 构造
  // 数组
  const int8View = new Int8Array([1, 2, 3]);
  console.log(int8View);
  // 生成器
  function* yield123() {
    yield 1;
    yield 2;
    yield 3;
  }
  const int16View = new Int16Array(yield123());
  console.log(int16View);
  console.log(int16View.length); // 3
  console.log(int16View.byteLength); // 6
})();
