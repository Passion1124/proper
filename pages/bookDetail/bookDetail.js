const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    order: {},
    explain: [],
    orderMerches: [],
    result: '',
    goods: {},
    popup: false,
    count_down: 1800,
    isTimeOut: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.orderId = options.id;
    console.log(options)
    if (options.result) {
      this.setData({
        result: options.result
      })
    }
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
      let explain = res.order.preOrder.customerRequest ? res.order.preOrder.customerRequest.split('|') : [];
      this.setData({
        order: res.order,
        explain: explain,
        orderMerches: res.orderMerches
      });
      if (this.data.order.orderStatus === -1) {
        if (1800 - (new Date().getTime() - this.data.order.createAt) / 1000 > 0) {
          this.startInterVal();
        } else {
          this.setData({
            isTimeOut: true
          });
        }
      };
      this.handleGetGoodsDetail(res.order.mid);
    }, fail => {
      wx.hideLoading();
    })
  },
  // 获取商品详情
  handleGetGoodsDetail (mid) {
    let api = 'com.ttdtrip.api.goods.apis.GoodsDetailApiService';
    let data = { base: app.globalData.baseBody, mid };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        goods: res.goodsVO
      })
    }, e => {
      console.error(e);
    })
  },
  // 订单退单申请
  handleOrderRefundin() {
    let api = 'com.ttdtrip.api.order.apis.service.OrderRefundingApiService';
    let data = { base: app.globalData.baseBody, orderId: this.data.orderId, reason: '用户主动申请退款' };
    app.request(api, data, res => {
      console.log(res);
      this.handleOrderDetail();
    }, fail => {
      wx.hideLoading();
    })
  },
  // 订单取消
  handleOrderCancel () {
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
  handleClickOrderCancelButton () {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定取消该订单',
      success(res) {
        if (res.confirm) {
          if (that.data.order.orderStatus === 3 || that.data.order.orderStatus === 1) {
            that.handleOrderRefundin();
          } else {
            that.handleOrderCancel();
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },
  // 立即付款
  goToThePay () {
    wx.navigateTo({
      url: '/pages/pay/pay?orderId=' + this.data.orderId + '&orderNo=' + this.data.order.orderNo + '&currency=' + this.data.order.payCurrency + '&type=2',
    })
  },
  // 复制微信号或者邮箱
  handleClipboardWechatOrEmail (e) {
    let msg = e.currentTarget.dataset.msg;
    let clip = e.currentTarget.dataset.clip;
    let _this = this;
    wx.setClipboardData({
      data: clip,
      success (res) {
        _this.handleHidePopup();
        wx.showToast({
          title: msg + '复制成功',
        })
      }
    })
  },
  handleShowPopup () {
    this.setData({
      popup: true
    })
  },
  handleHidePopup () {
    this.setData({
      popup: false
    })
  },
  startInterVal() {
    this.data.countSetInterVal = setInterval(this.setCountDown, 1000);
  },
  endInterVal() {
    clearInterval(this.data.countSetInterVal);
    this.handleOrderDetail();
  },
  setCountDown() {
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
  goToTheFoodDetailPage (e) {
    wx.navigateTo({
      url: '/pages/fooddetail/fooddetail?gid=' + this.data.goods.goodsInfo.gid + '&type=2'
    })
  }
})