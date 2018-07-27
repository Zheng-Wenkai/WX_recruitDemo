var mongoose=require('mongoose');
var config=require('../config');

module.exports=function () {
// 连接数据库
    var db=mongoose.connect(config.mongodb);

    // 定义model
    var CounterSchema = new mongoose.Schema({
        _id: {type: String, required: true},
        seq: { type: Number, default: 0 }
    });
    mongoose.model('counterModel', CounterSchema);

    console.log("build counter model success");
    return db;
};