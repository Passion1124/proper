const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    couponCount: 0,
    favorCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      });
      this.getUserCount();
    }
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
  getUserCount () {
    let api = 'com.ttdtrip.api.goods.apis.UserCountApiService';
    let data = { base: app.globalData.baseBody, qryType: 1 };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        favorCount: res.favorCount,
        couponCount: res.couponCount
      })
    }, err => {
      console.error(err);
    })
  },
  goToTheFeedBack () {
    wx.navigateTo({
      url: '/pages/feedback/feedback'
    })
  },
  goToTheAccount () {
    if (!app.globalData.userInfo) {
      wx.navigateTo({
        url: '/pages/signIn/signIn',
      })
    }
    wx.navigateTo({
      url: '/pages/account/account',
    })
  },
  goToTheMyCoupon () {
    wx.navigateTo({
      url: '/pages/myCoupon/myCoupon',
    })
  },
  goToTheCollection () {
    wx.navigateTo({
      url: '/pages/collection/collection',
    })
  },
  goToTheAbout () {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },
  goToTheHelp () {
    wx.navigateTo({
      url: '/pages/help/help',
    })
  },
  goToTheMyOrder (e) {
    console.log(e);
    let orderType = e.currentTarget.dataset.ordertype;
    wx.navigateTo({
      url: '/pages/myOrder/myOrder?orderType=' + orderType,
    })
  }
})