/**
 * 专门的 数据库 连接，需要使用数据库 需 require 该文件！
 *
 * 一个额外的模块只是用来配置数据库，可能看起来有点笨重，但是它还是会带来明显的好处。
 * 首先，这段脚本会包含一些可以应用在各种开发场景的更复杂的配置
 * （例如：开发环境与生产环境，复制集——译者注：这个应该是指的mongodb的replica sets）。
 * 第二，它避免了我们启动Express的主应用模块app.js的混乱——一个模块可能会很快的变得难以维护。
 * 第三，它让那些同样需要使用数据库连接的模块不需要任何专用于数据库连接的代码。
 * 最后，它可以减少对数据库连接的关联度，模型可以用一个容易理解的约定方式使用数据库连接
 *
 * connect vs createConnect
 * ========================
 * Important! If you opened a separate connection using mongoose.createConnection()
 * but attempt to access the model through mongoose.model('ModelName')
 * it will not work as expected since it is not hooked up to an active db connection.
 * In this case access your model through the connection you created:
 * 缺省连接，无法实现多个数据库连接！
 * var conn = mongoose.createConnection('your connection string');
 * var MyModel = conn.model('ModelName', schema);
 * var m = new MyModel;
 * m.save() // works
 *
 * vs
 *
 * var conn = mongoose.createConnection('your connection string');
 * var MyModel = mongoose.model('ModelName', schema);
 * var m = new MyModel;
 * m.save() // does not work b/c the default connection object was never connected
 *
 * mongoos 数据模型
 * ==============
 * Schema ： 一种以文件形式存储的数据库模型骨架，不具备数据库的操作能力，相当于数据表的定义
 * Model  ： 由Schema发布生成的模型对象，具有抽象属性和行为的数据库操作，相当于类及静态方法
 * Entity ： 由new Model创建的实体，操作也会影响数据库，更多是单个 对象实例进行操作

 * 模型使用
 * ======
 * var conn = require('./models/db').conn
 *  , User = require('./models/user')(conn)
 *
 */

const mongoose = require('mongoose');
import cfg from '../../config/app.js';

// 缺省连接池为 5个
const conn = mongoose.createConnection(
  cfg.db.conn,
  {server: {poolSize: cfg.db.poolSize}}
);

conn.on('error', err => console.log(err));

export default conn;
