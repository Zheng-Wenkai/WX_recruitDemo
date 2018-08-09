// pages/display/display.js
const app = getApp();
const util = require('../../utils/util');
const config = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    work: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    for (var i = 0; i < 5; i++) {
      this.searchWork(i);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  searchWork: function (i) {
    //e.detail.value可以在用户点击完成后得到输入框的信息
    var that = this;
    util.showBusy('查询中...')
    wx.downloadFile({
      url: config.searchPicUrl + app.globalData.phoneNumber + i,
      success: function (res) {
        that.data.work[i] = res.tempFilePath;
        that.setData({
          work: that.data.work
        })
        
      },
      fail: function (res) {
        console.log(res);
        util.showModel('获取用户作品失败', '请检查网络连接是否正常')
      }
    })
  },
})