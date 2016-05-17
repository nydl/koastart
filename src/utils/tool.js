/**
 * Created by way on 13/5/18.
 * 工具类，node已经有个 util，因此 使用 tool名称，避免冲突
 */

import send from "koa-send";
import assert from "assert";
const resolve = require('path').resolve;
const parent = module.parent.exports // 谁引用utils，谁就是 parent
const crypto = require('crypto');
const util = require('util');
const _ = require('underscore');
const log = parent.log;   // 所有引用该模块的 模块，必须 输出 log，否则 log无法工作！

/*
  静态文件中间件
 */
export function staticFile(root, opts) {
  opts = opts || {};

  assert(root, 'root directory is required to serve files');

  // options
  //debug('static "%s" %j', root, opts);
  opts.root = resolve(root);

  if (opts.index !== false)
    opts.index = opts.index || 'index.html';

  return async (ctx, next)=>{
    console.log(ctx.url, ctx.path, opts.root, ctx.request.body);

    if (ctx.method == 'HEAD' || ctx.method == 'GET') {
      if (await send(ctx, ctx.path, opts)) return;
    }
    await next();
  };
}


/**
 * 针对 get、post 参数 校验 签名，method缺省为 get
 * post 需对参数进行排序
 * 时刻的计算，请注意， 当前时刻与2000-1-1相减，两个要么都带时区，要么都不带时区，否则时刻会差 8小时！！！
 * js 客户端，需使用 '2000/1/1'，不能使用 '2000-1-1', 会多8小时！！！
 * @param pwd
 * @param req get 需 req，post 需 req.body 或 pack 对象
 * @returns {number} 1 ok 0 fail -1 过期
 */
export function checkSign(pwd, req, method) {
  var RC = 0;

  try {
    if ( !method || method == 'get') {
      var sign = req.query.sign    // 操作员密码签名
      var stamp = req.query.stamp; // 时标

      var url = decodeURI(req.originalUrl);
      url = url.substr(url.indexOf('?') + 1);
      url = url.slice(0, url.indexOf('&sign'));

      if (md5(url + pwd) == sign) {
        //if (md5(oper + acct + stamp + u.password) == sign) {
        // 一分钟有效！ 2000-01-01 是错误的，多了8个小时！  暂时分开，等 pai修正后再还原
        if (new Date().getTime() - Date.parse('2000/01/01') - parseInt(stamp) > 60000)
          RC = -1;
        else
          RC = 1;
      }
    }
    else if ( method == 'post') {
      var sign = req.sign    // 操作员密码签名
      var stamp = req.stamp; // 时标

      // 属性 放入 数组，方便排序
      var arr = [];
      for (var k in req) {
        if (req.hasOwnProperty(k) && k != "sign")
          arr.push(format('%s=%s', k, req[k]));
      }

      // 排序
      /*
       arr = _.sortBy(arr, function (v) {
       return v.k
       });
       */
      var para = arr.sort().join('&');

      // 验签 120 秒内有效，否则 过期
      if (md5(para + pwd) == sign) {
        if (new Date().getTime() - Date.parse('2000/01/01') - parseInt(stamp) > 120000)
          RC = -1;
        else
          RC = 1;
      }
    }
  }
  catch (e) {
    console.error('checkSign exp:' + e.message);
    if ( log )
      log.error('checkSign exp:' + e.message);
  }

  return RC;
}

export function trim(s) {
  return String(s).replace(/(^\s*)|(\s*$)/g, '');
}

/**
 * 去除字符串头部空格或指定字符
 */
export function trimStart(s, c) {
  if (!c)
    return String(s).replace(/(^\s*)/g, '');

  const rx = new RegExp(format('^%s*', c));
  return String(s).replace(rx, '');
}

/**
 * 去除字符串尾部空格或指定字符
 */
export function trimEnd(s, c) {
  if (!s)
    return '';

  if (!c)
    return String(s).replace(/(\s*$)/g, '');

  const rx = new RegExp(format('%s*$', c));
  return String(s).replace(rx, '');
}

// 扩展String，会导致全局污染，建议不要扩展！
/*
 if (!String.prototype.format) {
 Object.defineProperty(String.prototype, 'format', {
 value: function () {
 return format(this);
 },
 // 防止 for in 遍历时出现！
 enumerable: false
 });
 }
 */

