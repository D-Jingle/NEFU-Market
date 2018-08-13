// pages/user-info/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex:['未知','男','女'],
    name: '',
    nickName: '',
    telNumber: '',
    array: ['新校区', '老校区'],
    index: 0,
    wechatName: '',
    gender: '',
    profileImg: '',
    openId: '',
  },

  onLoad: function (options) {
    var that = this;
    var wx_userInfo = wx.getStorageSync('wx_userInfo');
    this.setData({
      wechatName: wx_userInfo.nickName,
      gender: this.data.sex[wx_userInfo.gender],
      profileImg: wx_userInfo.avatarUrl,
      openId: wx.getStorageSync('openId'),
    })
    console.log(this.data.wechatName, this.data.gender, this.data.profileImg, this.data.openId);
  },

  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  bindNickname: function (e) {
    this.setData({
      nickName: e.detail.value
    })
  },
  bindName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindNum: function (e) {
    this.setData({
      telNumber: e.detail.value
    })
  },

  submit: function (e) {
    var that = this;
    if(this.data.telNumber.length != 11){
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号！',
      })
    } else {
      wx.request({
        method: 'POST',
        url: 'https://www.nefuer.cc/signup',
        data: {
          wechatName: that.data.nickName,
          gender: that.data.gender,
          profileImg: that.data.profileImg,
          name: that.data.name,
          telNumber: that.data.telNumber,
          address: that.data.array[that.data.index],
          openId: wx.getStorageSync('openId'),
          sessionKey: "asdsa"
        },
        header: {
          'openId': wx.getStorageSync('openId'),
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 0) {
            wx.setStorageSync('userId', res.data.data);
            getApp().globalData.userId = res.data.data;
            console.log(getApp().globalData.userId, wx.getStorageSync('userId'));
            wx.showToast({
              title: '提交成功',
              icon: 'success'
            })
            setTimeout(function () {
              wx.switchTab({
                url: '../home/index',
              })
            }, 2000)
          } else if (res.data.code == 2) {
            wx.setStorageSync('userId', res.data.data);
            getApp().globalData.userId = res.data.data;
            wx.getUserInfo({
              success: function (res_info) {
                wx.setStorageSync('wx_userInfo', res_info.userInfo);
              }
            })
            wx.showToast({
              title: '您已注册过,将自动跳转主页面',
              icon: 'none'
            })
            setTimeout(function () {
              wx.switchTab({
                url: '../home/index',
              })
            }, 2000)
          } else {
            wx.showToast({
              title: '提交失败',
              icon: 'none'
            })
          }
        }
      })
    }

  }
})