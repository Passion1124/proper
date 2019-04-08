import md5 from '../../utils/md5.js'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    preOrderInfo: {},
    receiverId: '',
    orderMerches: [],
    goodsItem: {},
    currency: '',
    couponId: '',
    customerRequest: [],
    infoSure: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let bookOrder = wx.getStorageSync('bookOrder');
    let customerRequest = bookOrder.preOrderInfo.customerRequest.split('|');
    if (!customerRequest[0]) customerRequest = [];
    this.setData({
      preOrderInfo: bookOrder.preOrderInfo,
      receiverId: bookOrder.receiverId,
      orderMerches: bookOrder.orderMerches,
      goodsItem: bookOrder.goodsItem[0],
      currency: bookOrder.currency,
      customerRequest: customerRequest,
      couponId: bookOrder.couponId || ''
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
    wx.removeStorageSync('bookOrder');
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
  // 生成订单
  handleCreateOrderGen() {
    if (this.data.infoSure) return false;
    let api = 'com.ttdtrip.api.order.apis.service.OrderGenApiService';
    let preOrderInfo = this.data.preOrderInfo;
    delete preOrderInfo.priceEachOne;
    preOrderInfo.date = preOrderInfo.date.replace(/-/g, '');
    let p_data = { orderType: 0, receiverId: this.data.receiverId, preOrderInfo: preOrderInfo };
    if (this.data.type !== 'order') {
      p_data.orderMerches = this.data.orderMerches;
    }
    if (this.data.couponId) {
      p_data.couponId = this.data.couponId;
    };
    let sn = md5(p_data + new Date().getTime());
    let data = Object.assign({ base: app.globalData.baseBody }, p_data, { sn });
    this.data.infoSure = true;
    app.request(api, data, res => {
      console.log(res);
      let url = '/pages/pay/pay?orderId=' + res.orderId + '&orderNo=' + res.orderNo + '&currency=' + res.currency + '&type=2';
      if (!res.payPrice) {
        url = '/pages/payresult/payresult?orderId=' + res.orderId + '&mid=' + this.data.preOrderInfo.mid;
      }
      wx.navigateTo({
        url: url,
      })
      this.data.infoSure = false;
    }, err => {
      console.error(err);
      this.data.infoSure = false;
    })
  }
})