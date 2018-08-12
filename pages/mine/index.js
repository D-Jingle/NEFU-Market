// pages/mine/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wechatName: getApp().globalData.wechatName,
    gender: getApp().globalData.gender,
    profileImg: getApp().globalData.profileImg,
    openId: getApp().globalData.openId,

    data: [
      {
        title: '我要发布',
        imgUrls: '../../common/img/issue.png',
        navUrl: 'issue/issue',
      },
      {
        title: '我的发布',
        imgUrls: '../../common/img/sale.png',
        navUrl: 'issued/issued',
      },
      {
        title: '我的收藏(敬请期待)',
        imgUrls: '../../common/img/collect.png',
        navUrl: '#',
      },
      {
        title: '修改个人资料',
        imgUrls: '../../common/img/set.png',
        navUrl: 'set/set',
      }
    ],
    imgUrl: '../../common/img/arrowright.png',
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '易货'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      wechatName: getApp().globalData.wechatName,
      gender: getApp().globalData.gender,
      profileImg: getApp().globalData.profileImg,
      openId: getApp().globalData.openId
    })
    // wx.request({
    //   url: 'https://www.nefuer.cc/item/?sortId=1&page=1',
    //   header: { 
    //     'openId': getApp().globalData.openId,
    //     'content-type': 'application/json'
    //   },
    //   success:function(res){
    //     console.log(res);
    //   }
    // })
    // console.log(getApp().globalData.profileImg);
    // console.log(getApp().globalData.openId);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})