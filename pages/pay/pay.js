import utils from '../../utils/util.js'

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
    payOrder: {},
    order: {},
    orderMerches: {},
    config: {},
    count: 1
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
        order: res.order,
        orderMerches: res.orderMerches[0]
      });
      this.handlePayConfigList(res.order.payCurrency);
    }, fail => {
      wx.hideLoading();
    })
  },
  // 获取支付配置列表
  handlePayConfigList(currency) {
    let api = 'com.ttdtrip.api.pay.apis.PayConfigListApiService';
    let data = { base: app.globalData.baseBody, currency: currency, source: 'wxmini' };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        config: res.payConfigVOS
      })
      wx.hideLoading();
    }, fail => {
      wx.hideLoading();
    })
  },
  // 支付订单预下单
  handlePrePayOrder () {
    let api = 'com.ttdtrip.api.pay.apis.PrePayOrderApiService';
    let config = this.data.config[0];
    let order = this.data.order;
    let data = { base: app.globalData.baseBody, amount: order.payPrice, currency: config.currency, orderDesc: order.name, orderDetail: order.name, orderId: order.id, orderNo: order.orderNo, payConfigId: config.id, platform: config.platform };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        payOrder: res.payOrder
      })
      this.handlePayOrderProcess(res.payOrder)
    }, e => {
      console.error(e);
    })
  },
  // 支付处理过程
  handlePayOrderProcess(payOrder) {
    let api = 'com.ttdtrip.api.pay.apis.PayOrderProcessApiService';
    let data = { base: app.globalData.baseBody, preOrderId: payOrder.id, tradeType: 'WEB', openid: app.globalData.openId };
    let _this = this;
    app.request(api, data, res => {
      console.log(res);
      let info = res.wxh5PayInfo;
      wx.requestPayment({
        timeStamp: info.timeStamp,
        nonceStr: info.nonceStr,
        package: 'prepay_id=' + info.prepayId,
        signType: info.signType,
        paySign: info.paySign,
        success(res) {
          console.log(res);
          _this.handlePayOrderSync();
        },
        fail(res) {
          console.error(res);
        }
      })
    }, e => {
      console.error(e);
    })
  },
  // 支付订单同步
  handlePayOrderSync () {
    let api = 'com.ttdtrip.api.pay.apis.PayOrderSyncApiService';
    let data = { base: app.globalData.baseBody, preOrderId: this.data.payOrder.id, payerId: app.globalData.userInfo.uid };
    app.request(api, data, res => {
      console.log(res);
      utils.navigateTo('/pages/payresult/payresult?preOrderId=' + this.data.payOrder.id + '&orderId=' + this.data.orderId + '&giid=' + this.data.orderMerches.merchId);
    }, e => {
      console.error(e);
      this.data.count++;
      if (this.data.count <= 5) {
        this.handlePayOrderSync();
      } else {
        utils.navigateTo('/pages/payresult/payresult?preOrderId=' + this.data.payOrder.id + '&orderId=' + this.data.orderId + '&giid=' + this.data.orderMerches.merchId);
      }
    })
  },
  // 点击确认付款
  handleClickSurePay () {
    let order = this.data.order;
    if (order.orderStatus === 99) {
      utils.showMessage('订单已超过30分钟，已取消，请重新下单');
    }
    if (order.orderStatus === -1) {
      if (1800 - (new Date().getTime() - order.createAt) / 1000 < 0) {
        utils.showMessage('订单已超过30分钟，已取消，请重新下单');
      } else {
        this.handlePrePayOrder();
      }
    }
  }
})