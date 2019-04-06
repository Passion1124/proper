import utils from '../../utils/util.js'
import md5 from '../../utils/md5.js'
import uploadImage from '../../utils/uploadAli/uploadFile.js'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    star: 0,
    comment: '',
    target: '',
    pics: [],
    orderId: '',
    commentId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.target = options.target;
    this.data.orderId = options.orderId;
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
    
  },
  // 修改评分
  handleUpdateStar (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      star: index
    })
  },
  // 同步评论内容
  handleInputComment (e) {
    this.setData({
      comment: e.detail.value
    })
  },
  // 选择图片
  handleClickFileInput () {
    if (this.data.pics.length >= 9) {
      return false;
    }
    let _this = this;
    wx.chooseImage({
      count: 1,
      success: function(res) {
        console.log(res);
        wx.showLoading({
          title: '图片上传中',
        })
        uploadImage(res.tempFilePaths[0], 'comment/', url => {
          wx.hideLoading();
          let pics = _this.data.pics;
          pics.push(url);
          _this.setData({
            pics: pics
          })
        })
      },
    })
  },
  // 发表评论
  handleCommentAdd () {
    let api = 'com.ttdtrip.api.comment.apis.CommentAddApiService';
    let data = { base: app.globalData.baseBody, target: this.data.target, star: this.data.star, pics: this.data.pics, type: 'poi', comment: this.data.comment };
    data.sn = md5(data + new Date().getTime());
    console.log(data);
    app.request(api, data, res => {
      console.log(res);
      this.data.commentId = res.commentVO.uuid;
      this.handleOrderEvaluate();
      this.handleGoodsReport();
    }, e => {
      console.error(e);
    })
  },
  //上报
  handleGoodsReport () {
    let api = 'com.ttdtrip.api.goods.apis.GoodsReportApiService';
    let data = { base: app.globalData.baseBody, gid: this.data.target, type: 'comment'};
    app.request(api, data, res => {
      console.log(res);
    }, e => {
      console.error(e);
    })
  },
  // 订单评论
  handleOrderEvaluate () {
    let api = 'com.ttdtrip.api.order.apis.service.OrderEvaluateApiService';
    let data = { base: app.globalData.baseBody, commentId: this.data.commentId, merchId: this.data.target, orderId: this.data.orderId };
    app.request(api, data, res => {
      console.log(res);
      utils.showMessage('完成评论');
      setTimeout(_ => {
        wx.navigateBack();
      }, 500);
    }, e => {
      console.error(e);
    })
  },
  // 点击发表按钮
  handleClickCommentButton () {
    if (!this.data.star) {
      utils.showMessage('请选择评分');
    } else if (!this.data.comment) {
      utils.showMessage('请输入评论');
    } else {
      this.handleCommentAdd();
    }
  },
  // 删除图片
  handleRemovePic (e) {
    let index = e.currentTarget.dataset.index;
    let pics = this.data.pics;
    pics.splice(index, 1);
    this.setData({
      pics
    });
  }
})