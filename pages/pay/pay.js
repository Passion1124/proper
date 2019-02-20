const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    orderNo: '',
    currency: '',
    type: '',
    order: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.orderId = options.orderId;
    this.data.orderNo = options.orderNo;
    this.data.currency = options.currency;
    this.data.type = options.type;
    this.handleOrderDetail();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.showLoading({
      title: '拼命加载中。。',
    });
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
  // 获取订单详情接口
  handleOrderDetail () {
    let api = 'com.ttdtrip.api.order.apis.service.OrderDetailApiService';
    let data = { base: app.globalData.baseBody, orderId: this.data.orderId };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        order: res.order
      });
      this.handlePayConfigList(res.order.payCurrency);
    }, fail => {
      wx.hideLoading();
    })
  },
  // 获取支付配置列表
  handlePayConfigList(currency) {
    let api = 'com.ttdtrip.api.pay.apis.PayConfigListApiService';
    let data = { base: app.globalData.baseBody, currency: currency, source: 'wx' };
    app.request(api, data, res => {
      console.log(res);
      wx.hideLoading();
    }, fail => {
      wx.hideLoading();
    })
  }
})