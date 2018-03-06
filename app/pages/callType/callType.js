// pages/callType/callType.js
const app = getApp();
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    onlineNumber:0,
    presentNumber:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.rangeNumber();
  },
  onlineRange: function () {
    app.globalData.callType = 0;
    wx.navigateTo({
      url: '../callForm/callForm',
    })
  },
  presentRange: function () {
    app.globalData.callType = 1;
    wx.navigateTo({
      url: '../callForm/callForm',
    })
  },
  rangeNumber:function(){
    var that=this;
    wx.request({
      url: 'http://localhost:7010/rangeNumber/',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        console.log(res.data);
        that.setData({
          onlineNumber:res.data.onlineNumber,
          presentNumber:res.data.presentNumber
        })
      }
    })
  }
})