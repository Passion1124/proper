//app.js
import md5 from './utils/md5.js'
App({
  onLaunch: function() {
    var city = wx.getStorageSync('city') || '';
    var authority = wx.getStorageSync('authority') || '';
    if (city) {
      this.globalData.cityName = city.cityName;
      this.globalData.baseBody.lat = city.latitude;
      this.globalData.baseBody.lng = city.longitude;
    }
    if (authority) {
      this.globalData.baseBody.auth = authority.auth;
      this.globalData.baseBody.myUid = authority.myUid;
    }

    // 登录
    wx.login({
      success: res => {
        console.log(res);
        if (res.code) {
          // let api = 'com.ttdtrip.api.account.apis.service.WeChatAuthApiService';
          // let data = { base: this.globalData.baseBody, code: res.code };
          // this.request(api, data, res => {
          //   console.log(res);
          // })
        }
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
    baseBody: {
      language: "zh-cn",
      lat: 0,
      lng: 0,
      currency: 'CNY'
    },
    cityName: '日本'
  },
  request (api, data, success, fail) {
    wx.request({
      url: this.globalData.baseUrl,
      data: data,
      header: this.getJson({ api: api, data: data }),
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.data.ret_code === '0000') {
          success(res.data);
        } else {
          console.log(res.data.ret_msg);
          wx.showToast({
            title: res.data.ret_msg,
            icon: 'none'
          });
          fail(res.data);
        }
      },
      fail: function(res) {
        fail(res);
      },
      complete: function(res) {},
    })
  },
  getJson(opt) {
    let headers = {
      'Content-Type': 'application/json',
      'X-Ca-Appid': 'ttd1',
      'X-Ca-Version': '1.0',
      'X-Ca-Api': opt.api,
      'X-Ca-Timestamp': new Date().getTime(),
      'X-Ca-Nonce': 'e807f1fcf82d132f9byh987bjn98', //随便给个
      'X-Ca-Signature': '',
      'X-Ca-Signature-Headers': 'X-Ca-Appid,X-Ca-Nonce,X-Ca-Timestamp,X-Ca-Version',
      'Accept': 'application/json'
    };
    let defaultOption = {
      type: "POST",
      url: this.globalData.baseUrl,
      data: {},
      async: true,
      timeout: 20000,
      dataType: "json"
    };
    let option = Object.assign(defaultOption, opt);
    option.data['base'] = this.globalData.baseBody;
    headers['Content-MD5'] = md5(JSON.stringify(option.data));
    headers['X-Ca-Signature'] = this.getSignature(headers);
    return headers;
  },
  getHeaders(headers) {
    let params = headers['X-Ca-Signature-Headers'].split(',');
    let result = '';
    for (let i = 0; i < params.length; i++) {
      let headerKey = params[i];
      result += headerKey + ":" + headers[headerKey] + "\n";
    }
    return result;
  },
  getSignature(headers) {
    let Headers = this.getHeaders(headers);
    let Path = '/gateway/';
    let Accept = headers['Accept'];
    let ContentType = headers['Content-Type'];
    let dateTime = headers['Date'];
    let ContentMD5 = headers['Content-MD5'];
    let appSecret = 'ttdscret';
    let stringToSign = 'POST' + "\n" +
      Accept + "\n" +
      ContentMD5 + "\n" +
      ContentType + "\n" +
      dateTime + "\n" +
      Headers +
      Path;

    let signed = md5(stringToSign + appSecret);
    return signed;
  }
})