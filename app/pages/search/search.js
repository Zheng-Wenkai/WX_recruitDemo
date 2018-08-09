// pages/search/search.js
const util = require('../../utils/util')
const config = require('../../config.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: [],
    rangeInfo: null, //编号
    imageSrc: '../../images/my/avatar.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  getRange: function(e) {
    this.setData({
      rangeInfo: e.detail.value
    })
  },
  searchForm: function(e) {
    //e.detail.value可以在用户点击完成后得到输入框的信息
    var that = this;
    util.showBusy('查询中...')
    wx.request({
      url: config.searchFormUrl,
      method: 'GET',
      data: {
        rangeNum: that.data.rangeInfo
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res.data);
        if (res.data == null) {
          util.showModel('获取用户信息失败', '不存在该用户');
        } else {
          that.setData({
            info: res.data
          })
          app.globalData.phoneNumber=that.data.info.phoneNumber
          // 也可以尝试使用静态目录下载图片
          wx.downloadFile({
            url: config.searchPicUrl + that.data.info.phoneNumber,
            success: function(res) {
              console.log(res);
              if (res.statusCode == 500) {
                util.showModel('获取用户照片失败', '该用户尚未上传个人照片');
              } else {
                util.showSuccess('查询成功');
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
  onCancelImgTap: function(event) {
    this.setData({
      searchPanelShow: false,
    })
  },
  onBindFoucs: function(event) {
    this.setData({
      searchPanelShow: true
    })
  },
  onBindBlur: function(event) {
    var text = event.detail.value;
  },
  turnToDisplay: function() {
    wx.navigateTo({
      url: '../display/display',
    })
  }

})