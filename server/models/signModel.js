var mongoose = require('mongoose');
var config = require('../config');

module.exports = function () {
// 连接数据库
    var db = mongoose.connect(config.mongodb);
    // 定义model
    var SignSchema = new mongoose.Schema({
        openId: String,
        range: Number,

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

        timeSlot: Number,
        interviewResult: Number,
        isInterview: Number,
        signWay: Number,
        regTime: String
    });
    // 创建model
    mongoose.model('Sign', SignSchema);

    // 定义model
    var SignSchema2 = new mongoose.Schema({
        openId: String,
        range: Number,

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

        timeSlot: Number,
        interviewResult: Number,
        isInterview: Number,
        signWay: Number,
        regTime: String
    });
    // 创建model
    mongoose.model('Sign2', SignSchema2);
    console.log("build sign model success")
    return db;
}
