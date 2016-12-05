/**
 * Created by way on 16/5/10.
 */

import Koa from 'koa'; // koa web 服务框架
import bodyParser from 'koa-bodyparser'; // 上传内容解析
import StatusError from './utils/errcode';
import router from './router'; // 该路径下的 index.js
import { staticFile } from './utils/tool';
import Pug from 'koa-pug'; // jade 模板
import cfg from '../config/app.js';

const util = require('util');
const formidable = require('formidable');
// const multer = require('koa-multer');
import multer from 'multer';
// 接受 formdata
const Busboy = require('busboy');

const Router = require('koa-router');
const route = new Router();

const log = require('log4js').getLogger('app');

const app = new Koa();
export default app;

/*
const upload = multer({ dest: 'uploads/' });
//app.use(async (ctx, next) => {
app.use(upload.any(), async ctx => {
  if (ctx.url === '/upload' && ctx.method.toLowerCase() === 'post') {
    //await upload.any();
    ctx.body = 'ok!';
  }
  else
    await next();
});
*/


/*
const upload = multer({ dest: 'uploads/'});
route.post('/upload', upload.single('8'), () => {
  app.ctx.body = 'ok!';
});
*/

// 上传数据解析,包括post、get的参数,二进制文件（raw属性）传输等的自动解析到指定对应变量!
app.use(bodyParser());

// 静态文件服务
app.use(staticFile('./public'));

// multipart/form-data 数据接收测试！

app.use(async (ctx, next) => {
  // parse a file upload
  if (ctx.url === '/save' && ctx.method.toLowerCase() === 'post') {
    // parse a file upload
    const busboy = new Busboy({headers: ctx.req.headers});
    const pform = () => {
      return new Promise((resolve, reject) => {
        // koa 只接受 promise 中间件,因此需将普通回调中间件封装为 promise
        const fds = [];
        busboy.on('field', (nam, val) => {
          fds.push([nam, val]);
        });
        busboy.on('finish', () => {
          // ctx.res.writeHead(303, { Connection: 'close', Location: '/' });
          // ctx.res.end();
          resolve(fds);
        });
        ctx.req.pipe(busboy);
      });
    };

    const fields = await pform();
    ctx.body = 'received save:\n\n'
      + util.inspect({fields});

    console.log(ctx.body);
  } else
    next();
});

/* multer 不行!
app.use(async (ctx, next) => {
  console.log('save headers:' + util.inspect(ctx.headers));

  if (ctx.url === '/save' && ctx.method.toLowerCase() === 'post') {
    const mu = multer().array();
    const pmu = () => {
      return new Promise((resolve, reject) => {
        // koa 只接受 promise 中间件,因此需将普通回调中间件封装为 promise
        mu(ctx.req, ctx.res, err => {
          if (err)
            reject(err);
          else
            resolve();
        });
      });
    };
    await pmu();
    console.log('save body:' + util.inspect(ctx.body));
  } else
    next();
});
*/

/* formidable 不行,只返回最后一个重名字段!
app.use(async (ctx, next) => {
  console.log('save header:' + util.inspect(ctx.headers));

  // parse a file upload
  if (ctx.url === '/save' && ctx.method.toLowerCase() === 'post') {
    // parse a file upload
    const form = new formidable.IncomingForm();
    form.encoding = 'utf-8';

    const pform = ( ) => {
      return new Promise((resolve, reject) => {
        // koa 只接受 promise 中间件,因此需将普通回调中间件封装为 promise
        form.parse(ctx.req, (err, fields, files) => {
          if (err)
            reject(err);
          else {
            resolve(fields);
          }
        });
      });
    };

    const fields = await pform();
    ctx.body = 'received save:\n\n'
      + util.inspect({fields: fields});

    console.log(ctx.body);
  } else
    next();
});
*/

// jade 模板
const pug = new Pug({
  app, // equals to pug.use(app) and app.use(pug.middleware)
  viewPath: './view',
  debug: process.env.NODE_ENV === 'development' });

// 加载路由中间件,处理路由匹配,无法匹配的,回到静态文件处理,静态文件找不到的,返回不存在错误!
app.use(router.routes());

// 没有被其它中间件处理的请求,在这里处理,Promise 会抛出 堆栈异常,改为直接提示!
// app.use(() => Promise.reject(new StatusError(404, 'Invalid API')));
/*
app.use(ctx => {
  const ms = 3; // new Date() - start;
  log.error(`Invalid Request: ${ctx.method} ${ctx.url} - ${ms}ms`);
});
*/
