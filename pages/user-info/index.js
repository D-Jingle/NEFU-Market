// pages/user-info/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    this.setData({
      wechatName: getApp().globalData.wechatName,
      gender: getApp().globalData.gender,
      profileImg: getApp().globalData.profileImg,
      openId: getApp().globalData.openId
    })
    // console.log(getApp().globalData.profileImg);
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
        'openId': getApp().globalData.openId,
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        // console.log(getApp().globalData.openId);
        if (res.data.code == 0) {
          getApp().globalData.userId = res.data.data;
          console.log(getApp().globalData.userId);
          // getApp().globalData.hasSignUp = true;
          wx.showToast({
            title: '提交成功',
            icon: 'success'
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
})