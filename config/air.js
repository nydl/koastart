/**
 * Created by way on 16/5/17.
 * 航空政策参数
 */

module.exports = {
  checksum: false, // 调试是用于判断上传的文件是否正确，运行稳定可关闭！
  maxSize: 10 * 1024 * 1024, // 上传最大文件大小，单位兆数，默认10兆，大约500万条政策数据
  allMax: 3000,  // 全新获取最大条数
  newMax: 1000,  // 更新获取最大条数
  fileTime: 1800, // 政策上传缓存时长，默认30分钟，超过自动清除！
  parseHost: '', // "localhost", // 域名 或 ip地址，政策文件解析主机，空表示直接使用.net 调用，不使用udp消息包
  parsePort: 3004 // 解析主机端口
};
