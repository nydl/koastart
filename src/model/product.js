/**
 * Created by Administrator on 2016/5/12.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var log4js = require('log4js')
    , log = log4js.getLogger('ALL'); //log日志
var tableName = 'product';

// 产品表模版
var productSchema = new Schema({
  no: { type: String, required: true, unique: true } // 产品编号，必须有值，必须唯一，重复无法插入

  ,name: { type: String, required: true }
  ,abbName: { type: String, required: true }

  ,cat: Number // 分类 //商品分类 10001、工具 10002、食品
  ,tag:[] // 标签
  
  ,pid: { type: String, required: true}  // 发布用户id，对于 user表的pid
  ,wxid: String // 微信openid
  ,sid: Number // 城邦id
  ,uid: Number // 单位 Id，自增长索引，可选

  ,listPrice: Number // 列表价格
  ,price: Number    // 销售价格
  ,agent: Number    // 分享奖励
  ,discount: Number // 折扣
  ,tax: Number   // 税费
  ,shipFee: Number // 运费
  ,buyType: Number //购买类型 1.10001 单独购 2.10002 成团购
  ,qty: Number      // 总数量
  ,storeQty: Number // 库存数量
  ,sellQty: Number  // 销售数量
  
  ,groupPrice: Number // 拼团价格
  ,groupAgent: Number // 分享成团每笔奖励
  ,groupShareAward: Number // 邀请参团奖励
  ,groupQty: Number   // 成团数量
  ,groupAward: Number // 拼团奖励
  
  ,action:[]  // 反馈数量： 喜欢、不喜欢、评论、分享、收藏、浏览
  ,point // 评分

  ,notes: String    // 备注
  
  ,addUserId: ObjectId // 创建用户, ObjectId 唯一，不可被修改！
  ,addPid: String // 创建用户
  ,addUser: String // 创建用户
  ,addTime: {type: Date, default: Date.now} // 创建时间

  ,upUserId: ObjectId // 更新用户
  ,upPid:  String // 更新用户
  ,upUser: String // 更新用户
  ,upTime: Date     // 更新时间
});

// 通过 require db.conn 来返回指定的数据库 User 模型
mongoose.model('Product', productSchema);
module.exports = function (conn) {
  return (conn || mongoose).model('Product')
}
