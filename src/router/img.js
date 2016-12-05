/**
 * Created by way on 16/5/18.
 */

import Router from 'koa-router';
const img = require('../logic/pic');
// import user from '../base/user';
const log = require('log4js').getLogger('route/user');

const rt = new Router();

// 首页
rt.get('/', ctx => {
  img.makeQr('http://baidu.com', 'aa', '234', () => {
    console.log('makeQr ok!');
  });
});

export default rt;
