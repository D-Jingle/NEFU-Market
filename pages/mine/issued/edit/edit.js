const qiniuUploader = require("../../../../common/qiniuUploader");

var sourceType = [['camera'], ['album'], ['camera', 'album']]
var sizeType = [['compressed'], ['original'], ['compressed', 'original']]
var flag = true;
var flag2 = false;


// pages/mine/issued/edit/edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    sortArray:[],
    item:{},
    index: '',

    imageList: [], //带有https://的地址
    image:[], //不带https://的地址
    imageList2:[], //存放新增的的图片的临时地址

    sourceTypeIndex: 2,
    sourceType: ['拍照', '相册', '拍照或相册'],

    sizeTypeIndex: 2,
    sizeType: ['压缩', '原图', '压缩或原图'],

    countIndex: 8,
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],

    img:[], // 保存七牛云图片地址

    totalImg:[],
    imgId:[], //存放该商品改变之前的所有图片id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取七牛云的upToken
    wx.request({
      url: 'https://www.nefuer.cc/uptoken',
      success: function (res) {
        that.setData({
          myUpToken: res.data.uptoken,
        })
      },
      fail: function () {
        console.log("upToken请求失败");
      }
    });
    // 获取分类
    wx.request({
      url: 'https://www.nefuer.cc/sort',
      success: function (res) {
        for (var i = 0; i < res.data.data.length; i++) {
          that.data.sortArray[i] = res.data.data[i].sortName;
        }
        that.setData({
          array: that.data.sortArray,
        })
        console.log(that.data.array);
        // 请求商品信息
        wx.request({
          url: 'https://www.nefuer.cc/item?itemId=' + getApp().globalData.itemId,
          method: "GET",
          header: {
            'openId': getApp().globalData.openId,
            'content-type': 'application/json',
            'userId': getApp().globalData.userId
          },
          success: function (res) {
            for(let i=0; i<res.data.data.img.length; i++){
              var tmp = 'imageList[' + i + ']';
              var tmp2 = 'image[' +i+']';
              that.setData({
                [tmp]: 'https://'+res.data.data.img[i].imgUrl,
                [tmp2]: res.data.data.img[i].imgUrl
              })
            }
            that.setData({
              item: res.data.data,
              index: res.data.data.sortId * 1 -1,
              name:res.data.data.name,
              price:res.data.data.price,
              content: res.data.data.content
            })
            console.log(that.data.imageList);
            console.log(that.data.image);
            console.log(that.data.name,that.data.price,that.data.content);
            console.log(that.data.imageList2)
          }
        });

      }
    });
    
  },

  // 迭代延时获得地址
  geturl: function (num, max) {
    var that = this;
    // 大于图片数量退出
    if (num >= max) {
      console.log("已经达到最大，最大值num为：" + num);
      if (this.data.img[0] == undefined) {
        wx.hideLoading();
        wx.showToast({
          title: '上传失败',
          duration: 2000
        })
      } else {
        wx.hideLoading();
        wx.showToast({
          title: '上传成功',
          duration: 2000
        })
        for(let i=0; i<this.data.img.length; i++){
          console.log(this.data.imageList);
          console.log(this.data.img[i].imgUrl);
          this.setData({
            imageList: this.data.imageList.concat('https://'+this.data.img[i].imgUrl),
            image: this.data.image.concat(this.data.img[i].imgUrl)
          })
        }
        // that.data.imageList.concat(this.data.img);
        console.log(this.data.imageList);
        console.log(this.data.image);
      }
      return;
    } else if (num < max) {
        wx.showLoading({
          title: '正在上传...',
          mask: 'true',
        })
      var filePath = this.data.imageList2[num];
      qiniuUploader.upload(filePath, (res) => { // 异步加载
        console.log("num:" + num);
        console.log(this.data.imageList2)
        var tmp = 'img[' + num + '].imgUrl';
        this.setData({
          [tmp]: res.imageURL,
        })
        console.log("img[" + num + "].imgUrl:" + this.data.img[num].imgUrl);
        j++;
      }, (error) => {
        console.log('error: ' + error);
      }, {
          region: 'SCN',
          domain: 'photo.nefuer.cc',
          uptoken: this.data.myUpToken
        }, (res) => {
          console.log('上传进度', res.progress)
          console.log('已经上传的数据长度', res.totalBytesSent)
          console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
        });
      setTimeout(function () {
        that.geturl(num + 1, max);
      }, 3000);
    }
  },


  // 选择完图片触发
  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      sourceType: sourceType[this.data.sourceTypeIndex],
      sizeType: sizeType[this.data.sizeTypeIndex],
      count: this.data.count[this.data.countIndex],
      success: function (res) {
        that.setData({
          imageList2: res.tempFilePaths,
          imgRes: res
        })
        // console.log(that.data.imgRes);
        // console.log(res.tempFilePaths);
        that.geturl(0, res.tempFilePaths.length);
      }
    })
  },

  // 点击叉叉删除图片
  deleteImg:function(e){
    console.log(e);
    var thisDel = e.currentTarget.id;
    var tmp = this.data.imageList;
    var tmp2 = this.data.image;
    tmp.splice(thisDel,1);
    tmp2.splice(thisDel,1);
    this.setData({
      imageList: tmp,
      image:tmp2
    })
    console.log(this.data.imageList);
    console.log(this.data.image);
  },


  // 发布商品
  modalcnt: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定提交发布？',
      success: function (res) {
        if (res.confirm) {
          // console.log(that.data.name, that.data.price, that.data.content);
          if (that.data.name == '' || that.data.price == '' || that.content == '') {
            wx.showModal({
              title: '提示',
              content: '标题，分类，价格，内容都不能为空哟',
            })
          } else {
            console.log(that.data.name,that.data.price,that.data.index,that.data.content);
            // 发布文字
            wx.request({
              url: 'https://www.nefuer.cc/item',
              method: 'PUT',
              header: {
                'openId': getApp().globalData.openId,
                'content-type': 'application/json',
              },
              data: {
                itemId: that.data.item.itemId,
                name: that.data.name,
                price: that.data.price * 1,
                sortId: that.data.index + 1,
                content: that.data.content,
                status: 1
              },
              success: function (res) {
                console.log(res);
                // 请求成功
                if(res.data.data){
                  // 判断用户是否添加图片
                  if (typeof (that.data.imgRes) != '') {
                    console.log('不是空');
                    // 为每个图片设置itemId
                    for (var i = 0; i < that.data.imageList.length; i++) {
                      var tmp = 'totalImg[' + i + '].itemId';
                      var tmp2 = 'totalImg[' + i + '].imgUrl';
                      that.setData({
                        [tmp]: that.data.item.itemId,
                        [tmp2]: that.data.image[i]
                      })
                    }
                    console.log(that.data.totalImg);
                    if (res.data.code == 0) {
                      // 只有待编辑的商品原本存在图片才删除全部图片
                      if (that.data.item.img != '') {
                        // 删除所有图片
                        wx.request({
                          url: 'https://www.nefuer.cc/img/' + that.data.item.itemId,
                          method: 'DELETE',
                          header: {
                            'openId': getApp().globalData.openId,
                            'content-type': 'application/json'
                          },
                          success: function (res) {
                            if (res.data.data == false) {
                              console.log('删除失败');
                              wx.showToast({
                                title: '删除图片失败',
                                duration: 2000,
                              })
                            } else {
                              console.log('删除成功');
                              //所有图片一起上传
                              wx.request({
                                url: 'https://www.nefuer.cc/img',
                                method: 'POST',
                                header: {
                                  'openId': getApp().globalData.openId,
                                  'content-type': 'application/json'
                                },
                                data: that.data.totalImg,
                                success: function (res2) {
                                  console.log(res2);
                                  wx.showToast({
                                    title: '发布成功',
                                    duration: 2000
                                  })
                                  setTimeout(function () {
                                    wx.navigateBack(1);
                                  }, 2000);
                                },
                                fail: function () {
                                  console.log('传的错了！');
                                }
                              })
                            }
                          }
                        })
                      } else {
                        //所有图片一起上传
                        wx.request({
                          url: 'https://www.nefuer.cc/img',
                          method: 'POST',
                          header: {
                            'openId': getApp().globalData.openId,
                            'content-type': 'application/json'
                          },
                          data: that.data.totalImg,
                          success: function (res2) {
                            console.log(res2);
                            wx.showToast({
                              title: '发布成功',
                              duration: 2000
                            })
                            setTimeout(function () {
                              wx.navigateBack(1);
                            }, 2000);
                          },
                          fail: function () {
                            console.log('传的错了！');
                          }
                        })
                      }
                    } else {
                      wx.showToast({
                        title: '发布失败',
                        duration: 2000,
                      })
                    }
                  } else {
                    console.log('没有图片')
                    if (res.data.code == 0) {
                      console.log('上传成功');
                    } else {
                      console.log('上传失败');
                    }
                  }
                } else {
                  wx.showModal({
                    title: '发布失败',
                    content: '发布失败',
                  })
                }
              },
              fail: function (res) {
                wx.showToast({
                  title: '发布失败',
                  duration: 2000,
                })
              }
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 获取输入的商品标题
  goodTitle: function (e) {
    this.data.name = e.detail.value;
    console.log(this.data.name);
  },
  // 获取输入的商品价格
  goodPrice: function (e) {
    this.data.price = e.detail.value;
    console.log(this.data.price);
  },
  // 获取商品输入内容
  bindTextAreaBlur: function (e) {
    this.data.content = e.detail.value;
    console.log(this.data.content);
  },
  // 这个没啥用
  reSort: function () {
    var that = this;
    console.log('打开分类啊啊啊啊啊啊');
  },
  // 获取分类id
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value * 1,
    })
    console.log(this.data.index + 1);
  },
  // 与选择图片有关
  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  // 与选择图片有关
  sourceTypeChange: function (e) {
    this.setData({
      sourceTypeIndex: e.detail.value
    })
    console.log(sourceTypeIndex);
  },
  // 与选择图片有关
  sizeTypeChange: function (e) {
    this.setData({
      sizeTypeIndex: e.detail.value
    })
  },
  // 与选择图片有关
  countChange: function (e) {
    this.setData({
      countIndex: e.detail.value
    })
  },
})