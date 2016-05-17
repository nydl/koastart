/**
 * Created by way on 16/5/14.
 */

import conn from '../model/db';
import userM from '../model/user';
const UserM = userM(conn);
const cfg = require('../../config/app.js');
const util = require('util');
const crypto = require('crypto');
const log = parent.log; // 所有引用该模块的 模块，必须 输出 log，否则 log无法工作！*/
const _ = require('underscore');
const parent = module.parent.exports;
// const tool = require('../utils/tool'),

