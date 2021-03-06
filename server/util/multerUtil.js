var multer = require('multer');
var storage = multer.diskStorage({
    //设置上传后文件路径
    destination: function (req, file, cb) {
        cb(null, './picture')
    },
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        console.log(req.body);
        console.log(req.body.phoneNumber);
        cb(null, +req.body.phoneNumber+ "."+ 'jpg');// 将图片统一更改为jpg格式
    }
});
//添加配置文件到muler对象。
var upload = multer({
    storage: storage
});

//导出对象
module.exports = upload;