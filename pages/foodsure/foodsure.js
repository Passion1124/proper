import util from '../../utils/util.js'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sn: '',
    mid: '',
    foodOrderId: '',
    foodOrder: {},
    foodOrderBatchDetailDtos: [],
    foodOrderBatches: [],
    line: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sn: options.sn,
      mid: options.mid,
      foodOrderId: options.foodOrderId
    });
    this.handleLineWait();
    this.handleGetFoodOrderDetailList(this.data.foodOrderId);
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
  //排队检查(详情)
  handleLineWait() {
    let api = 'com.ttdtrip.api.goods.apis.line.LineWaitApiService';
    let data = { base: app.globalData.baseBody, sn: this.data.sn };
    this.data.count++;
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        line: res.line
      });
    }, e => {
      console.error(e);
    })
  },
  // 向清单中添加菜品
  handleFoodOrderAdd(e) {
    let food = e.currentTarget.dataset.food.food;
    let line = this.data.line;
    let api = 'com.ttdtrip.api.restaurant.apis.service.FoodOrderBatchDetailAddApiService';
    let data = { base: app.globalData.baseBody, bookingDstDate: util.formatDate(line.lineAt), foodId: food.id, foodNumber: 1, consumerCount: line.num, foodOrderExts: { allowSmoke: line.smoke, isBox: line.box }, lineName: line.fullName, lineSn: line.sn, mid: line.mid };
    app.request(api, data, res => {
      this.setData({
        foodOrderId: res.foodOrderId
      })
      this.handleGetFoodOrderDetailList(res.foodOrderId);
    }, e => {
      console.error(e);
    })
  },
  // 向清单中删除菜品
  handleFoodOrderDelete(e) {
    let num = e.currentTarget.dataset.num;
    if (parseInt(num) <= 0) return false;
    let food = e.currentTarget.dataset.food.food;
    let api = 'com.ttdtrip.api.restaurant.apis.service.FoodOrderBatchDetailDeleteApiService';
    let data = { base: app.globalData.baseBody, foodOrderId: this.data.foodOrderId, foodId: food.id, foodNumber: 1 };
    app.request(api, data, res => {
      console.log(res);
      let item = this.data.foodOrderBatchDetailDtos.find(item => item.foodOrderBatchDetail.foodId === food.id);
      let index = this.data.foodOrderBatchDetailDtos.findIndex(item => item.foodOrderBatchDetail.foodId === food.id);
      item.foodOrderBatchDetail.foodNumber--;
      let arr_str = 'foodOrderBatchDetailDtos[' + index + ']';
      this.setData({
        [arr_str]: item
      })
    }, e => {
      console.error(e);
    })
  },
  // 查询菜品清单详情列表
  handleGetFoodOrderDetailList(foodOrderId) {
    let api = 'com.ttdtrip.api.restaurant.apis.service.FoodOrderBatchDetailListApiService';
    let data = { base: app.globalData.baseBody, batchStatus: 0, foodOrderId };
    app.request(api, data, res => {
      this.setData({
        foodOrder: res.foodOrder,
        foodOrderBatchDetailDtos: res.foodOrderBatchDetailDtos,
        foodOrderBatches: res.foodOrderBatches
      });
    })
  },
  // 用户菜品清单确认（按批次确认）
  handleFoodOrderConfirm () {
    let api = 'com.ttdtrip.api.restaurant.apis.service.FoodOrderBatchConfirmApiService';
    let data = { base: app.globalData.baseBody, foodOrderId: this.data.foodOrderId };
    app.request(api, data, res => {
      console.log(res);
      wx.redirectTo({
        url: '/pages/foodpayresult/foodpayresult',
      })
    }, e => {
      console.error(e);
    })
  }
})