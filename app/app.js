//app.js
const util = require('utils/util.js')
const config = require('./config.js')

App({
  onLaunch: function(options) {
    this.getOpenid();
  },
  getOpenid: function() {
    var that = this;
    wx.login({
      success: function(res) {
        console.log(res)
        if (res.code) {
          //发起网络请求
          wx.request({
            url: config.loginUrl,
            data: {
              code: res.code
            },
            method: 'GET',
            header: {
              'content-type': 'application/json'
            },
            success: function(res) {
              that.globalData.openid = res.data;
              console.log(that.globalData.openid);
              that.getInfo();
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail: function() {
        console.log("启用wx.login函数，失败！");
      },
      complete: function() {
        console.log("已启用wx.login函数");
      }
    })
  },
  getInfo: function () {
    var that = this;
    wx.request({
      url: config.myUrl,
      method: 'GET',
      data: {
        openid: that.globalData.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data != null) {
          that.globalData.isSign = true
        }
      },
      fail: function (res) {
        console.log(res);
        util.showModel('获取用户信息失败', '请检查网络连接是否正常');
      },

    })
  },
  globalData: {
    isSign: null,
    openid: null,
    signNumber:null,
    phoneNumber: null,
    department: null,
    timeSlot: null,
  }
})