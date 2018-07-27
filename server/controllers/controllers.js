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
    searchForm: function (req, res, next) {
        console.log(req.query);

        Sign.findOne({"range": parseInt(req.query.rangeNum)}, function (err, data) {
            if (err) return next(err);
            return res.json(data);
        });

    },
    callForm: function (req, res, next) {
        console.log(req.query);
        Sign.findOne({"isInterview": 0}, function (err, data) {
            if (err) return next(err);
            return res.json(data);
        });

    },
    searchPic: function (req, res, next) {
        var path = 'uploads/' + req.params.studentId + '.jpg';// 路径
        var filename = req.params.studentId + '.jpg';// 文件名称
        res.download(path, filename);
    },
    searchRangeState: function (req, res, next) {
        console.log(req.query);
        var cond = {
            $and: [
                {range: {$lt: parseInt(req.query.range)}},
                {isInterview: 0}
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
        Sign.updateOne({"range": req.body.range}, {"isInterview": 1}, function (err, data) {
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
    rangeNumber: function (req, res, next) {
        var dic = {};
        var cond = {
            $and: [
                {isInterview: 0}
            ]
        };
        Sign.count(cond, function (err, data) {
            console.log("线上：", data);
            if (err) return next(err);
            dic["onlineNumber"] = data;
            return res.json(dic);
            // Sign2.count(cond, function (err, data) {
            //     console.log("现场：", data);
            //     if (err) return next(err);
            //     dic["presentNumber"] = data;
            //     console.log(dic);
            //     return res.json(dic);
            // });
        });

    },
    login: function (req, res, next) {
        var code = req.query.code;

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
