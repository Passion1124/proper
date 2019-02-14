const app = getApp();

var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gid: '',
    giid: '',
    type: '',
    goods: {},
    goodsItem: {},
    coupons: [],
    hasExists: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      gid: options.gid,
      giid: options.giid,
      type: options.type
    });
    this.getGoodsItemDetail();
    this.getGoodsDetail();
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
  // 获取子商品详情
  getGoodsItemDetail: function () {
    let api = 'com.ttdtrip.api.goods.apis.GoodsItemDetailApiService';
    let data = { base: app.globalData.baseBody, giId: this.data.giid, spec: 1 };
    app.request(api, data, (res) => {
      console.log(res);
      this.setData({
        goodsItem: res.goodsItemVO
      });
      WxParse.wxParse('article', 'html', this.data.goodsItem.goodsItemInfo.info, this, 5);
    }, (err) => {
      console.error(err);
    })
  },
  // 获取商品详情
  getGoodsDetail: function () {
    let api = 'com.ttdtrip.api.goods.apis.GoodsDetailApiService';
    let data = { base: app.globalData.baseBody, gid: this.data.gid, spec: 1 };
    app.request(api, data, (res) => {
      console.log(res);
      this.setData({
        goods: res.goodsVO
      })
    }, (err) => {
      console.error(err);
    })
  },
  // 获取优惠券列表
  getCouponList () {
    let api = 'com.ttdtrip.api.order.apis.service.CouponListApiService';
    let data = { base: app.globalData.baseBody, page: 1, size: 100, usingScope: 13, usingId: this.data.giid };
    app.request(api, data, (res) => {
      console.log(res);
      this.setData({
        coupons: res.coupons || []
      });
      if (app.globalData.userInfo && this.data.coupons.length) {
        this.getHasExistsCoupon(this.data.coupons.map(item => item.id));
      }
    }, (err) => {
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
  goToTheAdvanceOrder: function () {
    wx.navigateTo({
      url: '/pages/order/order?giid=' + this.data.giid + '&type=' + this.data.type,
    })
  },
  goToTheCouponsDetail(e) {
    let couponId = e.currentTarget.dataset.couponid;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/couponDetail/couponDetail?couponId=' + couponId + '&source=good_item_detail&id=' + id,
    })
  }
})