//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    bannerInfo: [],
    coupons: [],
    buyTags: [],
    foodTags: [],
    goodsList: [],
    cityName: '',
    recommendType: 1,
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    };
    this.setData({
      cityName: app.globalData.cityName
    })
    this.getBannerInfo();
    this.getCategoryInfo();
    this.getCouponInfo();
    this.getGoodsList();
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getBannerInfo () {
    let data = { base: app.globalData.baseBody, progId: 10001 };
    let api = 'com.ttdtrip.api.config.apis.service.BannerQryApiService';
    app.request(api, data, (res) => {
      console.log(res);
      this.setData({
        bannerInfo: res.banners
      })
    }, (res) => {
      console.error(res);
    })
  },
  getCategoryInfo () {
    let data = { base: app.globalData.baseBody };
    let api = 'com.ttdtrip.api.config.apis.service.CategoryQryApiService';
    app.request(api, data, (res) => {
      console.log(res);
      this.setData({
        buyTags: res.buyCategories,
        foodTags: res.foodCategories
      })
    }, (res) => {
      console.error(res);
    })
  },
  getCouponInfo () {
    let data = { base: app.globalData.baseBody, progId: 10001, count: 5, offset: 0 };
    let api = 'com.ttdtrip.api.config.apis.service.CouponQryApiService';
    app.request(api, data, (res) => {
      console.log(res);
      this.setData({
        coupons: res.coupons
      })
    }, (res) => {
      console.error(res);
    })
  },
  getGoodsList () {
    let data = { base: app.globalData.baseBody, sortType: 1, page: 1, size: 20, type: this.data.recommendType };
    let api = 'com.ttdtrip.api.goods.apis.GoodsListApiService';
    app.request(api, data, (res) => {
      console.log(res);
      this.setData({
        goodsList: res.goodsVOs
      })
    }, (err) => {
      console.error(err);
    })
  },
  handleSwichChange (e) {
    this.setData({
      recommendType: Number(e.currentTarget.dataset.type)
    });
    this.getGoodsList();
  },
  handleScanCode () {
    wx.scanCode({
      onlyFromCamera: true,
      success (res) {
        console.log(res);
      },
      fail (res) {
        console.log(res);
      }
    })
  },
  changeCity () {
    this.setData({
      cityName: app.globalData.cityName
    });
    this.getGoodsList();
    this.getCouponInfo();
  },
  goToTheSearch () {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  goToTheCity () {
    wx.navigateTo({
      url: '/pages/city/city',
    })
  },
  goToThePoiDetail (e) {
    let gid = e.currentTarget.dataset.gid;
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/poi_detail/poi_detail?gid=' + gid + '&type=' + type,
    })
  },
  goToTheProductList (e) {
    wx.navigateTo({
      url: '/pages/productList/productList',
    })
  }
})
