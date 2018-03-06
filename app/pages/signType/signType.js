// pages/signType/signType.js
const app=getApp();
const util=require('../../utils/util.js')
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

  onlineSign:function(){
    let time=new Date();
    if((time.getHours()>12&&time.getHours()<12)||(time.getHours()>12&&time.getHours()<18)){
      util.showModel("线上报名入口已关闭","请到现场后通过现场报名入口报名")
    }
    else{
      app.globalData.signWay = 0;
      wx.navigateTo({
        url: '../signForm/signForm',
      })
    }
  },
  presentSign:function(){
    let time = new Date();
    if ((time.getHours() > 8 && time.getHours() < 12) || (time.getHours() > 12 && time.getHours() < 18)) {
      app.globalData.signWay = 1;
      wx.navigateTo({
        url: '../signForm/signForm',
      })
    }
    else {
      util.showModel("现场报名入口已关闭", "请通过线上报名入口报名")
    }
  }
})