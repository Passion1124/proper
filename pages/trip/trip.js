const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    trips: [],
    goods: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  getUserItineraryList: function () {
    let api = 'com.ttdtrip.api.order.apis.service.UserItineraryListApiService';
    let data = { base: app.globalData.baseBody, recentDays: 5 };
    app.request(api, data, (res) => {
      console.log(res);
    }, (err) => {
      console.error(err);
    })
  },
  getRGoodsList: function () {
    let api = 'com.ttdtrip.api.goods.apis.RGoodsListApiService';
    let data = { base: app.globalData.baseBody, location: 2, page: 1, size: 30 };
    app.request(api, data, (res) => {
      console.log(res);
      this.setData({
        goods: res.goodsVOs
      })
    }, (err) => {
      console.error(err);
    })
  }
})