/**
 * 格式化字符串，类似 node util中带的 format
 * @type {Function}
 */
export function format(f, ...args) {
  let i = 1;
  const len = args.length;
  const str = String(f).replace(/%[sdj%]/g, x => {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s':
        return String(args[i++]);
      case '%d':
        return Number(args[i++]);
      case '%j':
        return JSON.stringify(args[i++]);
      default:
        return x;
    }
  });

  return str;
}

export function md5(v) {
  return crypto.createHash('md5').update(v).digest('hex');
};


/**
 * 标准时区与当前时区的偏移量，单位毫秒
 * @type {Function}
 */
var tz = exports.tz = function tz() {
  return 0 - new Date().getTimezoneOffset() * 60000;
}

/**
 * 当前时区时间，不是GMT标准时区时间，谨慎使用，会与js内置Date不一致！
 * @type {Function}
 */
var now = exports.now = function now() {
  return new Date(Date.now() + tz);
}

/**
 * 统一转换为 / 分隔符，避免 2013-10-10 错误！
 * @type {Function}
 */
var date = exports.date = function date(d) {
  return d ? new Date(d.replace(/-/g, "/")) : null;
}
/**
 * js时间转换为指定字符串格式，由于字符串转换为Date时，会按时区加减时间
 * 实际js系统内的Date都是标准时间，标准时间转换为字符串时，需考虑还原时区，
 * 因此，字符串转换为 Date，再转换为字符串时，如果不考虑时区，时间是不对的！
 * 该函数自动将js Date标准时间，按时区还原为正确的字符串！
 * Date.toString() = Sat Aug 10 2013 11:41:24 GMT+0800 (中国标准时间)

 * 所有字符串日期、时间转换 js Date，都会自动减 8小时！
 * Date.getXXX 转换为数值时，自动加了 8 小时！
 * Date.getUTCXXX时，按原值转换格式，没有加 8 小时，请注意！
 * getTime() 是与 标准时间 1970 比较的！
 * toString 与 toUTCString 也是不一样的！
 * @param x
 * @param y "yyyy-MM-dd hh:mm:ss"
 * @returns {XML}
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * 例子：
 * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
var dateStr = exports.dateStr = function dateStr(x, y) {
  var rc = '';

  if (!x)
    return '';

  if (!y)
    y = "yyyy-MM-dd hh:mm:ss";

  if (typeof(x) === "string")
    x = new Date(x);

  // Date.getXXX 函数会自动还原时区！！！
  var z = {M: x.getMonth() + 1, d: x.getDate(), h: x.getHours(), m: x.getMinutes(), s: x.getSeconds(), S: x.getMilliseconds()};
  y = y.replace(/(M+|d+|h+|m+|s+|S+)/g, function (v) {
      return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1)) ).slice(-2)
    }
  );

  rc = y.replace(/(y+)/g, function (v) {
      return x.getFullYear().toString().slice(-v.length)
    } // yy几个就返回 几个数字，使用 slice -4 倒数4个，再往后
  );

  return trimEnd(rc, ' 00:00:00');
}

/**
 * mongodb 中的字段返回字符串，
 * mongodb只返回有值的字段，无值、不存在字段访问时，为undefined 未定义，会显示在界面上！
 * 如果 字段不存在或为null（无值），返回空字符串，而不是 undefined、null字符串！
 *
 * @type {Function}
 */
var dbStr = exports.dbStr = function dbStr(s) {
  if (typeof(s) == 'number' || typeof(s) == 'boolean')
    return s.toString();
  else
    return s ? s : '';  // null undefined 返回空
}

/**
 * 数组转换为字符串
 * @type {dbArr}
 */
var dbArr = exports.dbArr = function dbArr(a, t) {
  var RC = '';

  try {
    if (!a || a.length == 0)
      return '';

    if (t === undefined)
      t = ',';

    RC = trim(a.join(t));
  }
  catch (e) {

  }

  return RC;
}

/**
 * 对于整数字段，无值返回 0
 * @type {Function}
 */
var dbInt = exports.dbInt = function dbInt(v) {
  return v == null || v == undefined ? 0 : v;  // null undefined 返回空
}

