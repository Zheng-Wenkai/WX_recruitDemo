// pages/my/my.js
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  searchRangeState: function () {
    var that = this;
    util.showBusy('查询中...')
    wx.request({
      url: 'http://localhost:7010/searchRangeState/',
      method: 'GET',
      data: {
        signWay: 0,
        range: 4 //当前数据仅供测试
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data == null) {
          util.showModel('获取用户信息失败', '不存在该用户');
        }
        else {
          let waitTime = Math.ceil(res.data / 5) * 10;
          let message = '你的前面还有' + res.data + '人在等候，预计仍需等待' + waitTime + '分钟';
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
    switch (that.data.interviewResult) {
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
  }
})