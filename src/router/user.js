/**
 * Created by way on 16/5/14.
 */

import Router from 'koa-router';

const rt = new Router();

// 用户页面
rt.get('/reg', reg);
rt.post('/reg', user.regrsp);
rt.get('/users', user.list );

// 用户接口

// 手机、邮箱 是否重复
rt.get('/dup', user.dup);
// 注册用户，post
rt.post('/api/reg', user.reg);
// 更新用户信息
rt.post('/api/up', user.up);
// 获取用户信息，get
rt.get('/api/get', user.get);
// 通过tag获取用户信息
rt.get('/api/tag', user.tag);
// 校验身份
rt.get('/api/auth', user.auth);
