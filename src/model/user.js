// Schema ： 一种以文件形式存储的数据库模型骨架，不具备数据库的操作能力，相当于数据表的定义
// Model  ： 由Schema发布生成的模型对象，具有抽象属性和行为的数据库操作，相当于类及静态方法
// Entity ： 由new Model创建的实体，操作也会影响数据库，更多是单个 对象实例进行操作

// 使用 模型
// const conn = require('./db').conn;
//  , User = require('../models/user')(conn)

const mongoose = require('mongoose');
const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;

/**
 * User 模型定义
 * name: { type: String, index: true }
 */
const userSchema = schema({
  // pai号，目前暂定为 8 位
  pid: { type: String, required: true, unique: true }, // pai号，必须有值，必须唯一，重复无法插入
  mobile: {type: String, required: true, unique: true}, // 手机号，企业、群组没有手机，可设置为固定电话，或者创办人手机前加 G，避免手机重复
  email: {type: String, sparse: true, unique: true},  // 邮箱，稀疏索引，支持多个无值都能插入，有值必须唯一，不能填空，不能null

  unitId: Number,   // 单位 Id，自增长索引，可选
  unitOid: ObjectId, // 单位ObjectId
  unitPid: String,  // 单位 pid

  rid: {type: String},     // 第三方系统id号，如 马蜂窝的 uid
  from: {type: String},    // 用户来源，比如 mfw 表示马蜂窝

  name: {type: String, index: true}, // 真实姓名，用于朋友之间显示的名称
  alias: String,    // 别名，类似微信的备注名称，可修改好友的名称为别名
  nick: String,     // 昵称，用于陌生人显示的名称
  mark: String,     // 个性签名，微博、QQ、微信在名字后面显示 sign api接口的 sign 冲突
  sex: String,      // 性别，男、女，企业、群组无
  password: String, // md5 编码

  // 类别 0：待定，作为普通个人用户处理 1：普通个人 2：企业用户 3：群组，群组依附于会员存在 4：公众，包括 个人、媒体、企业等需社会化营销的用户
  type: Number,     // 普通、企业 的分享，是否可向公众 转发、关注，从而产生粉丝，类似轻微博，粉丝只能看到用户通讯录之外的粉丝和关注，对通讯录进行保护
  verify: Boolean,  // 实名认证、验证，坐过飞机的，自动通过认证
  rating: Number,   // 等级  星级  可建立梦幻的、值得骄傲的，代表身份的等级制，包括 分享数量、粉丝数量、转发数量等
  tag: [],          // 标签，如 明星,记者,机票出票

  imei: String,     // 手机设备串号，可用于绑定
  ip: String,       // 当前计算机IP地址，一般是变化的
  pcid: String,     // 计算机设备号，如 cpuid，硬盘id，网卡mac地址等用于标识当前计算机设备，用于绑定登录

  icon: String,     // 用户图标
  url: String,      // 用户工作网址
  host: String,     // 登记、归属主机
  unitNo: String,   // 邀请码，单位号，用于识别所属主机及单位，用于所动该用户单位
  status: Number,   // 用户状态 0：新用户待定 1：确认 2：复核 3：删除 4：过期

  // pai状态 0：未登记（未登录） 离线 1：登记 上线（一般用于登录状态判断） 2:在线（普通空闲状态） 3：忙碌 4：免打扰 5：隐身 6：离开
  // 离线后第一次登录，状态填1，成功登录后，根据上次状态判断，如上次为隐身，则进入隐身，否则 进入 2 在线状态，这样方便统计用户登录情况
  // 状态说明，如 打字中，就餐等。。。
  // 工作状态 0:缺席（未上岗） 1：上岗（开始上班，类似登录） 2:就绪（可分派业务） 3:忙碌（电话会话） 4:暂停（不分派业务） 5：外呼 6：离席
  // 工作状态说明，如 离席 会议、就餐等。。。state: {type: Array, default: [0, '', 0, '']},

  friend: [],      // 好友，安装了pai
  contact: [],      // 联系人，一个人一般都有100-1000的联系人，这些都是需要转化pai用户的目标

  group: [],       // 加入的群组
  member: [],       // 群组成员，对群组用户有效

  // 订阅别人，关注别人，用于主动获取订阅者、关注者状态
  sub: {
    sta: [],       // 状态订阅者，有时只需要状态
    all: [],       // 所有关注，微博的 关注
    msg: [],       // 消息分享订阅者
    pic: []       // 相册订阅者
  },
  // 被别人订阅，被关注
  subed: {
    sta: [],       // 状态订阅者
    all: [],       // 所有订阅者，微博的粉丝
    msg: [],       // 分享订阅者
    pic: []       // 相册订阅者
  },

  desc: String,     // 个人简介
  notes: String,    // 备注
  remark: String,   // 内部备注，内部可见
  sellId: ObjectId, // 推荐者、销售员UserId
  sellPid: String,   // 销售员pid
  seller: String,   // 销售员名称

  serviceId: ObjectId,  // 客服Id
  servicePid: String,  // 客服名称
  servicer: String,  // 客服名称

  adminId: ObjectId, // 管理人id
  adminPid: String,
  admin: String,    // 管理人名称，公众、群组用户 需设置管理员，方便联系

  addUserId: ObjectId, // 创建用户, ObjectId 唯一，不可被修改！
  addPid: String, // 创建用户
  addUser: String, // 创建用户
  addTime: {type: Date, default: Date.now}, // 创建时间

  upUserId: ObjectId, // 更新用户
  upPid: String, // 更新用户
  upUser: String, // 更新用户
  upTime: Date  // 更新时间
});

