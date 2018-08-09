const util = require('../../utils/util');
const config = require('../../config.js')
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pics: [],
    //arrarys
    college: ['', '数学与信息学院', '材料与能源学院', '工程学院', '国际教育学院', '经济管理学院', '林学与风景园林学院', '园艺学院', '资源环境学院', '电子工程学院', '动物科学学院', '海洋学院', '兽医学院', '水利与土木工程学院', '人文与法学学院', '公共管理学院', '外国语学院', '食品学院', '艺术学院', '农学院', '生命科学学院'],
    gender: ['', '男', '女'],
    timeSlot: ['', '9月15日8:00-9:00', '9月15日9:00-10:00', '9月15日10:00-11:00'],
    departments: ['', '自科部', '社科部', '新闻部', '运营部', '宣传部', '策划部', '项目部', '外联部', '办公室', '财务部', '竞赛部'],
    //pickers
    phoneNumber: null,

    xueyuan: null,
    xingbie: null,
    shijian: null,
    wishA: null,
    wishB: null,
    isuploadpic: false,
    openid: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getInfo();
  },
  getInfo: function() {
    var that = this;
    wx.request({
      url: config.myUrl,
      method: 'GET',
      data: {
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data != null) {
          wx.navigateBack({
            delta: 1,
          })
          util.showMessage('你已报名');
        }
      },
      fail: function(res) {
        console.log(res);
        util.showModel('获取用户信息失败', '请检查网络连接是否正常');
      },

    })
  },
  // 获取form里面的所有内容，并提交
  formSubmit: function(e) {
    var that = this;
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (e.detail.value.fullName == "" || e.detail.value.major == "" || e.detail.value.phoneNumber == "" || e.detail.value.xueyuan == null || e.detail.value.xingbie == null || e.detail.value.wishA == null || e.detail.value.shijian == null) {
      util.showModel('无法提交', '请将表单信息填写完整');
    } else if (this.data.isuploadpic == false) {
      util.showModel('无法提交', '请先上传个人照片');
    } else {
      wx.request({
        url: config.signNumberUrl,
        data: {
          department: that.data.departments[e.detail.value.wishA],
          timeSlot: that.data.timeSlot[e.detail.value.shijian],
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res) {
          console.log(res.data);
          var signNumber = res.data;
          if (signNumber > 3) {
            util.showModel('该时间段报名人数已满', '请选择其他时间段')
          } else {
            util.showBusy('正在提交');
            wx.request({
              url: config.uploadFormUrl,
              data: {
                fullName: e.detail.value.fullName,
                major: e.detail.value.major,
                phoneNumber: e.detail.value.phoneNumber,
                introduction: e.detail.value.introduction,
                college: that.data.college[e.detail.value.xueyuan],
                gender: that.data.gender[e.detail.value.xingbie],
                departmentsA: that.data.departments[e.detail.value.wishA],
                departmentsB: that.data.departments[e.detail.value.wishB],
                timeSlot: that.data.timeSlot[e.detail.value.shijian],
                interviewResult: 0, // 0未面试，1已面试，2通过面试，3感谢参与
                openid: app.globalData.openid
              },
              method: 'POST',
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function(res) {
                console.log(res.data);
                wx.navigateBack({
                  delta: 1,
                })
                util.showSuccess('提交成功');
              },
              fail: function() {
                util.showModel('提交失败', '请检查网络是否正常连接');
              }
            })
          }
        },
      })

    }
  },
  // 获取对应的内容，修改data
  bindGenderChange: function(e) {
    this.setData({
      xingbie: e.detail.value
    })
  },
  bindCollegeChange: function(e) {
    this.setData({
      xueyuan: e.detail.value
    })
  },
  bindTimeSlotChange: function(e) {
    this.setData({
      shijian: e.detail.value
    })
  },
  bindDepartAChange: function(e) {
    this.setData({
      wishA: e.detail.value
    })
  },
  bindDepartBChange: function(e) {
    this.setData({
      wishB: e.detail.value
    })
  },
  bindPhoneNumberChange: function(e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },
  uploadPic: function() {
    var that = this;
    // 选择图片
    console.log(that.data.phoneNumber)
    if (that.data.phoneNumber == null) {
      util.showMessage("请将个人信息填写完整");
    } else {
      wx.chooseImage({
        count: 1, // 可选图片张数
        sizeType: ['compressed'], // 使用压缩图
        sourceType: ['album', 'camera'], // 来源为相册或相机
        success: function(res) {
          var tempFilePaths = res.tempFilePaths
          // 上传图片
          wx.uploadFile({
            url: config.uploadPicUrl,
            filePath: tempFilePaths[0], // 上传第一张图片
            name: 'picture',
            header: {
              'content-type': 'multipart/form-data'
            },
            formData: {
              'phoneNumber': that.data.phoneNumber
            },
            success: function(res) {
              console.log(res.data);
              that.data.isuploadpic = true; // 最好放在success里面，但为了防止因未知错误导致用户无法报名，故外移。
              util.showSuccess('上传图片成功')
            },
            fail: function(res) {
              console.log(res);
              util.showMessage('上传图片失败')
            }

          })
        }
      })
    }
  },
  uploadWork: function() {
    var that = this,
      pics = this.data.pics;
    if (that.data.phoneNumber == null) {
      util.showMessage("请将个人信息填写完整");
    } else {
      wx.chooseImage({
        count: 5 - pics.length, // 可选图片张数
        sizeType: ['compressed'], // 使用压缩图
        sourceType: ['album', 'camera'], // 来源为相册或相机
        success: function(res) {
          var imgsrc = res.tempFilePaths;
          pics = pics.concat(imgsrc);
          that.setData({
            pics: pics
          });
          that.uploadimg({
            url: config.uploadPicUrl, //这里是你图片上传的接口
            path: that.data.pics //这里是选取的图片的地址数组
          });
        }
      })
    }
  },
  uploadimg(data) {
    var that = this,
      i = data.i ? data.i : 0, //当前上传的哪张图片
      success = data.success ? data.success : 0, //上传成功的个数
      fail = data.fail ? data.fail : 0; //上传失败的个数
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'picture', //这里根据自己的实际情况改
      formData: {
        'phoneNumber': that.data.phoneNumber + i
      },
      success: (resp) => {
        success++; //图片上传成功，图片上传成功的变量+1
        console.log(resp)
        console.log(i);
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
      },
      fail: (res) => {
        fail++; //图片上传失败，图片上传失败的变量+1
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        console.log(i);
        i++; //这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) { //当图片传完时，停止调用          
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
        } else { //若图片还没有传完，则继续调用函数
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }
      }
    });
  }

})