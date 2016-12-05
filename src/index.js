/**
 * Created by way on 3/7/16.
 */

const debug = require('debug')('koastart');
import path from 'path';
import cfg from '../config/app';
import fs from 'fs';
const log4js = require('log4js');
import StatusError from './utils/errcode';
import app from './app';

/*
 * 创建日志目录
 */
try {
  if (!fs.existsSync('./log'))
    fs.mkdirSync('./log');

  if (!fs.existsSync('./log/err'))
    fs.mkdirSync('./log/err');

  if (!fs.existsSync('./log/hour'))
    fs.mkdirSync('./log/hour');

  if (!fs.existsSync('./log/http'))
    fs.mkdirSync('./log/http');
} catch (e) {
  console.error('Create log directory exp: %s', e.message);
}

const log = log4js.getLogger('index');
// 日志配置加载，每隔 300秒检查设置变更！
log4js.configure('config/log4js.json', { reloadSecs: 300 });

async function main() {
  const port = process.env.PORT || cfg.app.port;
  const host = process.env.HOST || '';

  await new Promise((res, rej) => {
    const server = app.listen(port, host, res);
    server.on('error', rej);
  });

  log.info('koa start on port: %s', port);
}

// 启动服务!
main().catch(err => setImmediate(() => { throw err; }));
