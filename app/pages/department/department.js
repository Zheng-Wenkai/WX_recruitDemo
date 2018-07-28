const util = require('../../utils/util');
Page({
    data: {
        departments: ['', '自科部', '社科部', '新闻部', '运营部', '宣传部', '策划部', '项目部', '外联部', '办公室', '财务部', '竞赛部'],
        index:0
    },
    bindDepartChange:function(e){
        this.setData({
            index: e.detail.value
        })
    },
    formSubmit: function(e){
        if (e.detail.value.index == 0) {
            util.showModel('无法提交', '请选择部门');
        } else {
            //部门名
            console.log(e.detail.value.index);
        }
    }
})