// pages/details/details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:[],
    sortArray: '',
    user:[],
    currentImg: '',
    isCol: true
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sortArray: getApp().globalData.sortArray
    })
    // console.log(this.data.sortArray);
    var that = this;
    // 获取当前商品信息
    wx.request({
      method: 'GET',
      url: 'https://www.nefuer.cc/item?itemId=' + getApp().globalData.itemId,
      header: {
        'userId': getApp().globalData.userId,
        'openId': getApp().globalData.openId,
        'content-type': 'application/json'
      },
      success: function(res){
        console.log(res);
        console.log(that.data.sortArray.data);
        var tmp = 'item.sortId';
        that.setData({
          item: res.data.data,
          [tmp]: that.data.sortArray.data[res.data.data.sortId - 1].sortName
        })
        // console.log(that.data.sortArray.data[res.data.data.sortId].sortName);
        console.log(that.data.item);
        wx.request({
          url: 'https://www.nefuer.cc/info/' + that.data.item.publishId,
          method: 'GET',
          header: {
            'openId': getApp().globalData.openId,
            'content-type': 'application/json'
          },
          success:function(resss){
            that.setData({
              user: resss.data.data
            })
            console.log(that.data.user);
          }
          
        })
      }
    });
  },
  previewImage:function(e){
    var that = this;
    console.log(e);
    console.log(this.data.item.img);

    for (let i = 0; i < this.data.item.img.length; i++){
      let tmp = 'imgList['+i+']';
      console.log(this.data.item.img[i].imgUrl);
      this.setData({
        [tmp]: 'https://' + this.data.item.img[i].imgUrl
      })
    }

    // console.log(this.data.imgList);
    wx.request({
      url: 'https://www.nefuer.cc/img/' + e.target.id,
      header: {
        'openId': getApp().globalData.openId,
        'content-type': 'application/json'
      },
      success:function(res){
        console.log(res);
        that.setData({
          currentImg : res.data.data.imgUrl
        })
        console.log(that.data.currentImg);
        wx.previewImage({
          current: 'https://' + that.data.currentImg,
          urls: that.data.imgList, // 需要预览的图片http链接列表
        })
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