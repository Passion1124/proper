const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    body: {
      page: 1,
      size: 10,
      qryType: 1
    },
    use: [],
    expire: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserCouponList();
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
    this.data.body.page = 1;
    this.getUserCouponList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.body.page++;
    this.getUserCouponList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  changeQryType (e) {
    let type = Number(e.currentTarget.dataset.type);
    if (this.data.body.qryType !== type) {
      this.setData({
        ['body.qryType']: type,
        ['body.page']: 1
      });
      this.getUserCouponList();
    }
  },
  getUserCouponList () {
    let api = 'com.ttdtrip.api.order.apis.service.UserCouponListApiService';
    let data = Object.assign({ base: app.globalData.baseBody }, this.data.body);
    app.request(api, data, (res) => {
      console.log(res);
      if (this.data.body.qryType === 1) {
        this.setData({
          use: this.data.use.concat(res.coupons)
        })
      } else if (this.data.body.qryType === 2) {
        this.setData({
          expire: this.data.expire.concat(res.coupons)
        })
      }
      wx.stopPullDownRefresh();
    }, (err) => {
      console.error(err);
      wx.stopPullDownRefresh();
    })
  },
  goToTheCouponsDetail(e) {
    let couponId = e.currentTarget.dataset.couponid;
    wx.navigateTo({
      url: '/pages/couponDetail/couponDetail?couponId=' + couponId,
    })
  }
})