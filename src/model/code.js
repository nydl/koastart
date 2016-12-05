/**
 * Created by Administrator on 2016/5/11.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var log4js = require('log4js')
    , log = log4js.getLogger('ALL'); //log日志
var tableName = 'code';

// 字典表模版
var  codeSchema = new Schema({  
  no: { type: Number, required: true} // 编号 
  ,pid: { type: String, required: true}// 用户pid，对于 user表的pid
  ,sid: Number // 城邦id
  ,uid: Number // 单位 Id，自增长索引，可选

  ,type: String   // 分类 
  ,group: String  // 分组 
  ,name: String   // 名称
  ,value: String  // 值
  ,desc: String   // 描述
  
  ,status: Number  // 状态 0待定 1有效 2审核 3删除 4无效 
  ,notes: String   // 备注
  ,showSeq: Number // 显示顺序 
  
  ,addUser: String // 创建用户
  ,addTime: {type: Date, default: Date.now} // 创建时间

  ,upUser: String // 更新用户
  ,upTime: Date     // 更新时间
});

// 通过 require db.conn 来返回指定的数据库 User 模型
mongoose.model('Code', orderSchema);
module.exports = function (conn) {
  return (conn || mongoose).model('Code')
}
