const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cities: [],
    cityName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCities();
    this.setData({
      cityName: app.globalData.cityName
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
    let pages = getCurrentPages();
    if (pages.length > 1) {
      let prePage = pages[pages.length - 2];
      if (prePage.route === 'pages/index/index') {
        prePage.changeCity();
      }
    }
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
  getCities () {
    let data = { base: app.globalData.baseBody };
    let api = 'com.ttdtrip.api.config.apis.service.ServiceCityQryApiService';
    app.request(api, data, (res)=> {
      console.log(res);
      this.setData({
        cities: res.cities
      })
    }, (err) => {
      console.error(err);
    })
  },
  changeCity (e) {
    let item = e.currentTarget.dataset.item;
    this.setData({
      cityName: item.cityName
    });
    app.globalData.cityName = item.cityName;
    app.globalData.baseBody.lat = item.latitude;
    app.globalData.baseBody.lng = item.longitude;
    wx.setStorageSync('city', item);
    wx.navigateBack({
      delta: 1
    })
  }
})