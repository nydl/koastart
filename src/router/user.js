/**
 * Created by way on 16/5/14.
 * 用户相关子路由
 */

import Router from 'koa-router';
//import user from '../base/user';

const rt = new Router();

rt.get('/reg', ctx => {
  console.log('enter user/reg page.');
  ctx.render('h1 你好, 欢迎进入#{route}页面!', { route: '用户注册' }, { fromString: true }, false);
});

export default rt;

// 用户页面
// rt.get('/reg', reg);
//rt.post('/api/reg', user.reg);

/*
rt.post('/reg', user.regrsp);
rt.get('/users', user.list );

// 用户接口

// 注册用户，post
rt.post('/api/reg', user.reg);
// 手机、邮箱 是否重复
rt.get('/api/dup', user.dup);
// 更新用户信息
rt.post('/api/up', user.up);
// 获取用户信息，get
rt.get('/api/get', user.get);
// 通过tag获取用户信息
rt.get('/api/tag', user.tag);
// 校验身份
rt.get('/api/auth', user.auth);
*/
