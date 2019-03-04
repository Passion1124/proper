const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    line: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      line: wx.getStorageSync('line')
    })
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
  // 排队
  handleLine () {
    let api = 'com.ttdtrip.api.goods.apis.line.LineApiService';
    let data = Object.assign({ base: app.globalData.baseBody }, this.data.line);
    app.request(api, data, res => {
      console.log(res);
      let line = this.data.line;
      wx.navigateTo({
        url: '/pages/lineUpDetail/lineUpDetail?sn=' + res.sn + '&num=' + line.num + '&email=' + line.email + '&favorName=' + line.favorName + '&roomName=' + line.roomName,
      })
    }, e => {
      console.error(e);
    })
  }
})