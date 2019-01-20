const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      nickname: '',
      gender: '',
      address: '',
      fax: ''
    },
    genderRange: [
      {
        value: 1,
        label: '先生'
      },
      {
        value: 2,
        label: '女士'
      }
    ]
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
  handleUserDetailUpdate () {
    if (!this.data.userInfo.nickname) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none'
      });
      return false;
    }
    if (!this.data.userInfo.gender) {
      wx.showToast({
        title: '称谓不能为空',
        icon: 'none'
      });
      return false;
    }
    let api = 'com.ttdtrip.api.account.apis.service.UserDetailUpdateApiService';
    let data = Object.assign({ base: app.globalData.baseBody }, this.data.userInfo);
    app.request(api, data, (res) => {
      console.log(res);
    }, (err) => {
      console.error(err);
    })
  },
  bindGenderChange (e) {
    let gender = this.data.genderRange[Number(e.detail.value)];
    this.setData({
      ['userInfo.gender']: gender.value
    })
  },
  bindNicknameChange (e) {
    this.setData({
      ['userInfo.nickname']: e.detail.value
    })
  },
  bindFaxChange(e) {
    this.setData({
      ['userInfo.fax']: e.detail.value
    })
  },
  bindAddressChange(e) {
    this.setData({
      ['userInfo.address']: e.detail.value
    })
  }
})