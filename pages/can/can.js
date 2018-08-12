// pages/can/can.js
Page({

  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    code: '',
    gender: ['男', '女']
  },
  onLoad: function () {
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.setStorageSync('code', res.code);
          wx.request({
            method: 'POST',
            url: 'https://www.nefuer.cc/openid',
            data: {
              code: res.code
            },
            success: function (resdata) {
              if (resdata.data.data.openId) {
                wx.setStorageSync('openId', resdata.data.data.openId);
                getApp().globalData.openId = resdata.data.data.openId;
                console.log("允许授权自动获取用户openID：" + getApp().globalData.openId)
              }
            },
          })
        }
      }
    })
  },
  // 用户点击页面授权按钮
  bindGetUserInfo: function (e) {
    // 1. 用户按了弹框允许授权按钮
    if (e.detail.userInfo) {
      // 1.1 自动登陆获取用户openid
      var that = this;
      // 1.2 获取用户基本信息
      getApp().globalData.hasLogin = true,
        getApp().globalData.wechatName = e.detail.userInfo.nickName,
        getApp().globalData.gender = this.data.gender[e.detail.userInfo.gender - 1],
        getApp().globalData.profileImg = e.detail.userInfo.avatarUrl,

        // 1.3判断持有此openId用户是否已经被注册p
        wx.request({
          method: 'POST',
          header: {
            'openId': getApp().globalData.openId,
            'content-type': 'application/json'
          },
          url: 'https://www.nefuer.cc/signup',
          data: {

          },
          success: function (res) {
            console.log("进入是否被注册")
            console.log("openId:" + getApp().globalData.openId)
            // 1.3.1 已经被注册,则根据用户userid请求用户信息 不需要注册
            if (res.data.code == 2) {
              // getApp().globalData.hasSignUp == true;
              console.log("" + res.data.data.userId);
              getApp().globalData.userId = res.data.data.userId,
                console.log(getApp().globalData.userId)
              wx.request({
                url: 'https://www.nefuer.cc/info/' + getApp().globalData.userId,
                success: function (resData) {
                  getApp().globalData.name = res.data.name,
                    getApp().globalData.telNumber = res.data.telNumber,
                    getApp().globalData.addr = res.data.addr,
                    wx.showToast({
                      title: '您已注册，将自动跳转主页面',
                      icon: 'success'
                    })
                  setTimeout(function () {
                    wx.switchTab({
                      url: '../home/index',
                    })
                  }, 1)
                }
              })
            } else if (res.data.code == 0 && getApp().globalData.hasSignUp == false) { // 需要被注册
              // 1.3.2 未被注册
              console.log("res.data.code:" + res.data.data)
              wx.showToast({
                title: '授权成功',
                icon: 'success'
              });

              setTimeout(function () {
                wx.redirectTo({
                  url: '../user-info/index',
                })
              }, 2)
            }
          }
        })
    } else {
      // 2.用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  }
})