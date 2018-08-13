// pages/mine/set/set.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex:['未知','男','女'],
    wechatName: getApp().globalData.wechatName,
    gender: getApp().globalData.gender,
    profileImg: getApp().globalData.profileImg,
    openId: getApp().globalData.openId,

    addr: [ '新校区', '老校区', ],
    index:0,
    name:'',
    nickName: '',
    telNumber:''
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindName:function(e){
    this.data.name = e.detail.value;
    console.log(this.data.name);
  },
  bindNickname:function(e){
    this.data.nickName = e.detail.value;
    console.log(this.data.nickName);
  },
  bindtelNumber(e){
    console.log(e.detail.value.length);
    // if(e.detail.number.length != 11){

    // }
    this.data.telNumber = e.detail.value;
    console.log(this.data.telNumber);
  },
  submit:function(){
    var that = this;
    console.log(that.data.name, that.data.nickName, that.data.telNumber,that.data.addr[that.data.index]);
    if (that.data.name != '' && that.data.nickName != '' && that.data.telNumber != ''){
      if(that.data.telNumber.length != 11){
        wx.showModal({
          title: '提示',
          content: '请输入正确的手机号！',
        })
      } else {
        wx.request({
          url: 'https://www.nefuer.cc/info/',
          method: 'PUT',
          header: {
            'openId': getApp().globalData.openId,
            'content-type': 'application/json'
          },
          data: {
            userId: getApp().globalData.userId,
            name: that.data.name,
            telNumber: that.data.telNumber,
            address: that.data.addr[that.data.index]
          },
          success: function (res) {
            console.log(res);
            if (res.data.data) {
              wx.showModal({
                title: '提示信息',
                content: '修改成功！',
              })
            } else {
              wx.showModal({
                title: '修改失败',
                content: '修改失败，请检查文字格式！',
              })
            }
          }
        })
      }
    } else {
      wx.showModal({
        title: '提示信息',
        content: '姓名，昵称，电话号码都不能为空哦！',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var wx_userInfo = wx.getStorageSync('wx_userInfo');
    this.setData({
      wechatName: wx_userInfo.nickName,
      gender: this.data.sex[wx_userInfo.gender],
      profileImg: wx_userInfo.avatarUrl,
      openId: wx.getStorageSync('openId'),
    })
    wx.request({
      url: 'https://www.nefuer.cc/info/' + wx.getStorageSync('userId'),
      header: {
        'openId': wx.getStorageSync('openId'),
        'content-type': 'application/json'
      },
      success:function(res){
        if(res.data.data.address == '老校区'){
          that.setData({
            index: 1
          })
        } else if (res.data.data.address == '新校区'){
          that.setData({
            index: 0
          })
        }
        console.log(that.data.addr[that.data.index]);
        that.setData({
          name: res.data.data.name,
          nickName: res.data.data.wechatName,
          telNumber: res.data.data.telNumber
        })
        console.log(that.data.name,that.data.nickName,that.data.telNumber);
      }
    })
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