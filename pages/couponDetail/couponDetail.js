const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponId: '',
    coupon: {},
    hasExists: false,
    gid: '',
    giid: '',
    type: '',
    source: '',
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      couponId: options.couponId
    });
    this.data.source = options.source;
    this.data.id = options.id;
    // console.log(this.data.source);
    this.getCouponDetail();
    this.getUserCouponExist();
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
    let pages = getCurrentPages();
    pages[pages.length - 2].changeHasExistsCoupon(this.data.couponId);
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
  getUserCouponExist: function() {
    let api = 'com.ttdtrip.api.order.apis.service.UserCouponExistApiService';
    let data = {
      base: app.globalData.baseBody,
      couponId: this.data.couponId
    };
    app.request(api, data, (res) => {
      console.log(res);
      this.setData({
        hasExists: res.hasExists
      })
    }, (err) => {
      console.error(err);
    })
  },
  getCouponDetail: function() {
    let api = this.data.source === 'myCoupon' ? 'com.ttdtrip.api.order.apis.service.UserCouponDetailApiService' : 'com.ttdtrip.api.order.apis.service.CouponDetailApiService';
    let data = {
      base: app.globalData.baseBody,
      id: this.data.id
    };
    app.request(api, data, (res) => {
      console.log(res);
      this.setData({
        coupon: res.coupon
      });
      if (this.data.coupon.usingScope === 12 && this.data.coupon.usingOnline) {
        this.getGoodsDetail();
      } else if (this.data.coupon.usingScope === 13 && this.data.coupon.usingOnline) {
        this.getGoodsItem();
      }
    }, (err) => {
      console.error(err);
    })
  },
  getGoodsDetail() {
    let api = 'com.ttdtrip.api.goods.apis.GoodsDetailApiService';
    let data = {
      base: app.globalData.baseBody,
      gid: this.data.coupon.usingId
    };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        gid: res.goodsVO.goodsInfo.gid,
        type: res.goodsVO.goodsInfo.type
      })
    }, err => {
      console.error(err);
    })
  },
  getGoodsItem () {
    let api = 'com.ttdtrip.api.goods.apis.GoodsItemDetailApiService';
    let data = { base: app.globalData.baseBody, giid: this.data.coupon.usingId, spec: 0 };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        gid: res.goodsItemVO.goodsItemBase.gid,
        giid: res.goodsItemVO.goodsItemInfo.giid,
        type: res.goodsItemVO.goodsItemBase.gType
      })
    }, err => {
      console.error(err);
    })
  },
  handleUserCouponReceive() {
    if (!app.globalData.userInfo) {
      wx.showToast({
        title: '您未登录，暂时无法领取',
        icon: 'none'
      });
      return false;
    }
    let api = 'com.ttdtrip.api.order.apis.service.UserCouponReceiveApiService';
    let data = {
      base: app.globalData.baseBody,
      couponId: this.data.couponId,
      receiveSource: 'other'
    };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        hasExists: true
      });
    }, err => {
      console.error(err);
    })
  },
  goToTheUseing() {
    let url = '';
    if (this.data.coupon.usingOnline === 1) {
      if (this.data.coupon.usingScope === 10) {
        url = '/pages/productList/productList?type=1'
      } else if (this.data.coupon.usingScope === 12) {
        url = '/pages/poi_detail/poi_detail?gid=' + this.data.gid + '&type=' + this.data.type
      } else if (this.data.coupon.usingScope === 13) {
        url = '/pages/goodItemDetail/goodItemDetail?giid=' + this.data.giid + '&gid=' + this.data.gid + '&type=' + this.data.type
      };
    } else {
      if (this.data.hasExists) {
        url = '/pages/showCoupon/showCoupon?img=' + this.coupon.photoUrl;
      } else {
        wx.showToast({
          title: '您还未领取优惠券，暂时不能使用',
          icon: 'none'
        });
        return false;
      }
    }
    console.log(url);
    wx.navigateTo({
      url: url,
    })
  }
})