import utils from '../../utils/util.js'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    foodOrderId: '',
    foodOrder: {},
    foodList: [],
    orderItems: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.foodOrderId = options.orderId;
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
    let data = { base: app.globalData.baseBody, foodOrderId: this.data.foodOrderId, appFrom: 1 };
    app.request(api, data, res => {
      console.log(res);
      let foodList = res.orderItems.map(item => {
        let obj = {};
        obj.mustPoint = item.orderItems.filter(item => item.type === 9);
        obj.putQuestions = item.orderItems.filter(item => item.type === 2);
        obj.setMeal = item.orderItems.filter(item => item.type === 3);
        obj.ordinary = item.orderItems.filter(item => item.type === 1);
        return obj;
      });
      this.setData({
        foodOrder: res.foodOrder,
        orderItems: res.orderItems,
        foodList
      });
      console.log(foodList);
    }, e => {
      console.error(e);
    })
  },
  // 点击继续加菜按钮
  handleClickAddFoodButton () {
    utils.navigateTo('/pages/foodorder/foodorder?mid=' + this.data.foodOrder.mid + '&tno=' + this.data.foodOrder.tableNo + '&toPage=foodadd');
  }
})