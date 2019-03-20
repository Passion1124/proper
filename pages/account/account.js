import utils from '../../utils/util.js'
import uploadImage from '../../utils/uploadAli/uploadFile.js'

const app = getApp();

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
    let _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        console.log(res);
        wx.showLoading({
          title: '上传中',
          mask: true
        });
        uploadImage(res.tempFilePaths[0], 'header/', res => {
          _this.setData({
            ['user.avatar']: res
          });
          _this.handleUserDetailUpdate();
          wx.hideLoading();
        }, e => {
          console.error(e);
          wx.hideLoading();
        })
      },
      fail: function (fail) {
        console.error(fail);
      }
    })
  },
  // 修改用户个人资料
  handleUserDetailUpdate () {
    let api = 'com.ttdtrip.api.account.apis.service.UserDetailUpdateApiService';
    let data = Object.assign({ base: app.globalData.baseBody }, this.data.user);
    app.request(api, data, (res) => {
      console.log(res);
      wx.setStorageSync('user', res.user);
    }, (err) => {
      console.error(err);
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
      wx.removeStorageSync('user');
      wx.removeStorageSync('authority');
      wx.switchTab({
        url: '/pages/index/index',
      })
    }, e => {
      console.error(e);
    })
  },
  // 跳转到绑定手机号码或者邮箱页面
  goToTheBindPhoneEmailPage (e) {
    let index = e.currentTarget.dataset.index;
    let user = this.data.user;
    let url = '/pages/bindPhoneEmail/bindPhoneEmail?index=' + index;
    console.log(index === '0' && user.phone);
    if ((index === '0' && user.phone) || (index === '1' && user.email)) {
      this.handleShowActionSheet(index, true);
    } else {
      utils.navigateTo(url);
    }
  },
  // 展示弹窗
  handleShowActionSheet (index, change) {
    wx.showActionSheet({
      itemList: ['更换'],
      success (res) {
        console.log(res);
        if (res.tapIndex === 0) {
          utils.navigateTo('/pages/bindPhoneEmail/bindPhoneEmail?index=' + index + '&change=' + change);
        }
      }
    })
  }
})