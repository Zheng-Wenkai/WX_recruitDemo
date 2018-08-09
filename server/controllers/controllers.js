var mongoose = require('mongoose');
var request = require('request');
// 导入工具
var multer = require('../util/multerUtil');

// 导入模型
var Sign = mongoose.model('signModel');
var Counter = mongoose.model('counterModel');

var config = require('../config');
module.exports = {
    hello: function (req, res, next) {
        return res.end("hello world");
    },

    uploadForm: function (req, res, next) {
        console.log(req.body);
        var mydate = new Date();
        var form = new Sign(req.body);
        form.regTime = mydate.toLocaleString();
        Counter.findByIdAndUpdate({_id: 'entityId'}, {$inc: {seq: 1}}, function (err, counter) {
            if (err)
                return next(err);
            form.range = counter.seq;
            form.save(function (err) {
                // 如果出错，则将控制权传递到错误处理中间件
                if (err) return next(err);
                // 如果没有出错，则响应用户
                return res.json(form);
            });
        });

    },
    uploadPic: function (req, res, next) {
        // 只上传一张图片，故用single即可，且multer有single()中的名称必须是表单上传字段的name名称。
        var upload = multer.single('picture');
        upload(req, res, function (err) {
            //添加错误处理
            if (err) return next(err);
            return res.end('img received');
        });
    },
    my: function (req, res, next) {
        console.log(req.query);
        Sign.findOne({"openid": req.query.openid}, function (err, data) {
            if (err) return next(err);
            return res.json(data);
        });

    },
    searchForm: function (req, res, next) {
        console.log(req.query);
        Sign.findOne({"range": parseInt(req.query.rangeNum)}, function (err, data) {
            if (err) return next(err);
            return res.json(data);
        });

    },
    callForm: function (req, res, next) {
        console.log(req.query);
        var cond = {
            $and: [
                {departmentsA: req.query.department},
                {timeSlot: req.query.timeSlot},
                {interviewResult: 0}
            ]
        };
        Sign.findOne(cond, function (err, data) {
            if (err) return next(err);
            return res.json(data);
        });

    },
    searchPic: function (req, res, next) {
        var path = 'picture/' + req.params.phoneNumber + '.jpg';// 路径
        var filename = req.params.phoneNumber + '.jpg';// 文件名称
        res.download(path, filename);
    },
    searchRangeState: function (req, res, next) {
        console.log(req.query);
        var cond = {
            $and: [
                {range: {$lt: parseInt(req.query.range)}},
                {timeSlot: req.query.timeSlot},
                {interviewResult: 0}
            ]
        };
        Sign.count(cond, function (err, data) {
            console.log(data);
            if (err) return next(err);
            return res.json(data);
        });
    },
    bePresent: function (req, res, next) {
        console.log(req.body);
        Sign.updateOne({"range": req.body.range}, {"interviewResult": 1}, function (err, data) {
            if (err) return next(err);
            return res.json(data);
        });
    },
    notBePresent: function (req, res, next) {
        console.log(req.body);
        Sign.remove({"range": req.body.range}, function (err, data) {
            if (err) return next(err);
            return res.json(data);
        });
    },
    signNumber: function (req, res, next) {
        console.log("查询当前队列报名人数");
        var cond = {
            $and: [
                {departmentsA: req.query.department},
                {timeSlot: req.query.timeSlot},
            ]
        };
        Sign.count(cond, function (err, data) {
            console.log(data);
            if (err) return next(err);
            return res.json(data);
        });

    },
    rangeNumber: function (req, res, next) {
        var cond = {
            $and: [
                {departmentsA: req.query.department},
                {timeSlot: req.query.timeSlot},
                {interviewResult: 0}
            ]
        };
        Sign.count(cond, function (err, data) {
            console.log(data);
            if (err) return next(err);
            return res.json(data);
        });

    },
    login: function (req, res, next) {
        var code = req.query.code;
        console.log(code)
        request.get({
            uri: 'https://api.weixin.qq.com/sns/jscode2session',
            json: true,
            qs: {
                grant_type: 'authorization_code',
                appid: config.appid,
                secret: config.appSecret,
                js_code: code
            }
        }, (err, response, data) => {
            if (response.statusCode === 200) {
                console.log("[openid]", data.openid);
                console.log("[session_key]", data.session_key);

                //TODO: 生成一个唯一字符串sessionid作为键，将openid和session_key作为值，存入redis，超时时间设置为2小时
                //伪代码: redisStore.set(sessionid, openid + session_key, 7200)
                res.json(data.openid)
            } else {
                console.log("[error]", err);
                res.json(err)
            }
        })
    }
};
