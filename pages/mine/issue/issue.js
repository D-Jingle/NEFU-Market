const qiniuUploader = require("../../../common/qiniuUploader");

var sourceType = [['camera'], ['album'], ['camera', 'album']]
var sizeType = [['compressed'], ['original'], ['compressed', 'original']]
var flag = true;
var flag2 = false;

Page({
  data: {
    img: [],  // 存图片七牛云地址的数组

    sourceTypeIndex: 2,
    sourceType: ['拍照', '相册', '拍照或相册'],

    sizeTypeIndex: 2,
    sizeType: ['压缩', '原图', '压缩或原图'],

    countIndex: 8,
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],

    sortArray: [],
    index: 0,
    name: '',
    price: '',
    sortId: '',
    content: '',

    myUpToken: ''
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '发布商品'
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

  // 选择完图片触发
  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      sourceType: sourceType[this.data.sourceTypeIndex],
      sizeType: sizeType[this.data.sizeTypeIndex],
      count: this.data.count[this.data.countIndex],
      success: function (res) {
        that.setData({
          imageList: res.tempFilePaths,
          imgRes: res
        })
        console.log(that.data.imgRes);
        console.log(res.tempFilePaths.length);
        that.geturl(0, res.tempFilePaths.length);
      }
    })
  },

  // 迭代延时获得地址 img
  geturl: function(num,max){
    var that = this;
    // 大于图片数量退出
    if(num >= max){
      console.log("已经达到最大，最大值num为："+num);
      if(this.data.img[0] == undefined){
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
        console.log(this.data.img);
      }
      return;
    } else if(num < max){
      if (flag2 == false){
        wx.showLoading({
          title: '正在上传...',
          mask: 'true',
        })
        flag2 = true;
      }
      var filePath = this.data.imageList[num];
      qiniuUploader.upload(filePath, (res) => { // 异步加载
        console.log("num:" + num);
        var tmp = 'img[' + num + '].imgUrl';
        // var tmp2 = 'img[' + num + '].index';
        this.setData({
          [tmp]: res.imageURL,
          // [tmp2]: num
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
        setTimeout(function(){
          that.geturl(num + 1, max);
        },3000);
    }
  },
  
  // 与选择图片有关
  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
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
    console.log(this.data.index+1);
  },

  // 获取输入的商品标题
  goodTitle: function (e) {
    console.log(e.detail.value.length);
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
  // 发布商品
  modalcnt: function () {
    var that = this;
    if (this.data.price >= 9999){
      wx.showModal({
        title: '提示',
        content: '哇，你卖的东西也太贵了吧！',
      })
    } else if (this.data.name.length > 10){
      wx.showModal({
        title: '提示',
        content: '亲，标题长度超过10了哟！',
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '确定提交发布？',
        success: function (res) {
          if (res.confirm) {
            if (that.data.name == '' || that.data.price == '' || that.data.content == '') {
              wx.showModal({
                title: '提示',
                content: '标题，分类，价格，内容都不能为空哟',
              })
            } else {
              // 发布文字
              wx.request({
                url: 'https://www.nefuer.cc/item',
                method: 'POST',
                header: {
                  'openId': wx.getStorageSync('openId'),
                  'content-type': 'application/json'
                },
                data: {
                  name: that.data.name,
                  price: that.data.price * 1,
                  sortId: that.data.index + 1,
                  content: that.data.content,
                  views: 1,
                  publishId: wx.getStorageSync('userId'),
                  status: 1
                },
                success: function (res) {
                  console.log(res);
                  // 判断用户是否添加图片
                  console.log(that.data.imgRes);
                  console.log(typeof (that.data.imgRes) == 'undefined')
                  if (typeof (that.data.imgRes) != 'undefined') {
                    console.log('不是undefined');
                    // 为每个图片设置itemId
                    for (var i = 0; i < that.data.imgRes.tempFilePaths.length; i++) {
                      var tmp = 'img[' + i + '].itemId';
                      that.setData({
                        [tmp]: res.data.data,
                      })
                    }
                    console.log(that.data.img); // img数组里有图片地址和商品id
                    console.log(res.data.code);

                    if (res.data.code == 0) {
                      wx.request({
                        url: 'https://www.nefuer.cc/img',
                        method: 'POST',
                        header: {
                          'openId': wx.getStorageSync('openId'),
                          'content-type': 'application/json'
                        },
                        data: that.data.img,
                        success: function (res2) {
                          console.log(res2);
                        },
                        fail: function () {
                          console.log('传的错了！');
                        }
                      })
                      wx.showToast({
                        title: '发布成功',
                        duration: 2000
                      })
                      setTimeout(function () {
                        wx.navigateBack(1);
                      }, 2000);
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
                      wx.showToast({
                        title: '发布成功',
                        duration: 2000
                      })
                      setTimeout(function () {
                        wx.navigateBack(1);
                      }, 2000);
                    } else {
                      console.log('上传失败');
                      wx.showToast({
                        title: '发布成功',
                        duration: 2000
                      })
                    }
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
    }

  },

  onLoad: function () {
    var that = this;
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
        console.log(that.data.sortArray);
      }
    });
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
    })
  }
})
