/**
 * Created by way on 16/5/16.
 * StringBuffer
 * 频繁字符串操作时，效率非常高
 */

import {format} from './tool';

export default class StringBuffer {
  constructor() {
    this.buf = [];
  }

  append(str, ...args) {
    if (args.length > 1)
      this.buf.push(format(str, ...args)); // 参数传递
    else
      this.buf.push(String(str));
  }

  insert(str, ...args) {
    if (args.length > 1)
      this.buf.unshift(format(str, ...args)); // 参数传递
    else
      this.buf.unshift(String(str));
  }

  pop() {
    this.buf.pop();
  }

  toString() {
    return this.buf.join('');
  }
}
