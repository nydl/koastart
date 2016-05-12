/**
 * Created by way on 16/5/10.
 */

import Koa from 'koa';
import { staticFile } from './utils/tool';

import Pug from 'koa-pug';

const app = new Koa();

// 静态文件服务
app.use(staticFile('./public'));

// jade 模板
const pug = new Pug({
  app, // equals to pug.use(app) and app.use(pug.middleware)
  viewPath: './view',
  debug: process.env.NODE_ENV === 'development' });

app.use(ctx => {
  // ctx.render('index', locals_for_this_page, true);
  pug.locals.title = '感恩母亲';
  // ctx.render( 'h1 Hello, #{title} #{name}', { name: 'Jade!' }, { fromString: true }, false);
  ctx.render('motherday');
});

console.log('koa start on port 3000');

app.listen(3000);
