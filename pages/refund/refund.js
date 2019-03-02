const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    reason: '行程有变动',
    orderId: '',
    name: '',
    tel: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.orderId = options.orderId
    this.setData({
      name: options.name,
      tel: options.tel
    })
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
  // 退款申请
  handleOrderRefunding () {
    let api = 'com.ttdtrip.api.order.apis.service.OrderRefundingApiService';
    let data = { base: app.globalData.baseBody, orderId: this.data.orderId, reason: this.data.reason };
    app.request(api, data, res => {
      console.log(res);
      let pages = getCurrentPages();
      let prePage = pages[pages.length - 2];
      prePage.handleOrderDetail();
      wx.navigateBack();
    }, e => {
      console.error(e);
    })
  },
  // 修改退款原因
  handleChangeReason (e) {
    this.setData({
      reason: e.currentTarget.dataset.text
    });
  }
})