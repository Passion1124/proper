const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponId: '',
    coupon: {},
    hasExists: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      couponId: options.couponId
    });
    this.getCouponDetail();
    this.getUserCouponExist();
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
  getUserCouponExist: function () {
    let api = 'com.ttdtrip.api.order.apis.service.UserCouponExistApiService';
    let data = { base: app.globalData.baseBody, couponId: this.data.couponId };
    app.request(api, data, (res) => {
      console.log(res);
      this.setData({
        hasExists: res.hasExists
      })
    }, (err) => {
      console.error(err);
    })
  },
  getCouponDetail: function () {
    let api = 'com.ttdtrip.api.order.apis.service.CouponDetailApiService';
    let data = { base: app.globalData.baseBody, id: this.data.couponId };
    app.request(api, data, (res) => {
      console.log(res);
      this.setData({
        coupon: res.coupon
      })
    }, (err) => {
      console.error(err);
    })
  }
})