import utils from '../../utils/util.js'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    foodOrderId: '',
    mid: '',
    tno: '',
    consumerCount: 0,
    serviceFee: 0,
    totalFee: 0,
    teeFee: 0,
    foodItems: [],
    orderItems: [],
    currency: 'JPY',
    mustPoint: [],
    putQuestions: [],
    setMeal: [],
    ordinary: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      foodOrderId: options.foodOrderId,
      mid: options.mid,
      consumerCount: parseInt(options.personNum),
      tno: options.tno
    });
    this.getFoodOrderGetByBasket();
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
  // 查询菜篮子里的点菜订单
  getFoodOrderGetByBasket () {
    let api = 'com.ttdtrip.api.restaurant.apis.service.v2.FoodOrderGetByBasketApiService';
    let data = { base: app.globalData.baseBody, appFrom: 1, foodOrderId: this.data.foodOrderId };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        foodItems: res.foodItems,
        orderItems: res.orderItems,
        personNum: res.consumerCount,
        serviceFee: res.serviceFee,
        teeFee: res.teeFee / res.consumerCount,
        totalFee: res.totalFee,
        consumerCount: res.consumerCount,
        currency: res.currency,
        mustPoint: res.orderItems.filter(item => item.type === 9),
        putQuestions: res.orderItems.filter(item => item.type === 2),
        setMeal: res.orderItems.filter(item => item.type === 3),
        ordinary: res.orderItems.filter(item => item.type === 1)
      })
    }, e => {
      console.error(e);
    })
  },
  // 菜篮子内菜品确认下单
  handleClickGoToTheOrder () {
    let meet = this.data.orderItems.find(item => {
      let food = item.food;
      return !this.getNowFoodSelectable(food.limitType, food.limitTimeStart, food.limitTimeEnd);
    });
    if (meet) {
      utils.showMessage(meet.food.foodName + '菜品未到售卖时间');
      return false;
    }
    let api = 'com.ttdtrip.api.restaurant.apis.service.v2.FoodBasketConfirmApiService';
    let data = { base: app.globalData.baseBody, foodOrderId: this.data.foodOrderId };
    app.request(api, data, res => {
      utils.navigateTo('/pages/foodpayresult/foodpayresult?foodOrderId=' + this.data.foodOrderId + '&mid=' + this.data.mid + '&tno=' + this.data.tno);
    }, e => {
      console.error(e);
    })
  },
  // 判断当前食物是否在可点时段
  getNowFoodSelectable(type, beginTime, endTime) {
    if (type === 0) {
      return true;
    }
    if ((!beginTime && !endTime) || (beginTime === '00:00' && endTime === '00:00')) {
      return true;
    } else {
      var n = new Date();
      var b = new Date();
      var e = new Date();
      b.setHours(beginTime.split(':')[0]);
      b.setMinutes(beginTime.split(':')[1]);
      e.setHours(endTime.split(':')[0]);
      e.setMinutes(endTime.split(':')[1]);
      if (n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {
        return true;
      } else {
        return false;
      }
    }
  }
})