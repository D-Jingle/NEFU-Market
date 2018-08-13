//获取应用实例
var app = getApp();
Page({
  data: {
    gender: ['男', '女'],
    swImgUrls: [
      '../../common/img/1.jpg',
      '../../common/img/2.jpg',
      '../../common/img/3.jpg',
    ],
    issueImg: '../../common/img/recommend.png',
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    code: '',
    menu: [
      {
        imgurl: '../../common/img/1111111.png',
        descs: '公告',
        tapUrl: 'memu1/memu1'
      },
      {
        imgurl: '../../common/img/2222222.png',
        descs: '使用须知',
        tapUrl: 'memu2/memu2'
      },
      {
        imgurl: '../../common/img/3333333.png',
        descs: '团队招募',
        tapUrl: 'memu3/memu3'
      },
      {
        imgurl: '../../common/img/5555555.png',
        descs: '敬请期待',
        tapUrl: '#'
      }
    ]
    ,
    item: [],
    page: 1,
    loading: false,
    bottom: false,
    userId:'',
    openId:''
  },
  //事件处理函数
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '易货'
    })
  },
  
  onLoad: function () {
    let userId = wx.getStorageSync('userId');
    let openId = wx.getStorageSync('openId');
    var that = this;
    // 获取分类信息
    wx.request({
      url: 'https://www.nefuer.cc/sort',
      success: function (res) {
        getApp().globalData.sortArray = res.data;
      }
    })
    // 用户进入小程序便判断是否已经授权
    if(userId){ 
      console.log('userId存在:' + userId);
      // 本地缓存存在userId，说明已经注册账号
      // 根据userId获取用户信息,获取商品信息
      // 获取用户信息
      wx.request({
        url: 'https://www.nefuer.cc/info/' + userId,
        header: {
          'openId': wx.getStorageSync('openId'),
          'content-type': 'application/json'
        },
        success:function(res){
          getApp().globalData.name = res.data.data.name,
          getApp().globalData.telNumber = res.data.data.telNumber,
          getApp().globalData.address = res.data.data.address
          getApp().globalData.openId = wx.getStorageSync('openId');
          console.log(getApp().globalData.name, getApp().globalData.telNumber, getApp().globalData.address, getApp().globalData.openId);
        }
      });
    } else if (!userId){
      if(openId){ 
      // openId 存在，但是userId不存在，说明只授权未注册填写信息，跳转到注册信息页面
        console.log('userId不存在，openid存在:' + openId);
        wx.redirectTo({
          url: '../user-info/index',
        })
      } else if(!openId) { 
        // openId userId 都不存在,跳转至授权页面
        console.log('userId,openId都不存在');
        wx.redirectTo({
          url: '../can/can',
        })
      }
    }

    // 获取商品信息
    wx.request({
      url: 'https://www.nefuer.cc/item/?page=' + that.data.page,
      method: 'GET',
      header: {
        'openId': wx.getStorageSync('openId'),
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(wx.getStorageSync('openId'));
        console.log(res);
        let curItem = '';
        curItem = res.data.data;
        that.setData({
          item: that.data.item.concat(curItem)
        }),
          console.log(that.data.item);
      }
    })
  },
  // 点击跳转发布
  toIssue:function(){
    wx.navigateTo({
      url: '../mine/issue/issue',
    })
  },

  // onload之外
  onReachBottom: function () {
    var that = this;
    // 该方法绑定了页面滑动到底部的事件
    this.setData({
      loading: true
    })
    this.setData({
      page: this.data.page + 1
    })
    wx.request({
      url: 'https://www.nefuer.cc/item/?page=' + that.data.page,
      method: 'GET',
      header: {
        'openId': getApp().globalData.openId,
        'content-type': 'application/json'
      },
      success: function (res) {
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

  toDetails: function (e) {
    console.log(e);
    getApp().globalData.itemId = e.currentTarget.id;
    wx.navigateTo({
      url: '../details/details',
    })
  },

  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      loading: false,
      item: [],
      bottom: false
    })
    var that = this;
    wx.request({
      url: 'https://www.nefuer.cc/sort',
      success: function (res) {
        getApp().globalData.sortArray = res.data;
      }
    })
    // 获取用户信息
    wx.getUserInfo({
      success: function (res) {
        getApp().globalData.hasLogin = true,
          getApp().globalData.wechatName = res.userInfo.nickName,
          getApp().globalData.gender = that.data.gender[res.userInfo.gender - 1],
          getApp().globalData.profileImg = res.userInfo.avatarUrl
      }
    })

    wx.getSetting({
      success(res) {
        // 1.如果没有授权则跳转至授权页面
        if (!res.authSetting['scope.userInfo']) {
          wx.redirectTo({
            url: '../can/can',
          })
        }
        // 2.如果已经授权   
        if (res.authSetting['scope.userInfo']) {
          console.log(wx.getStorageSync('openId'));
          console.log(wx.getStorageSync('code'));
          getApp().globalData.openId = wx.getStorageSync('openId');
          wx.request({
            method: 'POST',
            url: 'https://www.nefuer.cc/signup',
            header: {
              'openId': wx.getStorageSync('openId'),
              'content-type': 'application/json'
            },
            data: {

            },
            success: function (result) {
              console.log(result);
              console.log(wx.getStorageSync('openId'));
              if (result.data.code == 2) {
                // 用户已经被注册
                getApp().globalData.userId = result.data.data.userId;
                wx.request({
                  url: 'https://www.nefuer.cc/info/' + getApp().globalData.userId,
                  header: {
                    'openId': wx.getStorageSync('openId'),
                    'content-type': 'application/json'
                  },
                  success: function (ress) {
                    getApp().globalData.name = ress.data.data.name,
                      getApp().globalData.telNumber = ress.data.data.telNumber,
                      getApp().globalData.address = ress.data.data.address
                    getApp().globalData.openId = wx.getStorageSync('openId');
                    // 获取商品信息
                    wx.request({
                      url: 'https://www.nefuer.cc/item/?page=' + that.data.page,
                      method: 'GET',
                      header: {
                        'openId': wx.getStorageSync('openId'),
                        'content-type': 'application/json'
                      },
                      success: function (res) {
                        console.log(wx.getStorageSync('openId'));
                        console.log(res);
                        let curItem = '';
                        curItem = res.data.data;
                       
                      }
                    })
                  }
                })
              } else if (result.data.code == 0) {
                // 用户未被注册
                wx.redirectTo({
                  url: '../user-info/index'
                })
              }
            }
          })
        }
      }
    })

    // 获取商品信息
    wx.request({
      url: 'https://www.nefuer.cc/item/?page=' + that.data.page,
      method: 'GET',
      header: {
        'openId': getApp().globalData.openId,
        'content-type': 'application/json'
      },
      success: function (res) {
        let curItem = '';
        curItem = res.data.data;
        that.setData({
          item: that.data.item.concat(curItem)
        }),
          console.log(that.data.item);
      }
    })
    wx.stopPullDownRefresh();//关闭下拉刷新
  }

})