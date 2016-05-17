/**
 * Created by way on 16/5/17.
 * 集成登录参数
 */

export default {
  auth: {
    twitter: {
      consumerkey: 'yourConsumerKey',
      consumersecret: 'yourSecretKey',
      callback: 'http://127.0.0.1:6789/auth/twitter/callback'
    },
    facebook: {
      clientid: 'yourClientID',
      clientsecret: 'yourClientSecret',
      callback: 'http://127.0.0.1:6789/auth/facebook/callback'
    },
    weibo: {
      clientid: 'yourClientID',
      clientsecret: 'yourClientSecret',
      callback: 'http://www.paiapp.com:6789/auth/weibo/callback'
    },
    weixin: {
      clientid: 'yourClientID',
      clientsecret: 'yourClientSecret',
      callback: 'http://www.paiapp.com:6789/auth/weibo/callback'
    }
  }
}
