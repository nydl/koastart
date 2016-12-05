/**
 * Created by Administrator on 2016/5/11.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var log4js = require('log4js')
    , log = log4js.getLogger('ALL'); //log日志
var tableName = 'order';

// 订单模版
var orderSchema = new Schema({
  no: { type: String, required: true, unique: true }   // 订单号，必须有值，必须唯一，重复无法插入
  ,rno: String  // 第三方订单号
  ,wxno:{ type: String, required: true} //微信交易号
  
  ,pid: { type: String, required: true}    // 买家用户id，对于 user表的pid
  ,wxid: String // 买家微信openid
  ,sid: Number // 买家城邦id
  ,uid: Number // 买家单位 Id，自增长索引，可选
  
  ,sellPid: String  // 卖家用户id，对于 user表的pid
  ,sellWxid: String // 卖家微信openid
  ,sellUid: Number  // 卖家单位 Id，自增长索引，可选
  ,sellSeed: String // 卖家海报

  ,sharePid: String // 分享者
  ,shareWxid: String
  ,shareUid: Number  // 分享单位 Id，自增长索引，可选
  ,shareSeed: String // 分享海报

  ,productId: ObjectId // 产品ID
  ,productNo: String // 产品编号
  ,listPrice: Number // 列表价格
  ,price: Number // 购买价格
  ,discount: Number // 折扣
  ,tax: Number   // 税费
  ,shipFee: Number // 运费
  ,buyType: Number //购买类型 1.10001 单独购 2.10002 成团购，Product的SaleMode决定
  ,Qty: Number // 购买商品的数量
  ,cash: Number  // 实收现金
  ,coupon: Number // 抵用券
  ,amount: Number // 总金额 = cash + coupon
  ,payNo: String  // 支付流水号
  ,cashNo: String // 现金流水号，一般跟银行或第三方支付公司对应
  
  ,status: Number // 状态： 0取消 1新订单 2已支付 3卖家确认 4已发货 5已签收 6买家确认 7、已清算 8、关闭
  ,refund: Number // 退货：1申请 2受理 3通过 4关闭
  
  ,location: []   // 地理位置，经纬度
  ,addr: String   // 购买时地址 
  
  ,ship: String   // 物流信息 
  ,shipPid: String   // 收货人pid 
  ,shipName: String  // 收货人姓名
  ,shipPhone: String // 收货人电话
  ,shipAddr: String  // 收货地址
  
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
mongoose.model('Order', orderSchema);
module.exports = function (conn) {
  return (conn || mongoose).model('Order')
}
