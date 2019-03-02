const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    order: {},
    orderMerches: [],
    receiver: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.orderId = options.id;
    this.handleOrderDetail();
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
  // 获取订单详情接口
  handleOrderDetail() {
    let api = 'com.ttdtrip.api.order.apis.service.OrderDetailApiService';
    let data = { base: app.globalData.baseBody, orderId: this.data.orderId };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        order: res.order,
        orderMerches: res.orderMerches,
        receiver: res.receiver
      });
    }, fail => {
      wx.hideLoading();
    })
  },
  // 取消订单
  handleOrderCancel() {
    let api = 'com.ttdtrip.api.order.apis.service.OrderCancelApiService';
    let data = { base: app.globalData.baseBody, orderId: this.data.orderId };
    app.request(api, data, res => {
      console.log(res);
      this.handleOrderDetail();
    }, fail => {
      wx.hideLoading();
    })
  },
  // 点击取消订单按钮
  handleClickOrderCancelButton() {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定取消该订单',
      success(res) {
        if (res.confirm) {
          that.handleOrderCancel();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },
  // 立即付款
  goToThePay() {
    wx.navigateTo({
      url: '/pages/pay/pay?orderId=' + this.data.orderId + '&orderNo=' + this.data.order.orderNo + '&currency=' + this.data.order.payCurrency + '&type=2',
    })
  },
  // 再次购买
  goToTheOrder () {
    wx.navigateTo({
      url: '/pages/order/order?giid=' + this.data.orderMerches[0].merchId + '&type=' + this.data.orderMerches[0].merchType,
    })
  },
  // 申请退款
  goToTheRefund () {
    wx.navigateTo({
      url: '/pages/refund/refund?orderId=' + this.data.orderId + '&name=' + this.data.receiver.name + '&tel=' + this.data.receiver.phoneNo,
    })
  }
})