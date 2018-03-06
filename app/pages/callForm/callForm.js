// pages/callForm/callForm.js
const util = require('../../utils/util');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: [],
    imageSrc: '../../image/login.jpg'//设置默认图片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.callForm();
  },
  callForm: function () {
    var that = this;
    console.log(app.globalData.callType);
    wx.request({
      url: 'http://localhost:7010/callForm/',
      method: 'GET',
      data: {
        callType: app.globalData.callType
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        if (res.data == null) {
          wx.showModal({
            title:'获取用户信息失败',
            showCancel:false,
            content: '已无用户处于排队状态',
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({ delta: 1, })
              } 
            }
          })
        }
        else {
          that.setData({
            info: res.data
          })
          // 也可以尝试使用静态目录下载图片
          wx.downloadFile({
            url: 'http://localhost:7010/searchPic/' + that.data.info.studentId,
            success: function (res) {
              console.log(res);
              if (res.statusCode == 500) {
                util.showModel('获取用户照片失败', '该用户尚未上传个人照片');
              }
              else {
                that.setData({
                  imageSrc: res.tempFilePath
                })
              }
            },
            fail: function (res) {
              console.log(res);
              util.showModel('获取用户照片失败', '请检查网络连接是否正常')
            }
          })
        }
      },
      fail: function (res) {
        console.log(res);
        util.showModel('获取用户信息失败', '请检查网络连接是否正常');
      },
    })
  },
  isInterview: function () {
    var that = this;
    wx.request({
      url: 'http://localhost:7010/isInterview',
      method: 'POST',
      data: {
        range: that.data.info.range,
        callType: app.globalData.callType,

      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log('submit success', res.data, res.header, res.statusCode);
        that.callForm();
      },
      fail: function () {
        util.showModel('提交失败', '请检查网络是否正常连接');
      }
    })
  },
  notInterview: function () {
    var that = this;
    wx.request({
      url: 'http://localhost:7010/notInterview',
      method: 'POST',
      data: {
        range: that.data.info.range,
        callType: app.globalData.callType,

      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log('submit success', res.data, res.header, res.statusCode);
        that.callForm();
      },
      fail: function () {
        util.showModel('提交失败', '请检查网络是否正常连接');
      }
    })
  },
  isInterviewConfirm:function(){
    var that=this;
    wx.showModal({
      content: '确认已到场？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          that.isInterview()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  notInterviewConfirm:function(){
    var that=this;
    wx.showModal({
      content: '确认未到场？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          that.notInterview()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})