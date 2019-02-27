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
    goodsItemCount: 0,
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
    commentCount: 0,
    coupons: [],
    hasExists: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      gid: options.gid,
      type: options.type
    });
    this.getGoodsDetail();
    this.getGoodsItemList();
    this.getCommentList();
    this.getCommentCount();
    this.getFavorCheckList();
    this.handleGoodsReport('view');
    this.getCouponList();
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
  // 商品详情
  getGoodsDetail() {
    let data = { base: app.globalData.baseBody, gid: this.data.gid };
    let api = 'com.ttdtrip.api.goods.apis.GoodsDetailApiService';
    app.request(api, data, (res) => {
      console.log(res);
      this.setData({
        goods: res.goodsVO,
        imgUrls: res.goodsVO.goodsBase.pics
      });
      WxParse.wxParse('article', 'html', this.data.goods.goodsInfo.info, this, 5);
    }, (err) => {
      console.error(err);
    })
  },
  // 子商品列表
  getGoodsItemList () {
    let api = 'com.ttdtrip.api.goods.apis.GoodsItemListApiService';
    let data = { base: app.globalData.baseBody, gid: this.data.gid, subType: 21, page: 1, size: 1 };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        goodsItem: res.goodsItemVOS,
        goodsItemCount: res.total
      });
    }, e => {
      console.error(e);
    })
  },
  // 评论列表
  getCommentList() {
    let data = { base: app.globalData.baseBody, page: 1, size: 1, target: this.data.gid, time: new Date().getTime(), type: 'poi' };
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
  // 评论总数
  getCommentCount() {
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
  // 是否收藏
  getFavorCheckList() {
    let api = 'com.ttdtrip.api.goods.apis.FavorCheckApiService';
    let data = { base: app.globalData.baseBody, ids: [this.data.gid] };
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
  // 点击收藏按钮
  handleSetGoodsFavor() {
    if (this.data.favor) {
      this.handleGoodsUnFavor();
    } else {
      this.handleGoodsFavor();
    }
  },
  // 收藏商品
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
      });
    }, (err) => {
      console.error(err);
    })
  },
  // 取消收藏商品
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
      });
      this.handleGoodsReport('comment');
    }, (err) => {
      console.error(err);
    })
  },
  //商品上报
  handleGoodsReport(type) {
    let api = 'com.ttdtrip.api.goods.apis.GoodsReportApiService';
    let data = { base: app.globalData.baseBody, gid: this.data.gid, type: type };
    app.request(api, data, res => {
      console.log(res);
    }, err => {
      console.error(err);
    })
  },
  // 优惠券列表
  getCouponList() {
    let api = 'com.ttdtrip.api.order.apis.service.CouponListApiService';
    let data = { base: app.globalData.baseBody, page: 1, size: 100, usingId: this.data.gid, usingScope: 12 };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        coupons: res.coupons || []
      });
      if (app.globalData.userInfo && this.data.coupons.length) {
        this.getHasExistsCoupon(this.data.coupons.map(item => item.id));
      }
    }, err => {
      console.error(err);
    })
  },
  // 是否领取优惠券
  getHasExistsCoupon(couponIds) {
    let api = 'com.ttdtrip.api.order.apis.service.UserCouponsExistApiService';
    let data = { base: app.globalData.baseBody, couponIds: couponIds };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        hasExists: res.hasExists
      })
    }, err => {
      console.error(err);
    })
  },
  // 修改已经领取优惠券
  changeHasExistsCoupon(couponId) {
    let index = this.data.coupons.findIndex(item => item.id === couponId);
    if (!this.data.hasExists[index]) {
      this.setData({
        ['hasExists[' + index + ']']: true
      })
    }
  },
  callPhone(e) {
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  showMapNavigation() {
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
  goToTheGoodsItemDetail(e) {
    let giid = e.currentTarget.dataset.giid;
    wx.navigateTo({
      url: '/pages/goodItemDetail/goodItemDetail?giid=' + giid + '&gid=' + this.data.gid + '&type=' + this.data.type,
    })
  },
  goToTheCouponsDetail(e) {
    let couponId = e.currentTarget.dataset.couponid;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/couponDetail/couponDetail?couponId=' + couponId + '&source=poi_detail&id=' + id,
    })
  },
  goToTheChildProductList(e) {
    wx.navigateTo({
      url: '/pages/childProductList/childProductList?gid=' + this.data.gid + '&type=' + this.data.type,
    })
  },
  goToTheCommentList() {
    wx.navigateTo({
      url: '/pages/morecomment/morecomment?target=' + this.data.gid,
    })
  }
})