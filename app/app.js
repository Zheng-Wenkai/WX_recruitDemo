//app.js
const util = require('utils/util.js')
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
  onLoad: function (options) {
    wx.login({
      success: function (res) {
        console.log(res)
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://justforlearn.cn/login',
            data: {
              code: res.code
            },
            method: 'GET',
            header: { 'content-type': 'application/json' },
            success: function (res) {
              console.log(res.data)
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail: function () {

        console.log("启用wx.login函数，失败！");

      },

      complete: function () {

        console.log("已启用wx.login函数");

      }
    })
  },
  globalData: {
    userInfo: null,
    openid:null
    // signWay: null,
    // callType: null
  }
})