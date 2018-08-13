// pages/can/can.js
Page({

  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    code: '',
    gender: ['男', '女']
  },

  onLoad: function () {
   
  },
  // 用户点击页面授权按钮
  bindGetUserInfo: function (e) {
    // 1. 用户按了弹框允许授权按钮
    if (e.detail.userInfo) {
      wx.login({ // 自动登陆获取code
        success: function (res) {
          if (res.code) {
            var code = res.code;
            wx.getUserInfo({ // 获取用户信息
              success: function (res_info) {
                wx.setStorageSync('wx_userInfo', res_info.userInfo);
                getApp().globalData.wx_userInfo = res_info.userInfo;
                console.log(getApp().globalData.wx_userInfo);
                wx.request({  // 根据code获取openid
                  method: 'POST',
                  url: 'https://www.nefuer.cc/openid',
                  data: {
                    code: res.code
                  },
                  success: function (resdata) {
                    if (resdata.data.data.openId) {
                      wx.setStorageSync('openId', resdata.data.data.openId);
                      getApp().globalData.openId = resdata.data.data.openId;
                      console.log("允许授权自动获取用户openId：" + wx.getStorageSync('openId'));
                      // 判断这个openId是否被注册
                      wx.request({
                        method: 'POST',
                        url: 'https://www.nefuer.cc/signup',
                        data: {},
                        header: {
                          'openId': wx.getStorageSync('openId'),
                          'content-type': 'application/json'
                        },
                        success: function (res) {
                          console.log(res);
                          if (res.data.code == 0) {
                            console.log('未被注册');
                            wx.redirectTo({
                              url: '../user-info/index',
                            })
                          }
                          // 已经注册，发送请求获取openid
                          else if (res.data.code == 2) {
                            wx.setStorageSync('userId', res.data.data.userId);
                            getApp().globalData.userId = res.data.data.userId;
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
                    } else {
                      console.log('获取openId失败');
                    }
                  },
                })
              }
            })
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