// This method accepts a few options. Instead of applying these options on a per-document basis
// we may declare the options here and have it applied to all of this schemas documents by default.
// userSchema.set('toObject', { getters: true });

// 直接返回 User 模型
// module.exports = mongoose.model('User', userSchema);

// 通过 require db.conn 来返回指定的数据库 User 模型
export default function userM(conn) {
  // 定义 model
  mongoose.model('userM', userSchema);
  return (conn || mongoose).model('userM');
}


/**
 * Data generation
 */
import conn from './db';
function add(pid) {
  // 定义 model
  mongoose.model('user', userSchema);
  const UserM = conn.model('user');
  /*
   //  var tm1 = new Date(Date.parse('2013-07-20 18:00:00'.replace(/-/g,   "/")));
   var tm2 = Date.parse('2013-07-21 17:00');
   var tm1 = new Date();
   console.log( tm1.getTime() - tm2);
   return;

   // var tm1 = new Date(Date.parse('2013-07-20 18:00:00'));
   // var tm1 = new Date( '2013-07-20' );
   var tm1 = new Date( '2013/07/20' ); // 不带时区
   var tm2 = new Date( '2013-07-20' ); // 带了时区，时刻会多8 小时！！！
   tz = new Date().getTimezoneOffset() * 60000;
   tm1 = new Date(tm1.getTime() - tz);
   // var tm2 = new Date( '2013/07/20 10:00' );
   console.log( 't1:%d t2:%d td:%d tz:%d', tm1.getTime(), tm2.getTime(),
   tm1.getTime() - tm2.getTime(), tz);


   return;
   //
   //  var d1 = new Date('2013-07-20 18:00:00');  //会早 8 个时区，
   //  var d2 = new Date('2013/07/20 18:00:00');
   //  console.log('d1:%d d2:%d dif:%d', d1.getTime(), d2.getTime(), d1.getTime() - d2.getTime());
   //  return;

   */
  UserM.create({
    pid: pid,
    name: 'test',
    showName: 'test',
    Sex: '男',
    mobile: '13900000001',
    unitNo: '0086.11112222',
    status: 1,
    upTime: new Date('2016/05/16 23:00:00'),
  }, err => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('create data!');
    }
  });
}

/**
 * Test
 */
add('88880003');
