/**
 * Created by Administrator on 2015/11/15.
 */

// Schema ： 一种以文件形式存储的数据库模型骨架，不具备数据库的操作能力，相当于数据表的定义
// Model  ： 由Schema发布生成的模型对象，具有抽象属性和行为的数据库操作，相当于类及静态方法
// Entity ： 由new Model创建的实体，操作也会影响数据库，更多是单个 对象实例进行操作

// 使用 模型
//var conn = require('../models/db').conn
//  , User = require('../models/user')(conn)
var mongoDemo = require('../utils/mongoDemo');
var parent = module.parent.exports;
var log = exports.log = parent.log;
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

/**
 * 微信二维码模型定义，用于微信营销。
 * 城邦与单位类似，是个多层组织架构，城邦有子城邦（附属）及子子城邦，
 * 每个城邦里面有门派，门派就是 unit，
 */
var goodsQrSchema = Schema({
  sid: Number //城邦id
  , pid: {type: String, required: true}    // pai用户id
  , wxUserId: String  // 微信用户id
  , goodsId: String  //商品id
  , sceneId: String   //二维码场景值
  , ticket: String    // 二维码编号
  , isOwn: String     //是否是发布人  1是  0不是
  , qrLeft: String    //海报的二维码左间距
  , qrTop: String     //海报的二维码上间距
  , qrSize: Number    //海报二维码大小
  , shareLeft: String   //海报分享语的左间距
  , shareTop: String    //海报分享语的上间距
  , shareHeight: Number       //海报分享语的高度
  , timestamp: Number // 时间戳
  , crTime: {type: Date, default: Date.now}  // 创建时间
  , upTime: {type: Date}  // 更新时间
});

// 直接返回 goodsQr 模型
// module.exports = mongoose.model('goodsQr', goodsQrSchema);

// 通过 require db.conn 来返回指定的数据库 goodsQr 模型
mongoose.model('goodsQr', goodsQrSchema);
module.exports = function (conn) {
  return (conn || mongoose).model('goodsQr')
};
//插入数据
function goodsQrInsert(data, cb) {
  console.log("data:" + data + ",this.data" + this.data);
  if (!data) {
    data = this.data;
  }
  mongoDemo.createData('goodsQr', goodsQrSchema, data
    , function (result) {
      console.log("goodsQr插入结果：" + result);
      cb(result);
    }
  );
}

function goodsQrUpdate(criteria, result, cb) {
  mongoDemo.updateOne('goodsQr', goodsQrSchema, criteria, result, function (data) {
    cb(data);
  })
}

function goodsSearchOne(criteria, cb) {
  mongoDemo.searchOne('goodsQr', goodsQrSchema, criteria, function (obj) {
    cb(obj);
  })
}

//通过ticket查找wxid
function goodsQrSearchWxId(ticket, callback, needFields) {
  console.log('通过ticket查找wxid：' + ticket);
  var tickets = JSON.stringify(ticket);
  var ticketss = JSON.parse(tickets);
  var criteria = {"ticket": ticketss};
  console.log('wxqrSearchWxIdJSON转换后的值' + criteria.ticket);
  mongoDemo.searchByCondition('goodsQr', goodsQrSchema, criteria, function (data) {
    log.info("wxqrSearchWxId查询到了结果:" + data);
    if (data.length > 0) {
      //callback(data[0]);
      var data1 = data[0];
      log.info("data1的值：" + data1);
      var wxUserId = data1['wxUserId'];
      log.info("wxUserId:" + wxUserId);
      log.info("data1数据类型：" + typeof(data1) + "," + data1 + "," + wxUserId);
      if (data1) {
        log.info("wxUserId " + wxUserId);
        callback(data[0]);
      }
    } else {
      callback(undefined);
    }
  });
}

/**
 * Data generation
 */
function createData() {
  var conn = require('./db').conn
    , goodsQr = conn.model('goodsQr');

  goodsQr.create({
    sid: 1
    , pid: '74029353'    // pai用户id
    , wxUserId: 'jskdjfksjdug8979oisdjff'  // 微信用户id
    , ticket: 'sidfjhsdjfjsf87w908fjhigfkdjgldsjgoewru9g8rg'    // 二维码编号
    , timestamp: 1287653928 // 时间戳
  }, function (err, u) {
    if (err) return done(err);
    else
      console.log('create data!');
  })
}

/**
 * Population
 */

  //createData();
module.exports.goodsQrInsert = goodsQrInsert;
module.exports.goodsQrSearchWxId = goodsQrSearchWxId;
module.exports.goodsQrUpdate = goodsQrUpdate;
module.exports.goodsSearchOne = goodsSearchOne;