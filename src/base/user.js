/**
 * Created by way on 16/5/14.
 */

//import userM from '../model/user';
//const cfg = require('../../config/app.js');
const util = require('util');
//const crypto = require('crypto');
//const log = parent.log; // 所有引用该模块的 模块，必须 输出 log，否则 log无法工作！*/
const _ = require('underscore');
//const parent = module.parent.exports;

import conn from '../model/db';
import userM from '../model/user';

const log = require('log4js').getLogger('base/user');

export default class User {

  /**
   * 类别 0：个人 1：会员 2：群组，群组依附于会员存在 3: 订阅
   * 4: 公众，包括 个人、媒体、企业等需社会化营销的用户 5: 企业
   * @type {{person: number, vip: number, group: number, sub: number, pub: number, corp: number}}
   */
  static types = {
    person: 0,
    vip: 1,
    group: 2,
    sub: 3,
    pub: 4,
    corp: 5
  };

  // 构造函数,实例赋值一般放在这里
  constructor() {
  }

  // 属性存取器,获取数据模型
  static get model() {
    return userM(conn);
  }

  static getModel() {
    return userM(conn);
  }

  /**
   *  使用迭代生成数据库中不存在的pid
   */
  static _newPidCnt = 0;
  static async newPid() {
    // 随机生成 八位 pai号
    let pid = _.random(10000000, 99999999); // Math.floor(Math.random() * 99999999);
    /*
     // 推广期，排除4，
     while (pid.toString().indexOf('4') > -1) {
     log.debug('pid:' + pid);
     pid = _.random(10000000, 99999999);
     }
     */

    // log.debug('new pid:' + pid);
    // 手机、邮箱必须唯一
    // let rs = await User.model('user').where({pid}).find();
    // pid = '88880001';
    const rs = await User.model.findOne({pid}, 'pid').exec();
    // log.error('await. rs:' + rs);
    if (rs) {
      User._newPidCnt ++;
      log.warn('newPid:%s exists! try:%d', pid, User._newPidCnt);
      pid = await newPid();
/*
      if (i < 2)
         pid = await process.nextTick(() => newPid());
      else
        return '';
*/
    }

    return pid;
  }

  /**
   * 用户注册
   * @param user
   * @returns {null}
   */
  static async reg(user) {
    let rt = null;
    let pid = '';

    try {
      if (!user.mobile)
        return null;

      let cdt = null;
      if (user.email) {
        cdt = {
          $or: [{
            mobile: user.mobile
          }, {
            email: user.email
          }]
        };
      } else {
        cdt = {
          mobile: user.mobile
        };
      }

      // 手机、邮箱必须唯一
      // UserM.findOne(cdt, 'pid', (err, u) => {
      const rs = await User.model.findOne(cdt, 'pid').exec();
      if (rs)
        rt = util.format('{"act":"user.reg", "rc":403, "mobile":"%s", "err":"用户存在！"}', rs.mobile);
      else {
        // 随机生成 八位 pai号
        pid = await User.newPid();
        if (pid) {
          user.pid = pid;
          const us = await User.model.create(user);

          if (us) {
            log.trace('regUser user:%s', JSON.stringify(us));
            rt = util.format('{"act":"user.reg", "rc":200, "pid":"%s", "mobile":"%s", "email":"%s"}',
              pid, us.mobile, us.email);
          }
        }
      }
    } catch (e) {
      log.error('user.reg exp:%s', e.message);
      rt = util.format('{"act":"user.reg", "rc":500, "pid":"%s", "mobile":"%s", "email":"%s", ' +
        '"err":"%s"}', pid, user.mobile, user.email, err.message);
    }

    log.debug('user.reg rc:%s', rt);

    return rt;
  }
}


function test() {
  let rt = null;

  try {
    // 随机生成 八位 pai号
/*
    const pid = await User.newPid();
    if (pid) {
      log.debug('new pid:%s', pid);
    } else
      log.error('test failed!');
*/

    const us = {
      name: 'test',
      showName: 'test',
      Sex: '男',
      mobile: '13900000008',
      unitNo: '0086.11112222',
      status: 1,
      upTime: new Date('2016/05/16 23:00:00')
    };

    rt = User.reg(us);
  } catch (e) {
    log.error('test exp:%s', e.message);
  }

  return rt;
}

// console.log(test());
