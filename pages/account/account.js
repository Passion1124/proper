const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {}
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
    this.getUserDetail();
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
  // 获取用户信息
  getUserDetail () {
    let api = 'com.ttdtrip.api.account.apis.service.UserDetailApiService';
    let data = { base: app.globalData.baseBody };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        user: res.user
      });
      wx.setStorageSync('user', res.user);
    }, e => {
      console.error(e);
    })
  },
  wxChooseImage () {
    wx.chooseImage({
      count: 1,
      sourceType: ['album'],
      success: function(res) {
        console.log(res);
        wx.previewImage({
          urls: [].concat(res.tempFilePaths),
        })
      },
      fail: function (fail) {
        console.error(fail);
      }
    })
  },
  goToTheEditAccount () {
    wx.navigateTo({
      url: '/pages/editAccount/editAccount',
    })
  },
  // 退出登录
  logOut () {
    let api = 'com.ttdtrip.api.account.apis.service.LogoutApiService';
    let data = { base: app.globalData.baseBody };
    app.request(api, data, res => {
      console.log(res);
      app.globalData.userInfo = null;
      wx.clearStorageSync();
      wx.switchTab({
        url: '/pages/index/index',
      })
    }, e => {
      console.error(e);
    })
  }
})