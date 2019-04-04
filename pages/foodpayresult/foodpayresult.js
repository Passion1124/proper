const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    foodOrderId: '',
    mid: '',
    tno: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      foodOrderId: options.foodOrderId,
      mid: options.mid,
      tno: options.tno
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
  // 点击加菜按钮进入加菜页面
  handleGoToTheFoodAddPage () {
    wx.redirectTo({
      url: '/pages/foodadd/foodadd?orderId=' + this.data.foodOrderId,
    })
  },
  // 点击完成按钮进入到首页
  handleGoToTheIndexPage () {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})