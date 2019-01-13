//获取应用实例
const app = getApp();

var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gid: '',
    type: '',
    favor: false,
    goods: {},
    goodsItem: [],
    imgUrls: [],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [{
      id: 1,
      latitude: 23.099994,
      longitude: 113.324520,
      name: 'T.I.T 创意园',
      desc: 'sssssss',
      callout: {
        content: '123',
        display: 'ALWAYS',
        padding: '5',
        borderRadius: 8,
        fontSize: 16
      }
    }],
    comment: [],
    commentCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    this.setData({
      gid: options.gid,
      type: options.type
    });
    this.getGoodsDetail();
    this.getCommentList();
    this.getCommentCount();
    this.getFavorCheckList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getGoodsDetail () {
    let data = { base: app.globalData.baseBody, gid: this.data.gid };
    let api = 'com.ttdtrip.api.goods.apis.GoodsDetailApiService';
    app.request(api, data, (res) => {
      console.log(res);
      this.setData({
        goods: res.goodsVO,
        goodsItem: res.goodsItemVOs,
        imgUrls: res.goodsVO.goodsBase.pics
      });
      WxParse.wxParse('article', 'html', this.data.goods.goodsInfo.info, this, 5);
    }, (err) => {
      console.error(err);
    })
  },
  getCommentList () {
    let data = { base: app.globalData.baseBody, page: 1, size: 1, target: this.data.gid, time: new Date().getTime(), type: 'poi'};
    let api = 'com.ttdtrip.api.comment.apis.CommentListApiService';
    app.request(api, data, (res) => {
      console.log(res);
      this.setData({
        comment: res.comments
      })
    }, (err) => {
      console.error(err);
    })
  },
  getCommentCount () {
    let data = { base: app.globalData.baseBody, target: this.data.gid, time: new Date().getTime(), type: 'poi' };
    let api = 'com.ttdtrip.api.comment.apis.CommentCountApiService';
    app.request(api, data, (res) => {
      console.log(res);
      this.setData({
        commentCount: res.count
      });
    }, (err) => {
      console.error(err);
    })
  },
  getFavorCheckList () {
    let api = 'com.ttdtrip.api.goods.apis.FavorCheckApiService';
    let data = { base: app.globalData.baseBody, ids: [this.data.gid]};
    app.request(api, data, (res) => {
      console.log(res);
      let favor = false;
      if (res.favorIds.length) {
        favor = true;
      }
      this.setData({
        favor: favor
      })
    }, (err) => {
      console.error(err);
    })
  },
  handleSetGoodsFavor () {
    if (this.data.favor) {
      this.handleGoodsUnFavor();
    } else {
      this.handleGoodsFavor();
    }
  },
  handleGoodsFavor() {
    let api = 'com.ttdtrip.api.goods.apis.FavorApiService';
    let data = { base: app.globalData.baseBody, gid: this.data.gid };
    app.request(api, data, (res) => {
      console.log(res);
      wx.showToast({
        title: '收藏成功',
      });
      this.setData({
        favor: true
      })
    }, (err) => {
      console.error(err);
    })
  },
  handleGoodsUnFavor() {
    let api = 'com.ttdtrip.api.goods.apis.UnFavorApiService';
    let data = { base: app.globalData.baseBody, gid: this.data.gid };
    app.request(api, data, (res) => {
      console.log(res);
      wx.showToast({
        title: '已取消收藏',
      });
      this.setData({
        favor: false
      })
    }, (err) => {
      console.error(err);
    })
  },
  callPhone (e) {
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  showMapNavigation () {
    wx.getLocation({
      success: function (res) {
        console.log(res);
        const latitude = res.latitude
        const longitude = res.longitude
        wx.openLocation({
          latitude,
          longitude,
          scale: 18,
          name: '保利心语',
          address: '天府二街'
        })
      },
    })
  },
  goToTheGoodsItemDetail (e) {
    let giid = e.currentTarget.dataset.giid;
    wx.navigateTo({
      url: '/pages/goodItemDetail/goodItemDetail?giid=' + giid + '&gid=' + this.data.gid + '&type=' + this.data.type,
    })
  }
})