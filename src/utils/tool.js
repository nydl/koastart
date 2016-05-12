/**
 * Created by way on 16/5/11.
 */

'use strict';

import send from "koa-send";
import assert from "assert";
const resolve = require('path').resolve;

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

