import utils from '../../utils/util.js'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    foodOrderId: '',
    foodOrder: {},
    showNum: 11,
    selectNum: '',
    open: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.foodOrderId = options.foodOrderId;
    this.handleFoodOrderGet();
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
  // 查询点菜订单详情
  handleFoodOrderGet () {
    let api = 'com.ttdtrip.api.restaurant.apis.service.v2.FoodOrderGetApiService';
    let data = { base: app.globalData.baseBody, foodOrderId: this.data.foodOrderId };
    app.request(api, data, res => {
      this.setData({
        foodOrder: res.foodOrder
      })
    }, e => {
      console.error(e);
    })
  },
  handleClickOpenTableNumber () {
    this.setData({
      open: true,
      showNum: 20
    })
  },
  bindChangeSelectNum (e) {
    this.setData({
      selectNum: parseInt(e.currentTarget.dataset.num)
    });
  }
})