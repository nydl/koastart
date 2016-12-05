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
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId;

/**
 * 微信二维码模型定义，用于微信营销。
 * 城邦与单位类似，是个多层组织架构，城邦有子城邦（附属）及子子城邦，
 * 每个城邦里面有门派，门派就是 unit，
 */
var wxqrSchema = Schema({
    sid:Number //城邦id
	,pid: { type: String, required: true}    // pai用户id
	,wxUserId:String  // 微信用户id
    ,activityId:String  //活动id
    ,sceneId:String   //二维码场景值
	,ticket:String    // 二维码编号
	,timestamp:Number // 时间戳
	,crTime:{type: Date, default: Date.now}  // 创建时间
	,upTime:{type: Date}  // 更新时间
});

// 直接返回 Wxqr 模型
// module.exports = mongoose.model('Wxqr', wxqrSchema);

// 通过 require db.conn 来返回指定的数据库 Wxqr 模型
mongoose.model('Wxqr', wxqrSchema);
module.exports = function (conn) {
    return (conn || mongoose).model('Wxqr')
};
//插入数据
function wxqrInsert(data) {
    log.info("data:" + data + ",this.data" + this.data);
    if (!data) {
        data = this.data;
    }
    mongoDemo.createData('wxqr', wxqrSchema, data
        , function (result) {
            log.info("wxqrInsert插入结果：" + result);
        }
    );
}

function wxqrUpdate(criteria,result,cb){
    mongoDemo.updateOne('wxqr',wxqrSchema,criteria,result,function(data){
        cb(data);
    })
}

//通过ticket查找wxid
function wxqrSearchWxId(ticket,callback,needFields) {
    console.log('通过ticket查找wxid：'+ticket);
    var tickets=JSON.stringify(ticket);
    var ticketss=JSON.parse(tickets);
    var criteria = {"ticket": ticketss};
    console.log('wxqrSearchWxIdJSON转换后的值'+criteria.ticket);
    mongoDemo.searchByCondition('wxqr',wxqrSchema,criteria,function(data){
        log.info("wxqrSearchWxId查询到了结果:" + data);
        if(data.length>0){
            //callback(data[0]);
            var data1=data[0];
            log.info("data1的值：" + data1);
            var wxUserId = data1['wxUserId'];
            log.info("wxUserId:" + wxUserId);
            log.info("data1数据类型：" + typeof(data1) + "," + data1 + "," + wxUserId);
            if (data1) {
                log.info("wxUserId " + wxUserId);
                //user.getUserPidByOpenId(wxUserId, function (data2) {
                //    log.info("查询到的被扫描的pid为：" + data2.pid);
                //    if (data2.pid != undefined && data2.pid != "") {
                //        parentPidArr.push(data2.pid);
                //        //再次查询父级的prev,然后返回
                //        siteUser.findPrevByPid(data2.pid, function (data3) {
                //            log.info("查询到了prev数据：" + data3);
                //            if (data3.length < 1) {
                //                log.info("被扫描的推荐人没有上级推荐人");
                //            } else {
                //                for (var i = 0; i < data3.length; i++) {
                //                    parentPidArr.push(data3[i]);
                //                }
                //            }
                //            log.info("parentPidArr:" + parentPidArr);
                //            insertSiteUser(dataUserReg, message, parentPidArr);
                //        }, {'_id': 0, 'prev': 1});
                //    }
                //});    //

                callback(data[0]);
            }
        }else{
            callback(undefined);
        }
    });
}


/**
 * Data generation
 */
function createData () {
    var conn = require('./db').conn
        , Wxqr = conn.model('Wxqr');

    Wxqr.create({
        sid:1
        ,pid: '74029353'    // pai用户id
        ,wxUserId:'jskdjfksjdug8979oisdjff'  // 微信用户id
        ,ticket:'sidfjhsdjfjsf87w908fjhigfkdjgldsjgoewru9g8rg'    // 二维码编号
        ,timestamp:1287653928 // 时间戳
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
module.exports.wxqrInsert = wxqrInsert;
module.exports.wxqrSearchWxId = wxqrSearchWxId;
module.exports.wxqrUpdate = wxqrUpdate;