const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gid: '',
    type: '',
    page: 1,
    size: 10,
    goodsItem: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.gid = options.gid;
    this.data.type = options.type;
    this.getGoodsItemList();
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
  // 子商品列表
  getGoodsItemList() {
    let api = 'com.ttdtrip.api.goods.apis.GoodsItemListApiService';
    let data = { base: app.globalData.baseBody, gid: this.data.gid, subType: 21, page: this.data.page, size: this.data.size };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        goodsItem: res.goodsItemVOS
      });
    }, e => {
      console.error(e);
    })
  }
})