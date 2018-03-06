var express=require('express');
var bodyParser=require('body-parser');
var config=require('./config');


// 加载数据库
var counterModel=require('./models/counterModel');
var cdb=counterModel();
var signModel=require('./models/signModel');
var sdb=signModel();

var app=express();
app.use(bodyParser.json());
app.use(express.static("./public"));// 添加静态目录
require('./routes/routes')(app);// 导入路由并传入app参数

// 客户端请求一个不存在的指令
app.use(function (req,res,next) {
    res.status(404);
    // 使用 try-catch 防止重复响应
    try{
        return res.json('Not found');
    }catch (e){
        console.error('404 set header after sent');
    }
});

// 统一处理各种错误
app.use(function (err,req,res,next) {
    if(!err){
        return next();// 若没有error，则进入下一个中间件
    }
    res.status(500);
    try{
        return res.json(err.message||'sever error');
    }catch (e){
        console.error('500 set header after sent');
    }
});
app.listen(config.port,function(){
    console.log('started http://localhost:'+config.port);
});