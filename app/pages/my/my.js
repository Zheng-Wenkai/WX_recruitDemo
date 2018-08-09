// pages/my/my.js
const util = require('../../utils/util');
const config = require('../../config.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: [
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo();
  },
  getInfo: function () {
    var that = this;
    util.showBusy('正在登陆...')
    wx.request({
      url: config.myUrl,
      method: 'GET',
      data: {
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          info: res.data
        })
      },
      fail: function (res) {
        console.log(res);
        util.showModel('获取用户信息失败', '请检查网络连接是否正常');
      },

    })
  },
  searchRangeState: function () {
    var that = this;
    util.showBusy('查询中...')
    wx.request({
      url: config.searchRangeStateUrl,
      method: 'GET',
      data: {
        range: that.data.info.range,
        timeSlot: that.data.info.timeSlot
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data == null) {
          util.showModel('获取用户信息失败', '不存在该用户');
        } else {
          let message = '你的前面还有' + res.data + '人在等候';
          util.showMessage(message);
        }
      },
      fail: function (res) {
        console.log(res);
        util.showModel('获取用户信息失败', '请检查网络连接是否正常');
      },

    })
  },
  searchResult: function () {
    util.showBusy('查询中...')
    switch (this.data.info.interviewResult) {
      case 0:
        util.showMessage("未面试");
        break;
      case 1:
        util.showMessage("已完成面试，请耐心等待面试结果");
        break;
      case 2:
        util.showMessage("已通过第一轮面试");
        break;
      case 3:
        util.showMessage("感谢你的参与");
        break;
      default:
        util.showMessage("未报名");
        break;
    }
  },
  turnToSign: function () {
    if (app.globalData.isSign == true) {
      util.showMessage("你已报名");
    }
    else {
      wx.navigateTo({
        url: '../signForm/signForm',
      })
    }
  },
})