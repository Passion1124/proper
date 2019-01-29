const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
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
  getUserInfo (e) {
    console.log(e);
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      this.getWeChatOpenId();
    } else {
      wx.showModal({
        title: '用户未授权',
        content: '如需正常使用小程序功能，请按确定并且在登录页面中点击登录按钮，同意授权。',
        showCancel: false,
        success: function (res) {
          console.log(res);
        }
      })
    }
  },
  getWeChatOpenId () {
    // 登录
    wx.login({
      success: res => {
        console.log(res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          let api = 'com.ttdtrip.api.account.apis.service.WeChatAuthApiService';
          let data = { base: app.globalData.baseBody, code: res.code };
          app.request(api, data, info => {
            console.log(info);
            this.handleSocialLogin(info);
          }, err => {
            console.error(err);
            app.globalData.baseBody.auth = 'gWxbNvHRFszIPaoUbW+J7UDDA0pq7I8impKOpJEzkgU=.cVY4C35phECzuxhXn970XcqM8fuCivw40UYzvBv9ii+51N/A+hFBlsySwsJCfVVDTG/soYgxMLnMX9zEUSaiF2RbpPUpVbrlxpUqtYHQH/TSmmtcX1kgrvcSGfxU4VE+JEI/qYNkMcw=.c3535caf8a44666e06a9437bf809caf5bf636cee';
            app.globalData.baseBody.myUid = 'dd178d82-809f-4d88-a02e-d49b348d2f92';
            wx.setStorageSync('authority', { auth: app.globalData.baseBody.auth, myUid: app.globalData.baseBody.myUid });
            wx.navigateBack();
          })
        }
      }
    })
  },
  handleSocialLogin (info) {
    let api = 'com.ttdtrip.api.account.apis.service.SocialLoginApiService';
    let data = { base: app.globalData.baseBody, openId: info.openId, source: 'WEIXIN', nickname: info.nickname, avatar: info.avatar };
    app.request(api, data, res => {
      console.log(res);
      app.globalData.baseBody.auth = res.auth;
      app.globalData.baseBody.myUid = res.user.uid;
      wx.setStorageSync('authority', { auth: app.globalData.baseBody.auth, myUid: app.globalData.baseBody.myUid });
      wx.navigateBack();
    }, err => {
      console.error(err);
    })
  }
})