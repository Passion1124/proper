import util from '../../utils/util.js'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sn: '',
    mid: '',
    tno: '',
    line: {},
    goods: {},
    menus: [],
    menuItem: {},
    category: [],
    foodList: [],
    foodOrder: {},
    foodOrderBatchDetailDtos: [],
    foodOrderBatches: [],
    foodOrderId: '',
    batchStatus: 0,
    checkCategory: '',
    consumerCount: 0,
    numRange: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { sn, mid, tno, orderId, personNum } = options;
    if (sn) this.data.sn = sn;
    if (orderId) this.data.foodOrderId = orderId;
    if (mid) this.data.mid = mid;
    if (tno) this.data.tno = tno;
    if (personNum) this.data.consumerCount = personNum;
    if (sn) {
      this.handleLineWait();
    }
    this.getGoodsDetail();
    this.handleGetMenuDetail();
    if (mid && tno) {
      this.handleScanCodeEnter();
    }
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
        line: res.line,
        consumerCount: res.line.num
      });
      this.getFoodCategoryList();
      this.handleFoodOrderGen();
    }, e => {
      console.error(e);
    })
  },
  // 获取商品详情
  getGoodsDetail () {
    let data = { base: app.globalData.baseBody, mid: this.data.mid };
    let api = 'com.ttdtrip.api.goods.apis.GoodsDetailApiService';
    app.request(api, data, (res) => {
      console.log(res);
      this.setData({
        goods: res.goodsVO
      });
    }, (err) => {
      console.error(err);
    })
  },
  // 通过排队订单进入调用接口
  handleFoodOrderGen () {
    let api = 'com.ttdtrip.api.restaurant.apis.service.v2.FoodOrderGenApiService';
    let line = this.data.line;
    let data = { base: app.globalData.baseBody, mid: line.mid, lineSn: line.sn, lineName: line.name, lineAt: line.createAt, bookingDstDate: line.day };
    app.request(api, data, res => {
      console.log(res);
      if (res.foodBasket) {
        this.setData({
          consumerCount: res.foodBasket.consumerCount
        })
      }
    }, e => {
      console.error(e);
    })
  },
  // 通过扫码进入
  handleScanCodeEnter () {
    let api = 'com.ttdtrip.api.restaurant.apis.service.v2.FoodOrderGenApiService';
    let line = this.data.line;
    let data = { base: app.globalData.baseBody, mid: this.data.mid, tableNo: this.data.tno };
    app.request(api, data, res => {
      console.log(res);
      if (res.foodBasket || res.foodOrderBatch) {
        this.setData({
          consumerCount: res.foodBasket.consumerCount
        })
      } else {
        wx.redirectTo({
          url: '/pages/chooseFoodNumber/chooseFoodNumber?foodOrderId=' + res.foodOrderId});
      }
    }, e => {
      console.error(e);
    })
  },
  // 菜单详情
  handleGetMenuDetail () {
    let api = 'com.ttdtrip.api.restaurant.apis.service.v2.MenuDetailApiService';
    let data = { base: app.globalData.baseBody, mid: this.data.mid };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        menus: res.menus || []
      });
      if (this.data.menus.length) this.handleGetMenuItemDetail(res.menus[0].id);
    }, e => {
      console.error(e);
    })
  },
  // 菜单分类查询接口
  handleGetMenuItemDetail(menuId) {
    let api = 'com.ttdtrip.api.restaurant.apis.service.v2.MenuItemDetailApiService';
    let data = { base: app.globalData.baseBody, menuId };
    app.request(api, data, res => {
      console.log(res);
      let menuItem = this.data.menuItem;
      menuItem[menuId] = res.menuItem;
      this.setData({
        menuItem
      })
    }, e => {
      console.error(e);
    })
  },
  // 查询菜品分类
  getFoodCategoryList () {
    let api = 'com.ttdtrip.api.restaurant.apis.service.FoodCategoryListApiService';
    let data = { base: app.globalData.baseBody, page: 1, limit: 30, mid: this.data.line.mid };
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
    let data = { base: app.globalData.baseBody, categoryId: this.data.checkCategory.categoryId, page: 1, limit: 30, mid: this.data.line.mid };
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
  // 修改用餐人数
  handleChangeEatNumber (e) {
    this.setData({
      consumerCount: parseInt(e.detail.value) + 1
    })
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