const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderType: '',
    orderOptions: [
      { label: '全部订单', value: 0 },
      { label: '待付款', value: 1 },
      { label: '待使用', value: 2 },
      { label: '待点评', value: 3 }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderType = Number(options.orderType);
    wx.setNavigationBarTitle({
      title: this.data.orderOptions.find(item => item.value === orderType).label,
    })
    this.setData({
      orderType: orderType
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
    
  }
})