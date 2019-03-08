const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getUserInfo(e) {
    console.log(e);
    if (e.detail.userInfo) {
      this.data.userInfo = e.detail.userInfo;
      this.getWeChatOpenId();
    } else {
      wx.showModal({
        title: '用户未授权',
        content: '如需正常使用小程序功能，请按确定并且在登录页面中点击登录按钮，同意授权。',
        showCancel: false,
        success: function(res) {
          console.log(res);
        }
      })
    }
  },
  getWeChatOpenId() {
    // 登录
    wx.login({
      success: res => {
        console.log(res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          let api = 'com.ttdtrip.api.account.apis.service.WXMiniLoginApiService';
          let data = {
            base: app.globalData.baseBody,
            code: res.code
          };
          app.request(api, data, info => {
            console.log(info);
            this.handleSocialLogin(info);
          }, err => {
            console.error(err);
          })
        }
      }
    })
  },
  handleSocialLogin(info) {
    let api = 'com.ttdtrip.api.account.apis.service.SocialLoginApiService';
    let data = {
      base: app.globalData.baseBody,
      openId: info.openId,
      source: 'wxmini',
      nickname: this.data.userInfo.nickName,
      avatar: this.data.userInfo.avatarUrl,
      sex: this.data.userInfo.gender,
      province: this.data.userInfo.province,
      city: this.data.userInfo.city,
      country: this.data.userInfo.country
    };
    app.request(api, data, res => {
      console.log(res);
      app.globalData.baseBody.auth = res.auth;
      app.globalData.baseBody.myUid = res.user.uid;
      app.globalData.userInfo = res.user;
      wx.setStorageSync('authority', {
        auth: app.globalData.baseBody.auth,
        myUid: app.globalData.baseBody.myUid
      });
      wx.setStorageSync('user', res.user);
      wx.navigateBack();
    }, err => {
      console.error(err);
    })
  }
})