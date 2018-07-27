var mongoose = require('mongoose');
var config = require('../config');

module.exports = function () {
// 连接数据库
    var db = mongoose.connect(config.mongodb);
    // 定义model
    var SignSchema = new mongoose.Schema({
        openId: String,// 用户的唯一标识符
        range: Number,// 编号

        fullName: String,
        studentId: String,
        major: String,
        phoneNumber: String,
        introduction: Object,
        college: String,
        gender: String,
        location: String,
        departmentsA: String,
        departmentsB: String,

        timeSlot: Number,//时间段
        interviewResult: Number,//面试结果
        isInterview: Number,//是否已面试
        signTime: String//报名时间
    });
    // 创建model
    mongoose.model('signModel', SignSchema);
    console.log("build sign model success");
    return db;
};
