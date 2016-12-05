
/**
 * Created by way on 5/12/16.
 */

import Router from 'koa-router';
import userRt from './user';
import orderRt from './order';
import imgRt from './img';
const multer = require('koa-multer');
const upload = require('../utils/upload');
import cfg from '../../config/app.js';
const util = require('util');

// 上传文件
import fs from 'fs';
const formidable = require('formidable');
// import formidable from 'formidable';
import path from 'path';

// const fileSaveDir = STATIC_PATH + 'upload';


// import {checkLogined} from '../logic/user';
// import { upload } from './modules/stores';

const rt = new Router();

// router.use('/user', userRouter.routes());
// rt.post('/upload', checkLogined, upload);

// 首页
rt.get('/', ctx => {
  // console.log('sid:%s', ctx.sessionStorage.);
  // ctx.render('index', { title: 'pai!' });
  // ctx.render( 'h1 Hello, #{title} #{name}', { name: 'Jade!' }, { fromString: true }, false);
  ctx.render('motherday', { titel: '感恩母亲' });
});

upload(rt);

/*
rt.post('/upload', ctx => {
  const up = multer({dest: './uploads/'});
  up.any();
  console.log(`file:${ctx.url} files:${ctx.href}`);
  ctx.body = 'ok!';
});
*/


rt.get('/upload', ctx => {
  console.log('upload');
  ctx.body = 'ok!';
});

rt.post('/save', ctx => {
  console.log('save');
  ctx.body ='ok!';
  console.log(util.inspect(ctx.body));
  var form = new formidable.IncomingForm();
  form.parse(ctx.req, (err, fields, files) => {
    console.log(util.inspect({fields: fields, files: files}));
  });

});

// 用户子路由
rt.use('/user', userRt.routes());
// 订单子路由
rt.use('/order', orderRt.routes());
// 图片处理子路由
rt.use('/img', imgRt.routes());

// app.use( multer({
//   dest: './upload/', // 上传文件路径
//   inMemory: false, // no written to disk but data is kept in a buffer accessible in the file object.
//   // 更改文件名称，避免覆盖！
//   //rename: function (fieldname, filename) {
//   //  return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
//   //},
//   //rename: function (fieldname, filename) {
//   //  return fieldname + filename;
//   //},
//   /*
//   limits: { // (Default: Infinity)
//     fileSize: cfg.upfile.maxSize
//   },
//   onFileSizeLimit: function (file) {
//     //如果大于10M,删除它
//     if (file.size > cfg.file.maxSize) {
//       fs.unlink('./' + file.path) // delete the partially written file
//       log.error('upload file error! size:%d > maxSize:%d', file.size, cfg.file.maxSize);
//       return res.send(util.format('{"act":"upload", "rc":400, "size":%d, "maxSize":%d, "err":"数据包超过最大限制！"}',
//         file.size, cfg.file.maxSize));
//     }
//   },
//   */
//   onFileUploadComplete: file => {
//     console.log(file.fieldname + ' uploaded to  ' + file.path);
//   }
// }));


//function upload(ctx) {
//  const up = multer({dest: './upload/'});
//  up.any();
//  console.log(`file:${ctx.body} files:${ctx.req.files}`);

   //   if (!fs.existsSync(fileSaveDir)) {
//     fs.mkdirSync(fileSaveDir)
//   }

//   var form = new formidable.IncomingForm();
//   var responseData = [];
//   form.uploadDir = fileSaveDir;
//   form.type = true;
//   form.keepExtensions = true;

//   form.parse(ctx.req, function(err, fields, files){
//     if(!err) {
//       Object.keys(files).forEach(function(key){
//         var file = files[key];
//         var filename = path.basename(file.path);
        
//         // 塞入响应数据中
//         responseData.push({
//           type: file.type,
//           name: filename,
//           path: '/public/upload/' + filename,
//           size: file.size / 1024 > 1024 ? (~~(10 * file.size / 1024 / 1024)) / 10 + "MB" : ~~(file.size / 1024) + "KB"
//         });
//       });
//     } else {
//       console.warn(err);
//     }

//     ctx.res.writeHead(200);
//     ctx.res.end(JSON.stringify(responseData));
//   });
//}

export default rt;