Page({
  data: {
    listTab: [
      {
        sortName: '全部',
        sortId: '0',
        sortIndex: '0'
      }
    ], // 标签页分类信息
    curIndex: 0, // 标记当前选中标签页
    curText: null, // 标记当前选中文字
    scrollLength: 0,
    itemList: [
      {

      }
    ],
    pageList: [
      {
        page: 1
      }
    ],
    bottomList: [
      {
        bottom: false
      },
    ],
    loadingList: [
      {
        loading: false
      }
    ]
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '易货'
    })
  },

  onLoad: function () {
    var that = this;
    // console.log(this.data.listTab);
    // 请求分类信息
    wx.request({
      url: 'https://www.nefuer.cc/sort',
      success: function (res) {
        // console.log(res);
        for(let i=1; i<res.data.data.length+1; i++){
          let sortName = 'listTab[' + i + '].sortName';
          let sortId = 'listTab[' + i + '].sortIndex';
          let sortIndex = 'listTab[' + i + '].sortId';
          that.setData({
            [sortName]: res.data.data[i-1].sortName,
            [sortId]: res.data.data[i-1].sortId,
            [sortIndex]: res.data.data[i-1].sortIndex,
          })
        }
        // console.log(that.data.listTab2);
        // console.log(that.data.listTab);
        that.initData(0);
        // 初始化数据
        for (let j = 0; j < that.data.listTab.length; j++){
          let tmp1 = 'pageList[' + j + '].page';
          let tmp2 = 'bottomList[' + j + '].bottom';
          let tmp3 = 'loadingList[' + j + '].loading';
          that.data.pageList[0].page = 1;
          that.data.loadingList[0].loading = false;
          that.setData({
            [tmp1]: 1,
            [tmp2]: false,
            [tmp3]: false,
          })
          // console.log(that.data.pageList[0].page);
        }
        // console.log(that.data.pageList,that.data.bottomList,that.data.loadingList);
        
      }
    });
    // 分页请求全部分类商品信息
    wx.request({
      url: 'https://www.nefuer.cc/item/?page=' + 1,
      method: 'GET',
      header: {
        'openId': getApp().globalData.openId,
        'content-type': 'application/json'
      },
      success: function (res) {
        // console.log(that.data.pageList, res.data.page.totalPage)
        if (that.data.pageList[0].page <= res.data.page.totalPage) {
          // console.log(res.data.data);
          let curItem = '';
          curItem = res.data.data;
          let tmp1 = 'loadingList[0].loading'
          let tmp2 = 'itemList[0].item'
          // console.log(typeof (that.data.itemList[0].item));
          that.setData({
            [tmp2]: curItem,
            [tmp1]: false
          })
            // console.log(that.data.itemList);  
        } else {
          let tmp = 'bottomList[0].bottom';
          that.setData({
            [tmp]: true
          })
        }
      }
    })
  },

  //初始化数据 及点击各个标签的获取数据
  initData: function (index) {
    var that = this
    this.setData({
      curIndex: index,
      curText: that.data.listTab[index].sortName,
    })
    console.log(that.data.curIndex + " " + that.data.curText);
    // 判断是否是第一次点击此分类
    // console.log(this.data.itemList);
    // console.log(this.data.itemList[this.data.curIndex]);
    if (this.data.itemList[this.data.curIndex] == undefined && that.data.currentIndex != 0){
      // console.log(this.data.itemList[this.data.curIndex]);
      console.log(that.data.curIndex);
      wx.request({
        url: 'https://www.nefuer.cc/item/?sortId= ' + that.data.curIndex + '&page=' + 1,
        method: 'GET',
        header: {
          'openId': getApp().globalData.openId,
          'content-type': 'application/json'
        },
        success: function (res) {
          // 数量小于分页数量 提示栏显示无更多数据
          if (res.data.data.length < res.data.page.pageSize) {
            let tmp = 'bottomList[' + that.data.curIndex + '].bottom';
            that.setData({
              [tmp]: true
            })
            // console.log(that.data.bottomList[that.data.curIndex].bottom);
          };
          // console.log(res);
          // console.log(that.data.pageList,res.data.page.totalPage);
          if (that.data.pageList[index].page <= res.data.page.totalPage) {
            // console.log(res.data.data);
            let curItem = '';
            curItem = res.data.data;
            let tmp1 = 'loadingList['+index+'].loading'
            let tmp2 = 'itemList['+index+'].item'
            that.setData({
              [tmp2]: curItem,
              [tmp1]: false
            })
            // console.log(that.data.itemList);
          } else {
            let tmp = 'bottomList['+index+'].bottom';
            that.setData({
              [tmp]: true
            })
          }
        }
      })
    }
  },

  //tab点击事件，刷新数据
  reflashData: function (event) {
    var that = this;
    // console.log(event.currentTarget.dataset.index);
    // console.log(that.data.scrollLength);
    var index = event.currentTarget.dataset.index
    // 移动滚动条,300和50是估算的
    if (index > this.data.curIndex) {
      if (that.data.scrollLength < 300) {
        this.setData({
          scrollLength: that.data.scrollLength + 50 * (index - that.data.curIndex)
        })
      }
    } else {
      if (that.data.scrollLength > 0) {
        this.setData({
          scrollLength: that.data.scrollLength - 50 * (that.data.curIndex - index)
        })
      }
    }
    //移动view位置，改变选中颜色
    this.initData(index);
  },

  toDetails: function (e) {
    // console.log(e);
    getApp().globalData.itemId = e.currentTarget.id;
    wx.navigateTo({
      url: '../details/details',
    })
  },

  // 该方法绑定了页面滑动到底部的事件
  onReachBottom: function () {
    var that = this;
    // console.log(this.data.curIndex);
    if(this.data.curIndex == 0){
      var that = this;
      let tmp = 'loadingList[0].loading'
      let tmp2 = 'pageList[0].page'
      this.setData({
        [tmp]: true
      })
      this.setData({
        [tmp2]: this.data.pageList[0].page + 1
      })
      console.log(that.data.pageList[0].page);
      wx.request({
        url: 'https://www.nefuer.cc/item/?page=' + that.data.pageList[0].page,
        method: 'GET',
        header: {
          'openId': getApp().globalData.openId,
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(that.data.pageList, res.data.page.totalPage)
          if (that.data.pageList[0].page <= res.data.page.totalPage) {
            console.log(res.data.data);
            let curItem = '';
            curItem = res.data.data;
            let tmp1 = 'loadingList[0].loading'
            let tmp2 = 'itemList[0].item'
            that.setData({
              [tmp2]: that.data.itemList[0].item.concat(curItem),
              [tmp1]: false
            }),
              console.log(that.data.itemList);

          } else {
            let tmp = 'bottomList[0].bottom';
            that.setData({
              [tmp]: true
            })
          }
        }
      })
    } else if (this.data.curIndex != 0) {
      var that = this;
      let tmp = 'loadingList[' + this.data.curIndex +'].loading'
      let tmp2 = 'pageList[' + this.data.curIndex +'].page'
      this.setData({
        [tmp]: true
      })
      this.setData({
        [tmp2]: this.data.pageList[this.data.curIndex].page + 1
      })
      // console.log(that.data.pageList[this.data.curIndex].page);
      wx.request({
        url: 'https://www.nefuer.cc/item/?sortId= ' + that.data.curIndex + '&page=' + that.data.pageList[that.data.curIndex].page,
        method: 'GET',
        header: {
          'openId': getApp().globalData.openId,
          'content-type': 'application/json'
        },
        success: function (res) {
          // console.log(res);
          // console.log(that.data.pageList, res.data.page.totalPage)
          if (that.data.pageList[that.data.curIndex].page <= res.data.page.totalPage) {
            // console.log(res.data.data);
            let curItem = '';
            curItem = res.data.data;
            let tmp1 = 'loadingList[' + that.data.curIndex +'].loading'
            let tmp2 = 'itemList[' + that.data.curIndex +'].item'
            that.setData({
              [tmp2]: that.data.itemList[that.data.curIndex].item.concat(curItem),
              [tmp1]: false
            })
            // console.log(that.data.itemList);
            // console.log(that.data.curIndex);
            // console.log(that.data.loadingList, that.data.bottom);
          } else {
            let tmp = 'bottomList[' + that.data.curIndex +'].bottom';
            that.setData({
              [tmp]: true
            })
            // console.log(that.data.curIndex);
            // console.log(that.data.loadingList, that.data.bottom);
          }
        }
      })
    }

  },

  onPullDownRefresh:function(){
    var that = this;
    
    let tmp1 = 'pageList[' + that.data.curIndex + '].page';
    let tmp2 = 'bottomList[' + that.data.curIndex + '].bottom';
    let tmp3 = 'loadingList[' + that.data.curIndex + '].loading';
    that.setData({
      [tmp1]: 1,
      [tmp2]: false,
      [tmp3]: false,
    })
    if (that.data.curIndex == 0){
      wx.request({
        url: 'https://www.nefuer.cc/item/?page=' + 1,
        method: 'GET',
        header: {
          'openId': getApp().globalData.openId,
          'content-type': 'application/json'
        },
        success: function (res) {
          // console.log(that.data.pageList, res.data.page.totalPage)
          if (that.data.pageList[0].page <= res.data.page.totalPage) {
            // console.log(res.data.data);
            let curItem = '';
            curItem = res.data.data;
            let tmp1 = 'loadingList[0].loading'
            let tmp2 = 'itemList[0].item'
            // console.log(typeof (that.data.itemList[0].item));
            that.setData({
              [tmp2]: curItem,
              [tmp1]: false
            })
            // console.log(that.data.itemList);  
          } else {
            let tmp = 'bottomList[0].bottom';
            that.setData({
              [tmp]: true
            })
          }
        }
      })
    } else {
      wx.request({
        url: 'https://www.nefuer.cc/item/?sortId= ' + that.data.curIndex + '&page=' + 1,
        method: 'GET',
        header: {
          'openId': getApp().globalData.openId,
          'content-type': 'application/json'
        },
        success: function (res) {
          // 数量小于分页数量 提示栏显示无更多数据
          if (res.data.data.length < res.data.page.pageSize) {
            let tmp = 'bottomList[' + that.data.curIndex + '].bottom';
            that.setData({
              [tmp]: true
            })
          };
          if (that.data.pageList[that.data.curIndex].page <= res.data.page.totalPage) {
            // console.log(res.data.data);
            let curItem = '';
            curItem = res.data.data;
            let tmp1 = 'loadingList[' + that.data.curIndex + '].loading'
            let tmp2 = 'itemList[' + that.data.curIndex + '].item'
            that.setData({
              [tmp2]: curItem,
              [tmp1]: false
            })
          } else {
            let tmp = 'bottomList[' + that.data.curIndex + '].bottom';
            that.setData({
              [tmp]: true
            })
          }
        }
      })
    }
    
    wx.stopPullDownRefresh();//关闭下拉刷新
  }

})