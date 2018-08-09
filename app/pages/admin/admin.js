// pages/staff/staff.js
Page({
    data: {

    },
    turnToIndex: function() {
        wx.navigateBack({
            url: '../index/index',
        })
    },
    interviewClick: function() {
        wx.navigateTo({
            url: '../inlogin/inlogin',
        })
    },
    personelClick: function() {
        wx.navigateTo({
          url: '../perlogin/perlogin',
        })
    }
})