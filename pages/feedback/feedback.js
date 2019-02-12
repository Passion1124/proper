import md5 from '../../utils/md5.js'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    contact: '',
    info: ''
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
  handleSubmitFeedBack () {
    let info = this.data.info;
    let contact = this.data.contact;
    if (info) {
      let sn = md5(info + contact);
      let data = { base: app.globalData.baseBody, info, contact, sn };
      let api = 'com.ttdtrip.api.config.apis.service.FeedBackApiService';
      app.request(api, data, res => {
        console.log(res);
        wx.navigateBack();
        let pages = getCurrentPages();
        pages[pages.length - 2].showFeedBackSuccessToast();
      }, err => {
        console.error(err);
      })
    } else{
      wx.showToast({
        title: '请输入你要反馈的内容',
        icon: 'none'
      })
    }
  },
  handleInputInfo (e) {
    this.setData({
      info: e.detail.value
    })
  },
  handleInputContact (e) {
    this.setData({
      contact: e.detail.value
    })
  }
})