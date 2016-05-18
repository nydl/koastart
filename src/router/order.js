/**
 * Created by way on 16/5/18.
 */

import Router from 'koa-router';
//import user from '../base/user';
const log = require('log4js').getLogger('route/user');

const rt = new Router();

// 首页
rt.get('/', ctx => {
  const odr = {
    no: '3434535345',
    name: '红心火龙果（大果）',
    price: 18,
    shipFee: 0,
    status: '已发货',
    shipNem: '李莉',
    addTime: '2016-05-18 16:48'
  }
  ctx.render('order/order', odr);
});

export default rt;
