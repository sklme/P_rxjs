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
  makeTitle('使用arrayBuffer构造');
  // 使用arrayBuffer构造
  const buf = new ArrayBuffer(32);
  const i32View = new Int32Array(buf);
  console.log(i32View.byteLength); // 32
  console.log(i32View.length); // 8
  const i32ViewWithOffset = new Int32Array(buf, 4); // 传递byteoffet
  console.log(i32ViewWithOffset.byteLength); // 28
  console.log(i32ViewWithOffset.length); // 7
  const i32ViewWithOffsetAndLength = new Int32Array(buf, 4, 2);
  console.log(i32ViewWithOffsetAndLength.byteLength); // 8
  console.log(i32ViewWithOffsetAndLength.length); // 2

  makeTitle('使用arrayLike构造');
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

  makeTitle('使用数值构造');
  const f64a = new Float64Array(3); // 传入的数值是成员的length
  f64a[0] = 10;
  f64a[1] = 30;
  f64a[2] = f64a[0] + f64a[1];
  console.log(f64a[2]); // 40
  console.log(f64a.byteLength); // 24
  console.log(f64a.length); // 3
  const bigInt64 = new BigInt64Array([1n, 2n, 3n]);
  console.log(BigInt64Array.BYTES_PER_ELEMENT); // 8
  console.log(bigInt64); //

  makeTitle('使用其他视图示例构造');
  const otherDataView = new Uint8Array([1, 11, 111, 222]);
  console.log(otherDataView);
  const thisDataView = new Int8Array(otherDataView);
  console.log(thisDataView);

  makeTitle('视图的数组方法');
  makeTitle('普通数组的操作方法和属性，对TypedArray数组完全适用。');
  const u32 = new Uint32Array([1, 2, 3, 4]);
  console.log(u32.slice(1));

  makeTitle('判断字节序');
  const BIG_ENDIAN = Symbol('BIG_ENDIAN');
  const LITTLE_ENDIAN = Symbol('LITTLE_ENDIAN');
  const UNKNOWN_ENDIAN = Symbol('UNKNOWN_ENDIAN');
  function getPlatformEndianness() {
    // 创建一个32位的typeArray，作为内存来对比
    const arr32 = Uint32Array.of(0x12345678);
    // 创建一个8位的typeArray，从内存中取出数字来判断
    const arr8 = new Uint8Array(arr32.buffer);
    switch (
      arr8[0] * 0x1000000 +
      arr8[1] * 0x10000 +
      arr8[2] * 0x100 +
      arr8[3]
    ) {
      case 0x78563412:
        return LITTLE_ENDIAN;
      case 0x12345678:
        return BIG_ENDIAN;
      default:
        return UNKNOWN_ENDIAN;
    }
  }
  const endian = getPlatformEndianness();
  console.log('这个运行环境的字节序是', endian);

  // 与字符串转换
  makeTitle('TypeeArray与字符串转换');
  // ArrayBuffer转为字符串，或者字符串转为ArrayBuffer，有一个前提，即字符串的编码方法是确定的。假定字符串采用UTF-16编码（JavaScript的内部编码方式），可以自己编写转换函数。s
  function str2ab(str: string) {
    const buf = new ArrayBuffer(str.length * 2); // 每个字符占用2个字节
    const bufView = new Uint16Array(buf);
    return Array.prototype.reduce.call<
      string,
      [
        (result: Uint16Array, current: string, index: number) => Uint16Array,
        Uint16Array,
      ],
      Uint16Array
    >(
      str,
      (result, current: string, index) => {
        // TODO 怎么处理unicde？charPointAt？
        const charCode = current.charCodeAt(0);
        result[index] = charCode;
        return result;
      },
      bufView,
    );
  }

  function ab2str(ab: Uint16Array) {
    return String.fromCharCode.apply(null, [...ab]);
  }
  const stringArrayBuf = str2ab('我最厉害123');
  console.log('string 2 ab, ', stringArrayBuf);
  const str = ab2str(stringArrayBuf);
  console.log('ab 2 string, ', str);

  makeTitle('实例属性方法');
  // buffer， 返回该TypedArray的arrayBuffer
  const a = new Float32Array(1);
  const b = new Uint8Array(a.buffer);
  console.log(b);

  // length and byteLength
  const aa = new Int16Array(8);
  console.log(aa.length); // 8
  console.log(aa.byteLength); // 16

  // set 用于复制数组
  const a1 = new Uint8Array([1, 2, 3]);
  console.log(a1); // 1,2,3
  const a2 = new Uint8Array(3);
  console.log(a2); // 0 0 0
  a2.set(a1);
  console.log(a2); // 1,2,3
  const a3 = new Uint8Array(4);
  console.log(a3); // 0 ,0
  a3.set(a1, 1);
  console.log(a3); // 0,1,2,3

  // subarray 创建新的视图， 注意是基于同一个arrayBuffer
  // 如果用slice，就不会是基于通一个arrayBuffer，而是创建一个新的
  const buf2 = new ArrayBuffer(8);
  const u16 = new Uint16Array(buf2);
  const u16_sub = u16.subarray(0, 2);
  const u16_slice = u16.slice(0, 2);
  console.log(u16); // 0 0 0 0
  console.log(u16_sub); // 0 0
  console.log(u16_slice); // 0 0
  u16[0] = 1;
  console.log(u16); // 1 0 0 0
  console.log(u16_sub); // 1 0
  console.log(u16_slice); // 0 0

  makeTitle('静态属性和方法');
  // of
  const x = Float32Array.of(0.151, -8, 3.7);
  console.log(x);
  // from
  const x2 = Int8Array.from([1, 2, 3]);
  console.log(x2);
})();

// 复合视图
(() => {
  // 符合视图
  const buf = new ArrayBuffer(24); // 24位
  // 用buf的1-4位 创建一个Uint32Array视图
  const idView = new Uint32Array(buf, 0, 1);
  console.log(idView);
  // buf的5-20位创建一个Uint8Array视图
  const usernameView = new Uint8Array(buf, 4, 16);
  console.log(usernameView);
  // buf的21-24位创建一个Float32Array视图
  const amountDueView = new Float32Array(buf, 20, 1);
  console.log(amountDueView);
  idView[0] = 1;
  usernameView[0] = 1;
  amountDueView[0] = 1;
  console.log(buf);
})();

// dataView 视图
(() => {
  makeTitle('dataView 视图');
  // 构造函数
  const buf = new ArrayBuffer(16);
  const dv = new DataView(buf);

  // 读取内存
  // 读取最后4个字节
  console.log(dv.getInt32(12));
  // 读取最开始的两个字节
  console.log(dv.getInt16(0));

  // 写入内存
  dv.setInt32(0, 16, true);
  console.log(dv.getInt32(0, true));
  console.log(buf);
  console.log(new Int32Array(buf));
})();
