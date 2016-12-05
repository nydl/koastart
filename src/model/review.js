/**
 * Created by Administrator on 2016/5/11.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var log4js = require('log4js')
    , log = log4js.getLogger('ALL'); //log日志
var tableName = 'review';

// 评论表模版
var  reviewSchema = new Schema({  
  cat: Number   // 分类：产品 用户 活动 话题
  ,type: Number // 类别：赞、踩、评论
  ,pid: { type: String, required: true}// 用户pid，对于 user表的pid
  ,name: String   // 名称
  ,icon: String   // 图标
  ,content: String // 内容    
  ,status: Number  // 状态 0待定 1有效 2审核 3删除 4无效
  ,action:[]  // 评论本身的反馈数量： 赞、踩、评、看
  
  ,giftId: ObjectId // 送礼物
  ,addUserId: ObjectId // 创建用户, ObjectId 唯一，不可被修改！
  ,addTime: {type: Date, default: Date.now} // 创建时间
  
  ,toId: ObjectId // 评论对象，一个对象只能点赞一次，可以评论多次
});

// 通过 require db.conn 来返回指定的数据库 User 模型
mongoose.model('Review', reviewSchema);
module.exports = function (conn) {
  return (conn || mongoose).model('Review')
}
