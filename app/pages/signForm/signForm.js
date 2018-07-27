const util = require('../../utils/util');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //arrarys
    college: ['', '数学与信息学院', '材料与能源学院', '工程学院', '国际教育学院', '经济管理学院', '林学与风景园林学院', '园艺学院', '资源环境学院', '电子工程学院', '动物科学学院', '海洋学院', '兽医学院', '水利与土木工程学院', '人文与法学学院', '公共管理学院', '外国语学院', '食品学院', '艺术学院', '农学院', '生命科学学院'],
    gender: ['', '男', '女'],
    // location: ['', '五山', '华山', '启林', '联招'],
    departments: ['', '自科部', '社科部', '新闻部', '运营部', '宣传部', '策划部', '项目部', '外联部', '办公室', '财务部', '竞赛部'],
    //pickers
    xueyuan: 0,
    xingbie: 0,
    quyu: 0,
    wishA: 0,
    wishB: 0,
    studentId: null, //学号，用于上传图片
    isuploadpic: false,
    openid: null
    // signWay: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  // 获取form里面的所有内容，并提交
  formSubmit: function(e) {
    var that = this;
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (e.detail.value.fullName == "" || e.detail.value.studentId == "" || e.detail.value.major == "" || e.detail.value.phoneNumber == "" || e.detail.value.introduction == "" || e.detail.value.xueyuan == 0 || e.detail.value.xingbie == 0 || e.detail.value.wishA == 0) {
      util.showModel('无法提交', '请将表单信息填写完整');
    } else if (this.data.isuploadpic == false) {
      util.showModel('无法提交', '请先上传个人照片');
    } else {
      util.showBusy('正在提交');
      wx.request({
        url: 'http://localhost:7010/uploadForm',
        data: {
          openId: null, // 待填

          fullName: e.detail.value.fullName,
          studentId: e.detail.value.studentId,
          major: e.detail.value.major,
          phoneNumber: e.detail.value.phoneNumber,
          introduction: e.detail.value.introduction,
          college: that.data.college[e.detail.value.xueyuan],
          gender: that.data.gender[e.detail.value.xingbie],
          // location: that.data.location[e.detail.value.quyu],
          departmentsA: that.data.departments[e.detail.value.wishA],
          departmentsB: that.data.departments[e.detail.value.wishB],

          timeSlot: null, // 待填
          interviewResult: 0,
          isInterview: 0,
          openid: app.globalData.openid
          // signWay: app.globalData.signWay,

        },
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res) {
          util.showSuccess('提交成功');
          console.log(res.data);
          wx.setStorageSync('logs', res.data)
          console.log('submit success', res.data, res.header, res.statusCode);
        },
        fail: function() {
          util.showModel('提交失败', '请检查网络是否正常连接');
        }
      })
    }

  },
  // 获取对应的内容，修改data
  bindGenderChange: function(e) {
    this.setData({
      xingbie: e.detail.value
    })
  },
  bindCollegeChange: function(e) {
    this.setData({
      xueyuan: e.detail.value
    })
  },
  bindDepartAChange: function(e) {
    this.setData({
      wishA: e.detail.value
    })
  },
  bindDepartBChange: function(e) {
    this.setData({
      wishB: e.detail.value
    })
  },
  // bindLocationChange: function (e) {
  //   this.setData({
  //     quyu: e.detail.value
  //   })
  // },
  uploadPic: function() {
    var that = this;
    // 选择图片
    wx.chooseImage({
      count: 1, // 可选图片张数
      sizeType: ['compressed'], // 使用压缩图
      sourceType: ['album', 'camera'], // 来源为相册或相机
      success: function(res) {
        var tempFilePaths = res.tempFilePaths
        // 上传图片
        wx.uploadFile({
          url: 'http://localhost:7010/uploadPic',
          filePath: tempFilePaths[0], // 上传第一张图片
          name: 'picture',
          header: {
            'content-type': 'multipart/form-data'
          },
          formData: {
            // 额外信息（openid）
            'openid': app.globalData.openid
          },
          success: function(res) {
            console.log(res.data);
            that.data.isuploadpic = true; // 最好放在success里面，但为了防止因未知错误导致用户无法报名，故外移。
            util.showSuccess('上传图片成功')
          },
          fail: function(res) {
            console.log(res);
            util.showMessage('上传图片失败')
          }

        })
      }
    })
  }
})