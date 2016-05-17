
/**
 * Created by way on 5/12/16.
 */

import Router from 'koa-router';
import userRouter from './user';

// import {checkLogined} from '../logic/user';
// import { upload } from './modules/stores';

const rt = new Router();

// router.use('/user', userRouter.routes());
// router.post('/upload', checkLogined, upload);

// 首页
rt.get('/', ctx => {
  // console.log('sid:%s', ctx.sessionStorage.);
  // ctx.render('index', { title: 'pai!' });
  // ctx.render( 'h1 Hello, #{title} #{name}', { name: 'Jade!' }, { fromString: true }, false);
  ctx.render('motherday', { titel: '感恩母亲' });
});

// 用户子路由处理
rt.use('/user', userRouter.routes());

export default rt;