import utils from '../../utils/util.js'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: '',
    type: 1,
    phone: '',
    email: '',
    verifyCode: '',
    verifyCodeId: '',
    step: 'first',
    interval: '',
    second: 60,
    isAgainCode: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      index: options.index
    });
    if (options.change) this.data.type = 3;
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
  // 获取验证码
  handleGetVerificationCode (type) {
    let api = 'com.ttdtrip.api.account.apis.service.VerificationCodeGetApiService';
    let data = { base: app.globalData.baseBody, type: this.data.type };
    if (this.data.index === '0') {
      data.phone = this.data.phone
    } else {
      data.email = this.data.email
    };
    app.request(api, data, res => {
      let obj = { verifyCodeId: res.verifyCodeId };
      if (type === 'next') {
        obj.step = 'binding'
      }
      this.startSetInterVal();
      this.setData(obj);
    })
  },
  // 验证码验证接口
  handleVerificationValid () {
    let api = 'com.ttdtrip.api.account.apis.service.VerificationValidApiService';
    let data = { base: app.globalData.baseBody, verifyCode: this.data.verifyCode, verifyCodeId: this.data.verifyCodeId };
    if (this.data.index === '0') {
      data.phone = this.data.phone
    } else {
      data.email = this.data.email
    };
    app.request(api, data, res => {
      console.log(res);
      if (this.data.index === '0') {
        this.handlePhoneBind();
      } else {
        this.handleEmailBind();
      };
    }, e => {
      console.error(e);
    })
  },
  // 绑定手机号
  handlePhoneBind () {
    let api = 'com.ttdtrip.api.account.apis.service.PhoneBindApiService';
    let data = { base: app.globalData.baseBody, verifyCode: this.data.verifyCode, verifyCodeId: this.data.verifyCodeId, phone: this.data.phone };
    app.request(api, data, res => {
      console.log(res);
      utils.showMessage('手机号绑定成功');
      setTimeout(_ => {
        wx.navigateBack();
      }, 500)
    }, e => {
      console.error(e)
    })
  },
  // 绑定邮箱
  handleEmailBind () {
    let api = 'com.ttdtrip.api.account.apis.service.EmailBindApiService';
    let data = { base: app.globalData.baseBody, verifyCode: this.data.verifyCode, verifyCodeId: this.data.verifyCodeId, email: this.data.email };
    app.request(api, data, res => {
      console.log(res);
      utils.showMessage('邮箱绑定成功');
      setTimeout(_ => {
        wx.navigateBack();
      }, 500)
    }, e => {
      console.error(e)
    })
  },
  // 启动定时
  startSetInterVal () {
    this.data.interval = setInterval(_ => {
      let second = this.data.second;
      if (second) {
        second--;
        this.setData({
          second,
          isAgainCode: true
        })
      } else {
        this.endSetInterVal();
      }
    }, 1000)
  },
  // 停止定时器
  endSetInterVal () {
    clearInterval(this.data.interval);
    this.setData({
      second: 60,
      isAgainCode: false,
      interval: ''
    })
  },
  // 修改输入框的值
  handleInputValue (e) {
    let val = e.currentTarget.dataset.type;
    this.setData({
      [val]: e.detail.value
    })
  },
  // 点击重新获取验证码
  handleClickAgainCode() {
    if (!this.data.isAgainCode) {
      this.handleGetVerificationCode('again')
    }
  },
  // 点击下一步按钮
  handleClickNextButton () {
    if (this.data.index === '0' && !this.data.phone) {
      utils.showMessage('请输入手机号');
    } else if (this.data.index === '1' && !this.data.email) {
      utils.showMessage('请输入邮箱');
    } else {
      this.handleGetVerificationCode('next')
    }
  },
  // 点击绑定按钮
  handleClickBindingButton () {
    if (this.data.verifyCode) {
      this.handleVerificationValid();
    } else {
      utils.showMessage('请输入验证码');
    }
  }
})