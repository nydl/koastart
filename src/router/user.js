/**
 * Created by way on 16/5/14.
 * 用户相关子路由
 */

import Router from 'koa-router';
import User from '../base/user';
const log = require('log4js').getLogger('route/user');

const rt = new Router();

rt.get('/reg', ctx => {
  log.warn('enter user/reg page.');
  ctx.render('h1 Hello#{name}!', { name: 'user reg！' }, { fromString: true }, false);
});

export default rt;

// 用户页面
// rt.get('/reg', reg);

rt.post('/api/reg', ctx => {
  console.log(JSON.stringify(ctx.request.body));

  const {name, pwd, type, mobile, nick, email, sex, unitNo, rid, from} = ctx.request.body;

  const us = {
    name, password: pwd, // md5
    type: type || 1, mobile, status: 0  // 待定
  };

  if (nick)
    us.nick = nick;

  // 稀疏索引，不能 null、空，如果去掉，必须使用 unset！
  if (email)
    us.email = email;

  if (sex)
    us.sex = sex;

  if (unitNo)
    us.unitNo = unitNo;

  if (rid)
    us.rid = rid;

  if (from)
    us.from = from;

  console.log(JSON.stringify(us));
  User.reg(us);
});

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
