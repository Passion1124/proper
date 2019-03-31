import utils from '../../utils/util.js'
import md5 from '../../utils/md5.js'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    foodId: '',
    personNum: 0,
    type: '',
    foodNum: 0,
    groups: [],
    foods: {},
    foodSpcs: [],
    prices: [],
    foodsHasData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      foodId: options.foodId,
      personNum: parseInt(options.personNum),
      type: options.type,
      foodNum: parseInt(options.foodNum)
    });
    this.handleFoodGroupDetail();
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
    const page = getCurrentPages();
    const foodorder = page[page.length - 2];
    let foods = foodorder.data.foodItems.find(item => item.foodId === this.data.foodId);
    if (foods) {
      console.log(foods);
      this.setData({
        foods,
        foodsHasData: true
      });
    } else {
      let menuId = foodorder.data.checkCategory.id;
      let menuItemId = foodorder.data.menuItem[menuId].find(item => item.foods[0].id === this.data.foodId).id;
      let obj = { foodGroupId: '', foodId: this.data.foodId, foodNumber: 0, menuId, menuItemId, rootFoodId: '', selfFoodStyle: 0, spcItemId: [], subFoodItems: [] };
      this.setData({
        foods: obj
      })
    }
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
  // 获取放题/套餐详情接口
  handleFoodGroupDetail () {
    let api = 'com.ttdtrip.api.restaurant.apis.service.v2.FoodGroupDetailApiService';
    let data = { base: app.globalData.baseBody, foodId: this.data.foodId };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        groups: res.groups
      })
    }, e => {
      console.error(e);
    })
  },
  // 点击减号按钮
  handleMinuButtonClick () {
    let foodNum = this.data.foodNum;
    if (foodNum) {
      foodNum -= 1;
      this.setData({
        foodNum
      })
    }
  },
  // 点击加号按钮
  handlePlusButtonClick () {
    let foodNum = this.data.foodNum;
    foodNum += 1;
    this.setData({
      foodNum: foodNum
    })
  },
  // 点击食物的加号
  handleFoodPlusButtonClick (e) {
    let item = e.currentTarget.dataset.item;
    console.log(item);
  },
  // 点击食物的减号
  handleFoodMinuButtonClick (e) {
    let item = e.currentTarget.dataset.item;
    console.log(item);
  }
})