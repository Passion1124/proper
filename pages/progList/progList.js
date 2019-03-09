const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sortType: 1,
    name: '',
    labelId: '',
    cityId: '',
    type: '',
    page: 1,
    size: 30,
    goods: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      name: options.name,
      labelId: options.labelId,
      type: Number(options.type)
    });
    let city = wx.getStorageSync('city') || '';
    if (city) this.data.cityId = city.cityId;
    wx.setNavigationBarTitle({
      title: (this.data.type === 2 ? '美食-' : '购物-') + this.data.name,
    });
    this.getGoodsList();
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
    this.data.page = 1;
    this.data.goods = [];
    this.getGoodsList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if ((this.data.goods.length / this.data.size) % 1 === 0) {
      this.data.page++;
      this.getGoodsList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  getGoodsList () {
    let _data = this.data;
    let api = 'com.ttdtrip.api.goods.apis.GoodsListApiService';
    let data = { base: app.globalData.baseBody, page: _data.page, size: _data.size, type: _data.type, sortType: _data.sortType, labelId: _data.labelId, cityId: this.data.cityId };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        goods: this.data.goods.concat(res.goodsVOs)
      });
      wx.stopPullDownRefresh();
    }, err => {
      console.error(err);
      wx.stopPullDownRefresh();
    })
  },
  changeSortType (e) {
    let sortType = Number(e.currentTarget.dataset.sorttype);
    if (this.data.sortType !== sortType) {
      this.data.page = 1;
      this.data.goods = [];
      this.setData({
        sortType: sortType
      });
      this.getGoodsList();
    }
  },
  goToThePoiDetail (e) {
    let gid = e.currentTarget.dataset.gid;
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/poi_detail/poi_detail?gid=' + gid + '&type=' + type,
    })
  }
})