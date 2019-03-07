import util from '../../utils/util.js'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sn: '',
    line: {},
    category: [],
    foodList: [],
    foodOrder: {},
    foodOrderBatchDetailDtos: [],
    foodOrderBatches: [],
    foodOrderId: '',
    batchStatus: 0,
    checkCategory: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.sn = options.sn;
    this.data.foodOrderId = options.orderId;
    this.handleLineWait();
    if (this.data.foodOrderId) {
      this.data.batchStatus = null;
      this.handleGetFoodOrderDetailList(this.data.foodOrderId);
    }
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
      this.getFoodCategoryList();
    }, e => {
      console.error(e);
    })
  },
  // 查询菜品分类
  getFoodCategoryList () {
    let api = 'com.ttdtrip.api.restaurant.apis.service.FoodCategoryListApiService';
    let data = { base: app.globalData.baseBody, page: 1, limit: 10, mid: this.data.line.mid };
    app.request(api, data, res => {
      console.log(res);
      let checkCategory = this.data.checkCategory || res.foodCategoryDtos[0].foodCategoryLang
      this.setData({
        category: res.foodCategoryDtos,
        checkCategory: checkCategory
      });
      this.getFoodList();
    }, e => {
      console.log(e);
    })
  },
  // 查询菜品列表
  getFoodList () {
    let api = 'com.ttdtrip.api.restaurant.apis.service.FoodListApiService';
    let data = { base: app.globalData.baseBody, categoryId: this.data.checkCategory.categoryId, page: 1, limit: 10, mid: this.data.line.mid };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        foodList: res.foodDtos
      })
    }, e => {
      console.error(e);
    })
  },
  // 向清单中添加菜品
  handleFoodOrderAdd (e) {
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
  handleFoodOrderDelete (e) {
    let num = e.currentTarget.dataset.num;
    if (parseInt(num) <= 0) return false;
    let food = e.currentTarget.dataset.food.food;
    let api = 'com.ttdtrip.api.restaurant.apis.service.FoodOrderBatchDetailDeleteApiService';
    let data = { base: app.globalData.baseBody, foodOrderId: this.data.foodOrderId, foodId: food.id, foodNumber: 1 };
    app.request(api, data, res => {
      console.log(res);
      let item = this.data.foodOrderBatchDetailDtos.find(item => item.foodOrderBatchDetail.foodId === food.id);
      let index = this.data.foodOrderBatchDetailDtos.findIndex(item => item.foodOrderBatchDetail.foodId === food.id);
      if (item.foodOrderBatchDetail.foodNumber > 1) {
        item.foodOrderBatchDetail.foodNumber--;
        let arr_str = 'foodOrderBatchDetailDtos['+index+']';
        this.setData({
          [arr_str]: item
        })
      } else {
        let foodOrderBatchDetailDtos = this.data.foodOrderBatchDetailDtos;
        foodOrderBatchDetailDtos.splice(index, 1);
        this.setData({
          foodOrderBatchDetailDtos
        })
      }
    }, e => {
      console.error(e);
    })
  },
  // 查询菜品清单详情列表
  handleGetFoodOrderDetailList(foodOrderId) {
    let api = 'com.ttdtrip.api.restaurant.apis.service.FoodOrderBatchDetailListApiService';
    let data = { base: app.globalData.baseBody, batchStatus: this.data.batchStatus, foodOrderId };
    app.request(api, data, res => {
      this.setData({
        foodOrder: res.foodOrder,
        foodOrderBatchDetailDtos: res.foodOrderBatchDetailDtos,
        foodOrderBatches: res.foodOrderBatches
      });
    })
  },
  // 修改分类
  bindChangeCategoryId (e) {
    let category = e.currentTarget.dataset.category;
    if (category.categoryId === this.data.checkCategory.categoryId) return false;
    this.setData({
      checkCategory: category
    });
    this.getFoodList();
  },
  // 点击去下单按钮
  handleClickGoToTheOrder () {
    if (!this.data.foodOrderId) {
      wx.showToast({
        title: '请选择菜品',
        icon: 'none'
      });
      return false;
    } else {
      let line = this.data.line;
      wx.redirectTo({
        url: '/pages/foodsure/foodsure?mid=' + line.mid + '&sn=' + line.sn + '&foodOrderId=' + this.data.foodOrderId,
      })
    }
  }
})