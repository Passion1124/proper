const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    foodOrderId: '',
    foodOrder: {},
    foodOrderBatchDetailDtos: [],
    foodOrderBatches: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.foodOrderId = options.id;
    this.handleGetFoodOrderDetailList();
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
  // 查询菜品清单详情列表
  handleGetFoodOrderDetailList() {
    let api = 'com.ttdtrip.api.restaurant.apis.service.FoodOrderBatchDetailListApiService';
    let data = { base: app.globalData.baseBody, batchStatus: 1, foodOrderId: this.data.foodOrderId };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        foodOrder: res.foodOrder,
        foodOrderBatchDetailDtos: res.foodOrderBatchDetailDtos,
        foodOrderBatches: res.foodOrderBatches
      });
    })
  },
  // 修改订单
  goToTheFoodOrderPage () {
    wx.navigateTo({
      url: '/pages/foodorder/foodorder?orderId=' + this.data.foodOrderId + '&sn=' + this.data.foodOrder.lineSn,
    })
  }
})