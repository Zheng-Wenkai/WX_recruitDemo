var mongoose = require('mongoose');

// 导入工具
var multer = require('../util/multerUtil');

// 导入模型
var Sign = mongoose.model('Sign');
var Counter = mongoose.model('Counter');
var Sign2 = mongoose.model('Sign2');
var Counter2 = mongoose.model('Counter2');

module.exports = {
    hello: function (req, res, next) {
        return res.end("hello world");
    },

    uploadForm: function (req, res, next) {
        console.log(req.body);
        var mydate = new Date();
        if(req.body.signWay==0){
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
        }
        else if(req.body.signWay==1){
            var form = new Sign2(req.body);
            form.regTime = mydate.toLocaleString();
            Counter2.findByIdAndUpdate({_id: 'entityId'}, {$inc: {seq: 1}}, function (err, counter2) {
                if (err)
                    return next(err);
                form.range = counter2.seq;
                form.save(function (err) {
                    // 如果出错，则将控制权传递到错误处理中间件
                    if (err) return next(err);
                    // 如果没有出错，则响应用户
                    return res.json(form);
                });
            })
        }
        else{
            console.log("报名类型错误");
        }
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

        if(req.query.rangeType=='A'){
            Sign.findOne({"range": parseInt(req.query.rangeNum)}, function (err, data) {
                if (err) return next(err);
                return res.json(data);
            });
        }
        else if(req.query.rangeType=='B'){
            Sign2.findOne({"range": parseInt(req.query.rangeNum)}, function (err, data) {
                if (err) return next(err);
                return res.json(data);
            });
        }
        else return console.log("排队类型错误");
    },
    callForm: function (req, res, next) {
        console.log(req.query);
        if(req.query.callType==0){
            Sign.findOne({"isInterview": 0}, function (err, data) {
                if (err) return next(err);
                return res.json(data);
            });
        }
        else if(req.query.callType==1){
            Sign2.findOne({"isInterview": 0}, function (err, data) {
                if (err) return next(err);
                return res.json(data);
            });
        }
        else return console.log("叫号类型错误");

    },
    searchPic: function (req, res, next) {
        var path = 'uploads/' + req.params.studentId + '.jpg';// 路径
        var filename = req.params.studentId + '.jpg';// 文件名称
        res.download(path, filename);
    },
    searchRangeState: function (req, res, next) {
        console.log(req.query);
        var cond={
            $and:[
                {range: {$lt : parseInt(req.query.range)}},
                {isInterview:0}
            ]
        };
        if(req.query.signWay==0){
            Sign.count(cond,function (err,data) {
                console.log(data);
                if(err)return next(err);
                return res.json(data);
            });
        }
        else if(req.query.signWay==1){
            Sign2.count(cond,function (err,data) {
                if(err)return next(err);
                return res.json(data);
            });
        }
        else{
            console.log("报名类型错误");
        }
    },
    isInterview:function (req,res,next) {
        console.log(req.body);
        if(req.body.callType==0){
            Sign.updateOne({"range": req.body.range},{"isInterview":1}, function (err, data) {
                if (err) return next(err);
                return res.json(data);
            });
        }
        else if(req.body.callType==1){
            Sign2.updateOne({"range": req.body.range}, {"isInterview":1},function (err, data) {
                if (err) return next(err);
                return res.json(data);
            });
        }
        else return console.log("叫号类型错误");
    },
    notInterview:function (req,res,next) {
        console.log(req.body);
        if(req.body.callType==0){
            Sign.remove({"range": req.body.range}, function (err, data) {
                if (err) return next(err);
                return res.json(data);
            });
        }
        else if(req.body.callType==1){
            Sign2.remove({"range": req.body.range}, function (err, data) {
                if (err) return next(err);
                return res.json(data);
            });
        }
        else return console.log("叫号类型错误");
    },
    rangeNumber:function (req,res,next) {
        var dic = { };
        var cond={
            $and:[
                {isInterview:0}
            ]
        };
        Sign.count(cond,function (err,data) {
            console.log("线上：",data);
            if(err)return next(err);
            dic["onlineNumber"]=data;
            Sign2.count(cond,function (err,data) {
                console.log("现场：",data);
                if(err)return next(err);
                dic["presentNumber"]=data;
                console.log(dic);
                return res.json(dic);
            });
        });

    }
};
