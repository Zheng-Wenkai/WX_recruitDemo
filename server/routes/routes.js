var controllers=require('../controllers/controllers');

module.exports=function (app) {
    app.route('/')
        .get(controllers.hello);
    app.route('/uploadForm')
        .post(controllers.uploadForm);
    app.route('/uploadPic')
        .post(controllers.uploadPic);
    app.route('/searchForm')
        .get(controllers.searchForm);
    app.route('/callForm')
        .get(controllers.callForm);
    app.route('/searchPic/:studentId')
        .get(controllers.searchPic);
    app.route('/searchRangeState')
        .get(controllers.searchRangeState);
    app.route('/isInterview')
        .post(controllers.isInterview);
    app.route('/notInterview')
        .post(controllers.notInterview);
    app.route('/rangeNumber')
        .get(controllers.rangeNumber);
};
