/**
 * Created by way on 16/5/10.
 */

import Koa from 'koa'; // koa web 服务框架
import bodyParser from 'koa-bodyparser'; // 上传内容解析
// import StatusError from './utils/StatusError';
import router from './router'; // 该路径下的 index.js
import { staticFile } from './utils/tool';
import Pug from 'koa-pug'; // jade 模板

const app = new Koa();

export default app;

app.use(bodyParser());

// 静态文件服务
app.use(staticFile('./public'));

// jade 模板
const pug = new Pug({
  app, // equals to pug.use(app) and app.use(pug.middleware)
  viewPath: './view',
  debug: process.env.NODE_ENV === 'development' });


console.log('koa start on port 3000');

// 加载路由中间件,处理路由匹配,无法匹配的,回到静态文件处理,静态文件找不到的,返回不存在错误!
app.use(router.routes());

// app.use(() => Promise.reject(new StatusError(404, 'Invalid API')));

app.listen(3000);