/**
 * 对于整数字段，无值，0 则返回空，解析时需还原为0，节省空间！
 * @type {Function}
 */
var zeroEmpty = exports.zeroEmpty = function zeroEmpty(v) {
  return v == null || v == undefined || v == 0 ? '' : v.toString();  // null undefined 返回空
}

/**
 * Queue flash `msg` of the given `type`.
 *
 * Examples:
 *
 *      req.flash('info', 'email sent');
 *      req.flash('error', 'email delivery failed');
 *      req.flash('info', 'email re-sent');
 *      // => 2
 *
 *      req.flash('info');
 *      // => ['email sent', 'email re-sent']
 *
 *      req.flash('info');
 *      // => []
 *
 *      req.flash();
 *      // => { error: ['email delivery failed'], info: [] }
 *
 * Formatting:
 *
 * Flash notifications also support arbitrary formatting support.
 * For example you may pass variable arguments to `req.flash()`
 * and use the %s specifier to be replaced by the associated argument:
 *
 *     req.flash('info', 'email has been sent to %s.', userName);
 *
 * Formatting uses `util.format()`, which is available on Node 0.6+.
 *
 * @param {String} type
 * @param {String} msg
 * @return {Array|Object|Number}
 * @api public
 */
var flash = exports.flash = function flash(type, msg) {
  if (this.session === undefined)
    throw Error('req.flash() requires sessions');

  var msgs = this.session.flash = this.session.flash || {};

  // 按类别写入提示消息
  if (type && msg) {
    // 格式化
    if (arguments.length > 2) {
      // 获取后面的参数
      //var args = arguments.slice(1); //Array.prototype.slice.call(arguments, 1);
      var args = [].slice.call(arguments, 1);
      msg = util.format.apply(undefined, args);
    }
    else if (util.isArray(msg)) {
      msg.forEach(function (val) {
        (msgs[type] = msgs[type] || []).push(val);
      });

      return msgs[type].length;
    }
    return (msgs[type] = msgs[type] || []).push(msg);
  }
  // render 时，显示提示消息，只显示一次，因此需从session中删除该消息
  else if (type) {
    var arr = msgs[type];
    delete msgs[type];
    // 返回该类别消息数组，客户端 合并显示！
    return arr || [];
  }
  // 不带类别，则显示所有消息！
  else {
    this.session.flash = {};
    return msgs;
  }
}


/**
 * base64编码
 * @param arg
 * @returns {*}
 */
