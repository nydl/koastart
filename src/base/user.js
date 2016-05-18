/**
 * Created by way on 16/5/14.
 */

//import userM from '../model/user';
//const cfg = require('../../config/app.js');
//const util = require('util');
//const crypto = require('crypto');
//const log = parent.log; // 所有引用该模块的 模块，必须 输出 log，否则 log无法工作！*/
//const _ = require('underscore');
//const parent = module.parent.exports;
//const tool = require('../utils/tool'),

import conn from '../model/db';
import userM from '../model/user';

const log = require('log4js').getLogger('user');

export default class User {

  // 静态属性
  // 类别 0：个人 1：会员 2：群组，群组依附于会员存在 3: 订阅
  // 4: 公众，包括 个人、媒体、企业等需社会化营销的用户 5: 企业
  static types = {
    person: 0,
    vip: 1,
    group: 2,
    sub: 3,
    pub: 4,
    corp: 5
  }

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
   *  @param cb
   */
  static newPid(cb) {
    // 随机生成 八位 pai号
    let pid = _.random(99999999); // Math.floor(Math.random() * 99999999);
    // 推广期，排除4，
    while (pid.toString().indexOf('4') > -1)
      pid = _.random(10000000, 99999999);

    // 手机、邮箱必须唯一
    User.model.findOne({pid}, 'pid', (err, u) => {
      if (err)
      // error(err);
        cb(err, null);
      else if (!u)
      // log.info('newPid:%s', pid);
        cb(null, pid);
      else if (u)
      // log.warn('newPid:%s exists!', pid);
        process.nextTick(() => newPid(cb));
    });
  }

  /**
   * 用户注册
   * @param u
   * @returns {null}
   */
  static reg(user) {
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
      UserM.findOne(cdt, 'pid', (err, u) => {
        if (err) {
          log.error(err);
          return util.format('{"act":"user.reg", "rc":500, "mobile":"%s", "err":"%s"}',
            user.mobile, err.message);
        } else if (u)
          return util.format('{"act":"user.reg", "rc":403, "mobile":"%s", "err":"用户存在！"}', u.mobile);
        else if (!u) {
          // 随机生成 八位 pai号
          newPid((err2, pid) => {
            if (err2)
              return util.format('{"act":"user.reg", "rc":500, "mobile":"%s", "err":"%s"}',
                user.mobile, err.message);
            else if (pid) {
              User.create(user, (err3, u2) => {
                if (err3) {
                  log.error(err);
                  return util.format('{"act":"user.reg", "rc":500, "pid":"%s", "mobile":"%s", "email":"%s", ' +
                    '"err":"%s"}', pid, user.mobile, user.email, err.message);
                }

                log.trace('regUser user:%s', JSON.stringify(u2));
                return util.format('{"act":"user.reg", "rc":200, "pid":"%s", "mobile":"%s", "email":"%s"}',
                  pid, user.mobile, user.email);
              });
            }
          });
        }
      });
    } catch (e) {
      log.error('user.reg exp:%s', e.message);
    }
  }

}
