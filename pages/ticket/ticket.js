import utils from '../../utils/util.js'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    merchId: '',
    order: {},
    orderMerches: [],
    merchItems: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.orderId = options.orderId;
    this.data.merchId = options.merchId;
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
        orderMerches: res.orderMerches
      });
      this.handleOrderMerchItemList();
    }, fail => {
      wx.hideLoading();
    })
  },
  // 商品二维码
  handleOrderMerchItemList() {
    let api = 'com.ttdtrip.api.order.apis.service.OrderMerchItemListApiService';
    let data = { base: app.globalData.baseBody, page: 1, limit: 10, orderId: this.data.orderId, merchId: this.data.orderMerches[0].merchId };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        merchItems: res.merchItems
      });
    }, e => {
      console.error(e);
    })
  },
  // 商品使用
  handleOrderUsed() {
    let api = 'com.ttdtrip.api.order.apis.service.OrderUsedApiService';
    let merchItems = this.data.merchItems[0];
    let item = e.currentTarget.dataset.item;
    let data = { base: app.globalData.baseBody, orderId: item.orderId, merchId: item.merchId, merchItemId: item.id };
    app.request(api, data, res => {
      console.log(res);
      utils.showMessage('订单完成');
      setTimeout(_ => {
        wx.navigateBack();
      }, 500);
    }, e => {
      console.error(e);
    })
  }
})