function base64urlencode(arg) {
  var s = arg.toString('base64');
  s = s.split('=')[0]; // Remove any trailing '='s
  s = s.replace(/\+/g, '-'); // 62nd char of encoding
  s = s.replace(/\//g, '_'); // 63rd char of encoding
  // TODO optimize this; we can do much better
  return s;
}

/**
 * base64解码
 * @param arg
 * @returns {Buffer}
 */
function base64urldecode(arg) {
  var s = arg;
  s = s.replace(/-/g, '+'); // 62nd char of encoding
  s = s.replace(/_/g, '/'); // 63rd char of encoding
  switch (s.length % 4) // Pad with trailing '='s
  {
    case 0:
      break; // No pad chars in this case
    case 2:
      s += "==";
      break; // Two pad chars
    case 3:
      s += "=";
      break; // One pad char
    default:
      throw new Error("Illegal base64url string!");
  }
  return new Buffer(s, 'base64'); // Standard base64 decoder
}

function deriveKey(master, type) {
  // eventually we want to use HKDF. For now we'll do something simpler.
  var hmac = crypto.createHmac('sha256', master);
  hmac.update(type);
  return hmac.digest('binary');
}

function constantTimeEquals(a, b) {
  // Ideally this would be a native function, so it's less sensitive to how the
  // JS engine might optimize.
  if (a.length != b.length)
    return false;
  var ret = 0;
  for (var i = 0; i < a.length; i++) {
    ret |= a.readUInt8(i) ^ b.readUInt8(i);
  }
  return ret == 0;
}


/**
 * 加密
 * @param opts
 * @param content
 * @param duration
 * @param createdAt
 * @returns {string}
 */
function encode(opts, content, duration, createdAt) {
  // format will be:
  // iv.ciphertext.createdAt.duration.hmac

  if (!opts.cookieName) {
    throw new Error('cookieName option required');
  } else if (String(opts.cookieName).indexOf(COOKIE_NAME_SEP) != -1) {
    throw new Error('cookieName cannot include "="');
  }

  if (!opts.encryptionKey) {
    opts['encryptionKey'] = deriveKey(opts.secret, 'cookiesession-encryption');
  }

  if (!opts.signatureKey) {
    opts['signatureKey'] = deriveKey(opts.secret, 'cookiesession-signature');
  }

  duration = duration || 24 * 60 * 60 * 1000;
  createdAt = createdAt || new Date().getTime();

  // generate iv
  var iv = crypto.randomBytes(16);

  // encrypt with encryption key
  var plaintext = opts.cookieName + COOKIE_NAME_SEP + JSON.stringify(content);
  var cipher = crypto.createCipheriv('aes256', opts.encryptionKey, iv);
  var ciphertext = cipher.update(plaintext, 'utf8', 'binary');
  ciphertext += cipher.final('binary');
  // Before 0.10, crypto returns binary-encoded strings. Remove when
  // dropping 0.8 support.
  ciphertext = new Buffer(ciphertext, 'binary');

  // hmac it
  var hmacAlg = crypto.createHmac('sha256', opts.signatureKey);
  hmacAlg.update(iv);
  hmacAlg.update(".");
  hmacAlg.update(ciphertext);
  hmacAlg.update(".");
  hmacAlg.update(createdAt.toString());
  hmacAlg.update(".");
  hmacAlg.update(duration.toString());

  var hmac = hmacAlg.digest();
  // Before 0.10, crypto returns binary-encoded strings. Remove when
  // dropping 0.8 support.
  hmac = new Buffer(hmac, 'binary');

  return base64urlencode(iv) + "." + base64urlencode(ciphertext) + "." + createdAt + "." + duration + "." + base64urlencode(hmac);
}


/**
 * 解密
 * @param opts 选项
 * @param content 内容
 * @returns {{content: *, createdAt: Number, duration: Number}}
 */
function decode(opts, content) {

  // stop at any time if there's an issue
  var components = content.split(".");
  if (components.length != 5)
    return;

  if (!opts.cookieName) {
    throw new Error("cookieName option required");
  }

  if (!opts.encryptionKey) {
    opts['encryptionKey'] = deriveKey(opts.secret, 'cookiesession-encryption');
  }

  if (!opts.signatureKey) {
    opts['signatureKey'] = deriveKey(opts.secret, 'cookiesession-signature');
  }

  var iv = base64urldecode(components[0]);
  var ciphertext = base64urldecode(components[1]);
  var createdAt = parseInt(components[2], 10);
  var duration = parseInt(components[3], 10);
  var hmac = base64urldecode(components[4]);

  // make sure IV is right length
  if (iv.length != 16)
    return;

  // check hmac
  var hmacAlg = crypto.createHmac('sha256', opts.signatureKey);
  hmacAlg.update(iv);
  hmacAlg.update(".");
  hmacAlg.update(ciphertext);
  hmacAlg.update(".");
  hmacAlg.update(createdAt.toString());
  hmacAlg.update(".");
  hmacAlg.update(duration.toString());

  var expected_hmac = hmacAlg.digest();
  // Before 0.10, crypto returns binary-encoded strings. Remove when
  // dropping 0.8 support.
  expected_hmac = new Buffer(expected_hmac, 'binary');

  if (!constantTimeEquals(hmac, expected_hmac))
    return;

  // decrypt
  var cipher = crypto.createDecipheriv('aes256', opts.encryptionKey, iv);
  var plaintext = cipher.update(ciphertext, 'binary', 'utf8');
  plaintext += cipher.final('utf8');

  var cookieName = plaintext.substring(0, plaintext.indexOf(COOKIE_NAME_SEP));
  if (cookieName !== opts.cookieName) {
    return;
  }

  try {
    return {
      content: JSON.parse(plaintext.substring(plaintext.indexOf(COOKIE_NAME_SEP) + 1)),
      createdAt: createdAt,
      duration: duration
    };
  } catch (x) {
    return;
  }
}
