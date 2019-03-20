//app.js
import md5 from './utils/md5.js'
import utils from './utils/util.js'
App({
  onLaunch: function() {
    var city = wx.getStorageSync('city') || '';
    var authority = wx.getStorageSync('authority') || '';
    var user = wx.getStorageSync('user') || '';
    if (city) {
      this.globalData.cityName = city.cityName;
      this.globalData.baseBody.lat = city.latitude;
      this.globalData.baseBody.lng = city.longitude;
    }
    if (authority) {
      this.globalData.baseBody.auth = authority.auth;
      this.globalData.baseBody.myUid = authority.myUid;
      this.globalData.openId = authority.openId;
    }
    if (user) this.globalData.userInfo = user;
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
    openId: '',
    cityName: '日本'
  },
  request (api, data, success, fail) {
    wx.request({
      url: this.globalData.baseUrl,
      data: data,
      header: this.getJson({ apiname: api, data: data }),
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.data.ret_code === '0000') {
          success(res.data);
        } else {
          console.log(res.data.ret_msg);
          if (res.data.ret_code === '1099') {
            utils.showMessage(res.data.ret_msg);
            wx.navigateTo({
              url: '/pages/signIn/signIn',
            });
          } else {
            if (res.data.ret_code !== '1113') {
              utils.showMessage(res.data.ret_msg);
            }
            fail(res.data);
          }
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
      'X-Ca-Api': opt.apiname,
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