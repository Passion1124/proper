import utils from '../../utils/util.js'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    giid: '',
    preOrderId: '',
    orderId: '',
    goods: [],
    goodsItem: {},
    result: 'success'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.data.giid = options.giid;
    this.data.preOrderId = options.preOrderId;
    this.data.orderId = options.orderId;
    if (this.data.preOrderId) this.handlePayOrderSync();
    this.getGoodsItemDetail();
    this.getRGoodsList();
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
  // 支付订单同步
  handlePayOrderSync() {
    let api = 'com.ttdtrip.api.pay.apis.PayOrderSyncApiService';
    let data = { base: app.globalData.baseBody, preOrderId: this.data.preOrderId, payerId: app.globalData.userInfo.uid };
    app.request(api, data, res => {
      console.log(res);
    }, e => {
      console.error(e);
      this.setData({
        result: 'fail'
      })
    })
  },
  // 商品项详情
  getGoodsItemDetail () {
    let api = 'com.ttdtrip.api.goods.apis.GoodsItemDetailApiService';
    let data = { base: app.globalData.baseBody, spec: 1, giid: this.data.giid };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        goodsItem: res.goodsItemVO
      })
    }, e => {
      console.error(e);
    })
  },
  // 猜你喜欢
  getRGoodsList: function () {
    let api = 'com.ttdtrip.api.goods.apis.RGoodsListApiService';
    let data = { base: app.globalData.baseBody, location: 4, page: 1, size: 30 };
    app.request(api, data, (res) => {
      console.log(res);
      this.setData({
        goods: res.goodsVOs
      })
    }, (err) => {
      console.error(err);
    })
  },
  goToThePoiDetail(e) {
    let gid = e.currentTarget.dataset.gid;
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/poi_detail/poi_detail?gid=' + gid + '&type=' + type,
    })
  },
  // 点击重新付款按钮
  handleClickAgainPayButton () {
    utils.navigateTo('/pages/pay/pay?orderId=' + this.data.orderId);
  },
  // 点击再次购买
  handleClickAgainShoppingButton () {
    let url = '/pages/order/order?giid=' + this.data.giid + '&type=' + this.data.goodsItem.goodsItemBase.gType;
    if (this.data.goodsItem.goodsItemBase.gType === 2) {
      url = '/pages/foodchoose/foodchoose?giid=' + this.data.giid;
    }
    utils.navigateTo(url);
  }
})