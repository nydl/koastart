/**
 * Created by way on 16/5/17.
 * 应用基本参数
 */

module.exports = {
  app: {
    host: 'paiapp.com', // 域名 或 ip地址，登记时需要返回给登记者
    port: 3000, // 4502-4534  silverlight
    debug: true    // 调试环境还是生产环境
  },
  theme: {
    name: 'default'
  },
  session: {
    secret: '546gsfqwerqe4tgfghfghdfujtrt',
    expires: 1200, // 服务端session有效期，单位秒，空闲超时强制清除，客户端最好5分钟一次登记！超时20分钟不活动，判断为离线，个人聊天时无需精确状态消息，在close中不广播离线状态，在这里广播 离线状态？
    checktime: 60  // 多长时间 检查一次，单位秒
  },
  // mongodb 数据库
  db: {
    conn: 'mongodb://localhost/pai',
    poolSize: 5
  },
  // 缓存服务器
  redis: {
    host: 'localhost',
    port: 6379, // 6379在是手机按键上MERZ对应的号码，而MERZ取自意大利歌女Alessia Merz的名字
    password: ''
  },
  upfile: {
    maxSize: 20 // 上传最大文件大小，单位兆数，默认10兆，大约500万条政策数据
  }
};
