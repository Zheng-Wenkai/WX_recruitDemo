// pages/department/department.js
const app = getApp();
const util = require('../../utils/util');
Page({
  data: {
    departments: ['', '自科部', '社科部', '新闻部', '运营部', '宣传部', '策划部', '项目部', '外联部', '办公室', '财务部', '竞赛部'],
    timeSlot: ['', '9月15日8:00-9:00', '9月15日9:00-10:00', '9月15日10:00-11:00'],
    shijian:0,
    index: 0
  },
  bindDepartChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  bindTimeSlotChange: function (e) {
    this.setData({
      shijian: e.detail.value
    })
  },
  formSubmit: function (e) {
    if (e.detail.value.index == 0 || e.detail.value.shijian == 0) {
      util.showModel('无法提交', '请填写完整');
    } else {
      app.globalData.department = this.data.departments[e.detail.value.index];
      app.globalData.timeSlot = this.data.timeSlot[e.detail.value.shijian],
      console.log(app.globalData.department);
      console.log(app.globalData.timeSlot);
      wx.navigateTo({
        url: '../callForm/callForm',
      })
    }
  }
})