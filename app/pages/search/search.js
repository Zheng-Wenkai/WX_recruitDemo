// pages/search/search.js
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: [],
    rangeInfo: null, //编号
    imageSrc: null
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
  searchForm: function() {
    console.log(this.data.rangeInfo);
    var that = this;
    util.showBusy('查询中...')
    wx.request({
      url: 'http://localhost:7010/searchForm/',
      method: 'GET',
      data: {
        // rangeType: that.data.rangeInfo[0],
        // rangeNum: that.data.rangeInfo.slice(1, ),
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
          // 也可以尝试使用静态目录下载图片
          wx.downloadFile({
            url: 'http://localhost:7010/searchPic/' + that.data.info.studentId,
            success: function(res) {
              console.log(res);
              if (res.statusCode == 500) {
                that.setData({
                  imageSrc: '../../image/login.jpg'
                })
                util.showModel('获取用户照片失败', '该用户尚未上传个人照片');
              } else {
                util.showSuccess('查询成功');
                that.setData({
                  imageSrc: res.tempFilePath
                })
              }
            },
            fail: function(res) {
              that.setData({
                imageSrc: '../../image/login.jpg'
              })
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
  }
})