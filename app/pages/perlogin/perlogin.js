const util=require('../../utils/util');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    password:null,
    username:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  getUsername: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  getPassword: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  loginClick: function (e) {
    app.globalData.userInfo = { username: this.data.username, password: this.data.password }
    if (app.globalData.userInfo.username == 'personel' && app.globalData.userInfo.password == 'aie2018!') {
      util.showSuccess('登录成功');
      wx.redirectTo({
        url: '../callType/callType',
      })
    }
    else {
      util.showModel('登录失败','账户或密码错误');
    } 
  }
})