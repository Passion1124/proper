const app = getApp();

var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gid: '',
    giid: '',
    goods: {},
    goodsItem: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      gid: options.gid,
      giid: options.giid
    });
    this.getGoodsItemDetail();
    this.getGoodsDetail();
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
  getGoodsItemDetail: function () {
    let api = 'com.ttdtrip.api.goods.apis.GoodsItemDetailApiService';
    let data = { base: app.globalData.baseBody, giId: this.data.giid, spec: 1 };
    app.request(api, data, (res) => {
      console.log(res);
      this.setData({
        goodsItem: res.goodsItemVO
      });
      WxParse.wxParse('article', 'html', this.data.goodsItem.goodsItemInfo.info, this, 5);
    }, (err) => {
      console.error(err);
    })
  },
  getGoodsDetail: function () {
    let api = 'com.ttdtrip.api.goods.apis.GoodsDetailApiService';
    let data = { base: app.globalData.baseBody, gid: this.data.gid, spec: 1 };
    app.request(api, data, (res) => {
      console.log(res);
      this.setData({
        goods: res.goodsVO
      })
    }, (err) => {
      console.error(err);
    })
  },
  goToTheAdvanceOrder: function () {
    wx.navigateTo({
      url: '/pages/order/order',
    })
  }
})