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
    this.handleFoodGroupDetail();
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
      let subFoodItems = res.groups.reduce((pre, curr) => {
        let c_arr = curr.foods.map(item => {
          let find = this.data.foods.subFoodItems.find(child => child.foodId === item.id);
          if (find) {
            if (curr.type === 1) {
              find.foodNumber = item.count;
            }
            return find;
          } else {
            let obj = { foodGroupId: curr.id, foodId: item.id, rootFoodId: curr.foodId };
            if (curr.type === 1) {
              obj.foodNumber = item.count;
            } else {
              if (item.specCount) {
                return "";
              }
              obj.foodNumber = 0;
              obj.spcItemId = [];
              obj.subFoodItems = [];
            }
            return obj;
          }
        });
        return pre.concat(c_arr);
      }, []).filter(item => item);
      this.setData({
        groups: res.groups,
        ['foods.subFoodItems']: subFoodItems
      });
    }, e => {
      console.error(e);
    })
  },
  // 菜篮子添加菜品
  handleFoodBasketAdd(consumerCount, foodItems, foodOrderId) {
    let api = 'com.ttdtrip.api.restaurant.apis.service.v2.FoodBasketAddApiService';
    let data = { base: app.globalData.baseBody, foodOrderId, consumerCount, foodItems };
    app.request(api, data, res => {
      console.log(res);
      wx.navigateBack();
    }, e => {
      console.error(e);
    })
  },
  // 菜品规格详情
  handleFoodSpcDetail (foodId, type) {
    let api = 'com.ttdtrip.api.restaurant.apis.service.v2.FoodSpcDetailApiService';
    let data = { base: app.globalData.baseBody, foodId };
    app.request(api, data, res => {
      console.log(res);
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
    let food = item.foods[e.currentTarget.dataset.index];
    if (food.specCount) {

    } else {
      let subFoodItems = this.data.foods.subFoodItems;
      let index = this.data.foods.subFoodItems.findIndex(item => item.foodId === food.id);
      subFoodItems[index].foodNumber += 1;
      this.setData({
        ['foods.subFoodItems']: subFoodItems
      });
    }
  },
  // 点击食物的减号
  handleFoodMinuButtonClick (e) {
    let item = e.currentTarget.dataset.item;
    let food = item.foods[e.currentTarget.dataset.index];
    if (food.specCount) {

    } else {
      let subFoodItems = this.data.foods.subFoodItems;
      let index = this.data.foods.subFoodItems.findIndex(item => item.foodId === food.id);
      subFoodItems[index].foodNumber -= 1;
      this.setData({
        ['foods.subFoodItems']: subFoodItems
      });
    }
  },
  // 点击确定按钮
  handleClickSureButton () {
    let page = getCurrentPages();
    let foodorder = page[page.length - 2];
    let foodItems = foodorder.data.foodItems;
    let defaultFood = this.data.groups.filter(item => item.type === 1).map(item => item.id);
    let subFoodItems = this.data.foods.subFoodItems.filter(item => item.foodNumber).map(item => {
      if (defaultFood.indexOf(item.foodGroupId) !== -1) {
        item.foodNumber = this.data.foodNum * item.foodNumber;
      };
      return item;
    });
    this.data.foods.foodNumber = this.data.foodNum;
    this.data.foods.subFoodItems = subFoodItems;
    let index = foodItems.findIndex(item => item.foodId === this.data.foods.foodId);
    if (index === -1) {
      if (this.data.foodNum) {
        foodItems.push(this.data.foods);
      }
    } else {
      foodItems[index] = this.data.foods;
    }
    this.handleFoodBasketAdd(this.data.personNum, foodItems, foodorder.data.foodOrderId);
  }
})