const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsItem: [],
    gid: '',
    type: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.gid = options.gid;
    this.data.type = options.type;
    this.handleGetGoodsItemList();
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
  handleGetGoodsItemList () {
    let api = 'com.ttdtrip.api.goods.apis.GoodsItemListApiService';
    let data = { base: app.globalData.baseBody, gid: this.data.gid, page: 1, size: 30 };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        goodsItem: res.goodsItemVOS
      })
    })
  },
  goToTheGoodsItemDetail (e) {
    let giid = e.currentTarget.dataset.giid;
    wx.navigateTo({
      url: '/pages/goodItemDetail/goodItemDetail?giid=' + giid + '&gid=' + this.data.gid + '&type=' + this.data.type,
    })
  }
})