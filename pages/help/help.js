const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: ['密码、用户名忘记了，无法登录怎么办？', '如何成为TTD会员？', '什么是TTD优惠券？', '优惠券会过期吗？', '什么是收藏优惠券，为什么我要收藏优惠券？', '如何使用优惠券？', '优惠券金额会显示在发票里面吗？', '优惠券无法使用怎么办？', '优惠券的使用规则？', '如何查询优惠券信息？', '预订流程介绍', '预订问题', '付款成功后还有什么要做的？', '如何查看订单？', '订单支付方式', '如何申请退款？', '如何判断所购买商品是否支持退改？', '客服中心热线', '如何索要发票?', '如何进行投诉及意见建议？']
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
  goToTheHelpDetail (e) {
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/helpDetail/helpDetail?index=' + index,
    })
  }
})