import utils from '../../utils/util.js'

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
    msgCount: 0,
    tabs_type: "vertical",
    reqStatus: 'success'
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
    this.getMsgCount();
  },
  onShow () {
    this.getMsgCount();
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
    let api = 'com.ttdtrip.api.config.apis.service.IndexLabelQryApiService';
    app.request(api, data, (res) => {
      console.log(res);
      this.setData({
        buyTags: res.buyLabels,
        foodTags: res.foodLabels
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
    this.setData({
      reqStatus: 'loading'
    })
    let data = { base: app.globalData.baseBody, sortType: 1, page: 1, size: 20, type: this.data.recommendType };
    let city = wx.getStorageSync('city') || '';
    if (city) data.cityId = city.cityId;
    let api = 'com.ttdtrip.api.goods.apis.GoodsListApiService';
    app.request(api, data, (res) => {
      console.log(res);
      this.setData({
        goodsList: res.goodsVOs.length > 20 ? res.goodsVOs.slice(0, 20) : res.goodsVOs
      });
      this.setData({
        reqStatus: 'success'
      })
    }, (err) => {
      console.error(err);
      this.setData({
        reqStatus: 'success'
      })
    })
  },
  getMsgCount () {
    let data = { base: app.globalData.baseBody, time: 0 };
    let api = 'com.ttdtrip.api.account.apis.service.msg.MsgCountApiService';
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        msgCount: res.count
      })
    }, err => {
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
    let url = type === 2 ? '/pages/fooddetail/fooddetail' : '/pages/poi_detail/poi_detail';
    wx.navigateTo({
      url: url + '?gid=' + gid + '&type=' + type,
    })
  },
  goToTheProductList (e) {
    wx.navigateTo({
      url: '/pages/productList/productList?type=' + Number(e.currentTarget.dataset.type),
    })
  },
  goToTheCouponsDetail (e) {
    let couponId = e.currentTarget.dataset.couponid;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/couponDetail/couponDetail?couponId=' + couponId + '&source=index&id=' + id,
    })
  },
  goToTheCouponList () {
    wx.navigateTo({
      url: '/pages/couponList/couponList',
    })
  },
  goToTheMessage () {
    utils.userIsLogin().then(_ => {
      wx.navigateTo({
        url: '/pages/message/message',
      })
    })
  },
  goToTheProgList (e) {
    let labelId = e.currentTarget.dataset.labelid;
    let name = e.currentTarget.dataset.name;
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/progList/progList?labelId=' + labelId + '&name=' + name + '&type=' + type,
    })
  },
  handleChangeTabsType (e) {
    this.setData({
      tabs_type: e.currentTarget.dataset.type
    });
  }
})
