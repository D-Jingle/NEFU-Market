const qiniuUploader = require("../../common/qiniuUploader");

var sourceType = [['camera'], ['album'], ['camera', 'album']]
var sizeType = [['compressed'], ['original'], ['compressed', 'original']]

Page({
  data: {
    imageList: [],
    imageURL: '',
    myUpToken: '',
    sourceTypeIndex: 2,
    sourceType: ['拍照', '相册', '拍照或相册'],

    sizeTypeIndex: 0,
    sizeType: ['压缩', '原图', '压缩或原图'],

    countIndex: 8,
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9]
  },
  onLoad: function(){
    var that = this;
      wx.request({
        url: 'https://www.nefuer.cc/uptoken',
        success: function(res){
          that.setData({
            myUpToken: res.data.uptoken,
          }),
          // console.log(res.data.uptoken);
          console.log(that.data.myUpToken);
        },
        fail: function(){
          console.log("请求失败");
        }
      })
  },
  sourceTypeChange: function (e) {
    this.setData({
      sourceTypeIndex: e.detail.value
    })
  },
  sizeTypeChange: function (e) {
    this.setData({
      sizeTypeIndex: e.detail.value
    })
  },
  countChange: function (e) {
    console.log(e);
    this.setData({
      countIndex: e.detail.value
    })
  },
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      sourceType: sourceType[this.data.sourceTypeIndex],
      sizeType: 'compressed',
      count: this.data.count[this.data.countIndex],
      success: function (res) {
        // console.log(res.tempFilePaths);
        var filePath = res.tempFilePaths[0];
        qiniuUploader.upload(filePath, (res) => {
          that.setData({
            'imageURL': res.imageURL
          });
          console.log("imageURL:" + that.data.imageURL)
        }, (error) => {
          console.log('error: ' + error);
        }, {
            region: 'SCN',
            domain: 'ov1bb5kj9.bkt.clouddn.com',
            uptoken: that.data.myUpToken
          }, (res) => {
            console.log('上传进度', res.progress)
            console.log('已经上传的数据长度', res.totalBytesSent)
            console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
          });
      }
    })
  },

  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  }
})
