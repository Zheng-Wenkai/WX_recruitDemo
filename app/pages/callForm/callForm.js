// pages/callForm/callForm.js
const util = require('../../utils/util');
const config = require('../../config.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: [],
    num:0,
    imageSrc: '/images/my/avatar.png' //设置默认图片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.callForm();
    this.rangeNumber();
  },
  callForm: function() {
    var that = this;
    wx.request({
      url: config.callFormUrl,
      method: 'GET',
      data: {
        department: app.globalData.department,
        timeSlot: app.globalData.timeSlot
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res);
        if (res.data == null) {
          wx.showModal({
            showCancel: false,
            content: '已无用户处于排队状态',
            success: function(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1,
                })
              }
            }
          })
        } else {
          that.setData({
            info: res.data
          })
          // 也可以尝试使用静态目录下载图片
          wx.downloadFile({
            url: config.searchPicUrl + that.data.info.phoneNumber,
            success: function(res) {
              console.log(res);
              if (res.statusCode == 500) {
                util.showModel('获取用户照片失败', '该用户尚未上传个人照片');
              } else {
                that.setData({
                  imageSrc: res.tempFilePath
                })
              }
            },
            fail: function(res) {
              console.log(res);
              util.showModel('获取用户照片失败', '请检查网络连接是否正常')
            }
          })
        }
      },
      fail: function(res) {
        console.log(res);
        util.showModel('获取用户信息失败', '请检查网络连接是否正常');
      },
    })
  },
  rangeNumber: function() {
    var that = this;
    wx.request({
      url: config.rangeNumberUrl,
      method: 'GET',
      data: {
        department: app.globalData.department,
        timeSlot: app.globalData.timeSlot
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res);
        that.setData({
          num: res.data
        })
      }
    })
  },
  bePresent: function() {
    var that = this;
    wx.request({
      url: config.bePresentUrl,
      method: 'POST',
      data: {
        range: that.data.info.range,
        // callType: app.globalData.callType,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log('submit success', res.data, res.header, res.statusCode);
        that.callForm();
      },
      fail: function() {
        util.showModel('提交失败', '请检查网络是否正常连接');
      }
    })
  },
  notBePresent: function() {
    var that = this;
    wx.request({
      url: config.notBePresentUrl,
      method: 'POST',
      data: {
        range: that.data.info.range,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log('submit success', res.data, res.header, res.statusCode);
        that.callForm();
      },
      fail: function() {
        util.showModel('提交失败', '请检查网络是否正常连接');
      }
    })
  },
  bePresentConfirm: function() {
    var that = this;
    wx.showModal({
      content: '确认已到场？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          that.bePresent()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  notBePresentConfirm: function() {
    var that = this;
    wx.showModal({
      content: '确认未到场？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          that.notBePresent()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})