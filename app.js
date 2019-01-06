//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    var city = wx.getStorageSync('city') || '';
    if (city) {
      this.globalData.cityName = city.cityName;
      this.globalData.baseBody.lat = city.latitude;
      this.globalData.baseBody.lng = city.longitude;
    }

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    baseUrl: 'http://47.99.42.94:8080/gateway/',
    baseBody: { language: "zh-cn", lat: 0, lng: 0 },
    cityName: '日本'
  },
  request: function (api, data, success, fail) {
    wx.request({
      url: this.globalData.baseUrl,
      data: data,
      header: {
        'X-Ca-Appid': 'ttd1',
        'X-Ca-Version': '1.0',
        'X-Ca-Api': api,
        'X-Ca-Timestamp': new Date().getTime(),
        'X-Ca-Nonce': 'e807f1fcf82d132f9byh987bjn98',//随便给个
        'X-Ca-Signature': 'ca3e545836b4c4c1a2b8c53d5e2cb211',
        'X-Ca-Signature-Headers': 'X-Ca-Appid,X-Ca-Nonce,X-Ca-Timestamp,X-Ca-Version',
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.ret_code === '0000') {
          success(res.data);
        } else {
          console.log(res.data.ret_msg);
          fail(res.data);
        }
      },
      fail: function (res) {
        fail(res);
      },
      complete: function (res) { },
    })
  }
})