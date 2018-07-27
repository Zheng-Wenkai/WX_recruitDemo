var controllers=require('../controllers/controllers');

module.exports=function (app) {
    app.route('/AieRecruit')
        .get(controllers.hello);

    // 上传表单
    app.route('/AieRecruit/uploadForm')
        .post(controllers.uploadForm);
    // 上传照片
    app.route('/AieRecruit/uploadPic')
        .post(controllers.uploadPic);
    // 查询表单
    app.route('/AieRecruit/searchForm')
        .get(controllers.searchForm);
    // 查询照片
    app.route('/AieRecruit/searchPic/:studentId')
        .get(controllers.searchPic);
    // 叫号
    app.route('/AieRecruit/callForm')
        .get(controllers.callForm);
    // 查询等待状态，即前面还有多少人在等待
    app.route('/AieRecruit/searchRangeState')
        .get(controllers.searchRangeState);
    // 已到场，标志为已面试
    app.route('/AieRecruit/bePresent')
        .post(controllers.bePresent);
    // 未到场，删除面试者信息
    app.route('/AieRecruit/notBePresent')
        .post(controllers.notBePresent);
    // 查询当前队列剩余人数
    app.route('/AieRecruit/rangeNumber')
        .get(controllers.rangeNumber);
    // 用户登录，获取openid
    app.route('/AieRecruit/login')
        .get(controllers.login);

};
