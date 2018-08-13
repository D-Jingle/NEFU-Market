// pages/mine/issued/issued.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: [],
    page: 1,
    loading: false,
    bottom: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(wx.getStorageSync('userId'));
    wx.request({
      url: 'https://www.nefuer.cc/item?publishId=' + wx.getStorageSync('userId')+ '&page=1',
      header: {
        'openId': getApp().globalData.openId,
        'content-type': 'application/json'
      },
      method: 'GET',
      success:function(res){
        // 数量小于分页数量 提示栏显示无更多数据
        if (res.data.data.length < res.data.page.pageSize) {
          that.setData({
            bottom: true
          })
          // console.log(that.data.bottomList[that.data.curIndex].bottom);
        };
        that.setData({
          item:res.data.data
        })
      }
    })
  },
  // 页面滑动到底部请求信息
  onReachBottom: function () {
    console.log('到底le');
    var that = this;
    this.setData({
      loading: true
    })
    this.setData({
      page: this.data.page + 1
    })
    wx.request({
      url: 'https://www.nefuer.cc/item?publishId=' + wx.getStorageSync('userId') + '&page=' + that.data.page,
      method: 'GET',
      header: {
        'openId': getApp().globalData.openId,
        'content-type': 'application/json'
      },
      success: function (res) {
        // 数量小于分页数量 提示栏显示无更多数据
        if (res.data.data.length < res.data.page.pageSize) {
          that.setData({
            bottom: true
          })
        }
        console.log(that.data.page, res.data.page.totalPage)
        if (that.data.page <= res.data.page.totalPage) {
          let curItem = '';
          curItem = res.data.data;
          that.setData({
            item: that.data.item.concat(curItem),
            loading: false
          }),
            console.log(that.data.item);
        } else {
          that.setData({
            bottom: true
          })
        }
      }
    })
  },

  toEdit: function (e) {
    // console.log(e);
    getApp().globalData.itemId = e.currentTarget.id;
    wx.navigateTo({
      url: 'edit/edit',
    })
  },

  deleItem:function (e) {
    var that = this;
    let itemId = e.currentTarget.id;
      wx.showModal({
        title: '确认删除？',
        content: '删除了商品就没啦',
        success: function(res){
          console.log(res);
          if (res.confirm){
            wx.request({
              url: 'https://www.nefuer.cc/item/' + itemId,
              header: {
                'openId': getApp().globalData.openId,
                'content-type': 'application/json'
              },
              method:'DELETE',
              success:function(res){
                console.log(res);
                if(res.data.code == 0){
                  // console.log('商品删除成功！');
                  wx.showToast({
                    title: '删除成功',
                    duration: 2000
                  })
                  setTimeout(function () {
                    that.refresh();
                  }, 2000);
                }
              }
            })
          }else{
            console.log('用户点击取消');
          }
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
    this.setData({
      page: 1,
      loading: false,
      bottom: false,
    })
    var that = this;
    console.log(getApp().globalData.userId);
    wx.request({
      url: 'https://www.nefuer.cc/item?publishId=' + getApp().globalData.userId + '&page=1',
      header: {
        'openId': getApp().globalData.openId,
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        console.log(res);
        // 数量小于分页数量 提示栏显示无更多数据
        if (res.data.data.length < res.data.page.pageSize) {
          that.setData({
            bottom: true
          })
        }
        that.setData({
          page: 1,
          item: res.data.data
        })
      }
    })
    wx.stopPullDownRefresh();//关闭下拉刷新
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  refresh:function(){
    this.setData({
      page: 1,
      loading: false,
      bottom: false,
    })
    var that = this;
    console.log(getApp().globalData.userId);
    wx.request({
      url: 'https://www.nefuer.cc/item?publishId=' + getApp().globalData.userId + '&page=1',
      header: {
        'openId': getApp().globalData.openId,
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          item: res.data.data,
          page: 1,
        })
      }
    })
  }
})