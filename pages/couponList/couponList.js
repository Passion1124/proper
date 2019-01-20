const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupons: [],
    page: 1,
    size: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCouponInfo();
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
    this.data.page = 1;
    this.data.coupons = [];
    this.getCouponInfo();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.coupons.length && (this.data.coupons.length / this.data.size) % 1 === 0) {
      this.data.page++;
      this.getCouponInfo();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  getCouponInfo() {
    let data = { base: app.globalData.baseBody, page: this.data.page, size: this.data.size };
    let api = 'com.ttdtrip.api.order.apis.service.CouponListApiService';
    app.request(api, data, (res) => {
      console.log(res);
      this.setData({
        coupons: this.data.coupons.concat(res.coupons)
      });
      wx.stopPullDownRefresh();
    }, (res) => {
      console.error(res);
      wx.stopPullDownRefresh();
    })
  },
  goToTheCouponsDetail (e) {
    let couponId = e.currentTarget.dataset.couponid;
    wx.navigateTo({
      url: '/pages/couponDetail/couponDetail?couponId=' + couponId,
    })
  }
})