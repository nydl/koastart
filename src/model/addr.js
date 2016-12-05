/**
 * Created by Administrator on 2016/5/11.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var log4js = require('log4js')
    , log = log4js.getLogger('ALL'); //log日志
var tableName = 'addr';

// 地址表模版
var  addrSchema = new Schema({  
  pid: { type: String, required: true}    // 买家用户id，对于 user表的pid
  ,wxid: String // 买家微信openid
  ,sid: Number // 买家城邦id
  ,uid: Number // 买家单位 Id，自增长索引，可选

  ,name: String   // 收货人姓名
  ,mobile: String // 收货人手机
  ,phone: String  // 收货人电话
  ,address: String// 详细收货地址
  
  ,province: String // 省
  ,city: String // 市
  ,district: String // 区
  ,addr: String   // 不包括城市、区的简约收货地址  
  ,postcode: String//邮政编码
  
  ,status: Number  // 状态 1有效 2缺省 3删除 4无效 
  ,notes: String   // 备注
  
  ,lastTime: Date  // 最近使用时间
  
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
mongoose.model('Addr', orderSchema);
module.exports = function (conn) {
  return (conn || mongoose).model('Addr')
}
