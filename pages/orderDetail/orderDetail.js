import utils from '../../utils/util.js'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    order: {},
    orderMerches: [],
    receiver: {},
    count_down: 1800,
    countSetInterVal: '',
    isTimeOut: false,
    merchItems: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.orderId = options.id;
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
    this.handleOrderDetail();
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
    this.endInterVal();
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
      this.handleOrderMerchItemList();
      if (this.data.order.orderStatus === -1) {
        if (1800 - (new Date().getTime() - this.data.order.createAt) / 1000 > 0) {
          this.startInterVal();
        } else {
          this.setData({
            isTimeOut: true
          });
        }
      }
    }, fail => {
      wx.hideLoading();
    })
  },
  // 商品二维码
  handleOrderMerchItemList () {
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
  handleOrderUsed () {
    let api = 'com.ttdtrip.api.order.apis.service.OrderUsedApiService';
    let merchItems = this.data.merchItems[0];
    let data = { base: app.globalData.baseBody, orderId: merchItems.orderId, merchId: merchItems.merchId, merchItemId: merchItems.id };
    app.request(api, data, res => {
      console.log(res);
      utils.showMessage('订单完成');
      this.handleOrderDetail();
    }, e => {
      console.error(e);
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
  startInterVal () {
    this.data.countSetInterVal = setInterval(this.setCountDown, 1000);
  },
  endInterVal () {
    clearInterval(this.data.countSetInterVal);
    this.handleOrderDetail();
  },
  setCountDown () {
    let time = 1800 - (new Date().getTime() - this.data.order.createAt) / 1000;
    time = parseInt(time);
    if (time > 0) {
      this.setData({
        count_down: time
      });
    } else {
      this.endInterVal();
      this.setData({
        isTimeOut: true
      })
    }
  },
  // 立即付款
  goToThePay() {
    wx.navigateTo({
      url: '/pages/pay/pay?orderId=' + this.data.orderId + '&orderNo=' + this.data.order.orderNo + '&currency=' + this.data.order.payCurrency + '&type=2',
    })
  },
  // 再次购买
  goToTheOrder () {
    let order = this.data.order;
    let url = '';
    if (order.preOrder) {
      url = '/pages/foodchoose/foodchoose?giid=' + this.data.orderMerches[0].merchId
    } else {
      url = '/pages/order/order?giid=' + this.data.orderMerches[0].merchId + '&type=' + this.data.orderMerches[0].merchType;
    }
    wx.navigateTo({
      url: url,
    })
  },
  // 申请退款
  goToTheRefund () {
    wx.navigateTo({
      url: '/pages/refund/refund?orderId=' + this.data.orderId + '&name=' + this.data.receiver.name + '&tel=' + this.data.receiver.phoneNo,
    })
  },
  // 立即付款
  goToThePayPage () {
    let order = this.data.order;
    let orderId = order.id;
    let orderNo = order.orderNo;
    let currency = order.payCurrency;
    utils.navigateTo('/pages/pay/pay?orderId=' + orderId +'&orderNo='+ orderNo+'&currency='+ currency+'&type=1');
  },
  // 前往评价
  goToTheComment () {
    utils.navigateTo('/pages/comment/comment?target=' + this.data.orderMerches[0].poiId + '&orderId=' + this.data.orderId)
  },
  // 去核销券页面
  goToTheTicketPage () {
    utils.navigateTo('/pages/ticket/ticket?orderId=' + this.data.orderId + '&merchId=' + this.data.orderMerches[0].merchId);
  }
})