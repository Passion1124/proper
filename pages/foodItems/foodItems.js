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
    foodsHasData: false,
    specifications: {},
    newFoods: {},
    selectFood: {},
    deleteFoodItems: [],
    spcMd5: '',
    black_mask: false,
    maskStatus: 'hide',
    popup: false,
    popupType: '',
    popupStatus: 'hide'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
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
      let obj = {
        foodGroupId: '',
        foodId: this.data.foodId,
        foodNumber: 0,
        menuId,
        menuItemId,
        rootFoodId: '',
        selfFoodStyle: 0,
        spcItemId: [],
        subFoodItems: []
      };
      this.setData({
        foods: obj
      })
    }
    this.handleFoodGroupDetail();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 获取放题/套餐详情接口
  handleFoodGroupDetail() {
    let api = 'com.ttdtrip.api.restaurant.apis.service.v2.FoodGroupDetailApiService';
    let data = {
      base: app.globalData.baseBody,
      foodId: this.data.foodId
    };
    app.request(api, data, res => {
      console.log(res);
      let subFoodItems = this.data.foods.subFoodItems;
      if (!this.data.foods.subFoodItems.length) {
        subFoodItems = res.groups.reduce((pre, curr) => {
          let c_arr = curr.foods.map(item => {
            let find = this.data.foods.subFoodItems.find(child => child.foodId === item.id);
            if (find) {
              if (curr.type === 1) {
                find.foodNumber = item.count;
              }
              return find;
            } else {
              let obj = {
                foodGroupId: curr.id,
                foodId: item.id,
                rootFoodId: curr.foodId,
                selfFoodStyle: 0
              };
              if (curr.type === 1) {
                obj.foodNumber = item.count;
              } else {
                if (item.specCount) {
                  return "";
                }
                obj.foodNumber = 0;
                obj.spcItemId = [];
              }
              return obj;
            }
          });
          return pre.concat(c_arr);
        }, []).filter(item => item);
      }
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
    let data = {
      base: app.globalData.baseBody,
      foodOrderId,
      consumerCount,
      foodItems
    };
    app.request(api, data, res => {
      console.log(res);
      wx.navigateBack();
    }, e => {
      console.error(e);
    })
  },
  // 菜品规格详情
  handleFoodSpcDetail(foodId, type) {
    let api = 'com.ttdtrip.api.restaurant.apis.service.v2.FoodSpcDetailApiService';
    let data = {
      base: app.globalData.baseBody,
      foodId
    };
    app.request(api, data, res => {
      console.log(res);
      let obj = { foodSpcs: res.foodSpcs, prices: res.prices };
      this.setData({
        ['specifications.' + foodId]: obj
      });
      this.handleShowMaskAndPopup(type);
    }, e => {
      console.error(e);
    })
  },
  // 点击减号按钮
  handleMinuButtonClick() {
    let foodNum = this.data.foodNum;
    if (foodNum) {
      foodNum -= 1;
      this.setData({
        foodNum
      })
    }
  },
  // 点击加号按钮
  handlePlusButtonClick() {
    let foodNum = this.data.foodNum;
    foodNum += 1;
    this.setData({
      foodNum: foodNum
    })
  },
  // 点击食物的加号
  handleFoodPlusButtonClick(e) {
    let item = e.currentTarget.dataset.item;
    let food = item.foods[e.currentTarget.dataset.index];
    if (food.specCount) {
      let newFoods = {
        foodGroupId: item.id,
        foodId: food.id,
        foodNumber: 1,
        rootFoodId: item.foodId,
        selfFoodStyle: 0,
        spcItemId: []
      };
      this.setData({
        newFoods,
        selectFood: food
      })
      if (this.data.specifications[food.id]) {
        this.handleShowMaskAndPopup('spec_add');
      } else {
        this.handleFoodSpcDetail(food.id, 'spec_add');
      }
    } else {
      let subFoodItems = this.data.foods.subFoodItems;
      let index = this.data.foods.subFoodItems.findIndex(item => item.foodId === food.id);
      // console.log(subFoodItems[index]);
      subFoodItems[index].foodNumber += 1;
      this.setData({
        ['foods.subFoodItems']: subFoodItems
      });
    }
  },
  // 点击食物的减号
  handleFoodMinuButtonClick(e) {
    let item = e.currentTarget.dataset.item;
    let food = item.foods[e.currentTarget.dataset.index];
    if (food.specCount) {
      this.setData({
        selectFood: food,
        deleteFoodItems: this.data.foods.subFoodItems.filter(item => item.foodId === food.id)
      })
      if (this.data.specifications[food.id]) {
        this.handleShowMaskAndPopup('spec_delete');
      } else {
        this.handleFoodSpcDetail(food.id, 'spec_delete');
      }
    } else {
      let subFoodItems = this.data.foods.subFoodItems;
      let index = this.data.foods.subFoodItems.findIndex(item => item.foodId === food.id);
      subFoodItems[index].foodNumber -= 1;
      this.setData({
        ['foods.subFoodItems']: subFoodItems
      });
    }
  },
  // 修改规格参数
  handleSpecificationsDataChange(e) {
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    let spcItemId = this.data.newFoods.spcItemId;
    spcItemId[index] = id;
    this.setData({
      ['newFoods.spcItemId']: spcItemId
    });
    if (spcItemId.filter(item => item).length === this.data.specifications[this.data.selectFood.id].foodSpcs.length) {
      let spcMd5 = md5(spcItemId.reverse().join(''));
      this.setData({
        spcMd5
      })
    }
  },
  // 点击添加按钮
  handleAddFoodButton() {
    if (this.data.newFoods.spcItemId.filter(item => item).length === this.data.specifications[this.data.selectFood.id].foodSpcs.length) {
      let subFoodItems = this.data.foods.subFoodItems;
      let index = subFoodItems.findIndex(item => {
        let arr = [].concat(this.data.newFoods.spcItemId);
        return item.foodId === this.data.selectFood.id && item.spcItemId.toString() === arr.reverse().toString();
      });
      if (index !== -1) {
        subFoodItems[index].foodNumber += 1;
      } else {
        this.data.newFoods.spcItemId = utils.reverseArray(this.data.newFoods.spcItemId);
        subFoodItems.push(this.data.newFoods);
      }
      this.setData({
        ['foods.subFoodItems']: subFoodItems
      });
      this.handleHideMaskAndPopup()
    } else {
      utils.showMessage('请选择完整规格');
    }
  },
  // 点击弹窗的减号按钮
  handleClickPopupMinusButton(e) {
    console.log(e);
    let num = e.currentTarget.dataset.num;
    let index = e.currentTarget.dataset.index;
    let subFoodItems = this.data.foods.subFoodItems;
    if (num <= 1) {
      subFoodItems.splice(index, 1);
    } else {
      subFoodItems[index].foodNumber = num - 1;
    };
    this.setData({
      ['foods.subFoodItems']: subFoodItems
    });
    if (!subFoodItems.filter(item => item.foodId === this.data.selectFood.id).length) {
      this.handleHideMaskAndPopup();
    }
  },
  // 点击弹窗的加号按钮
  handleClickPopupPlusButton(e) {
    console.log(e);
    let num = e.currentTarget.dataset.num;
    let index = e.currentTarget.dataset.index;
    let subFoodItems = this.data.foods.subFoodItems;
    subFoodItems[index].foodNumber = num + 1;
    this.setData({
      ['foods.subFoodItems']: subFoodItems
    });
  },
  // 点击确定按钮
  handleClickSureButton() {
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
    if (this.data.foodNum) {
      if (index === -1) {
        foodItems.push(this.data.foods);
      } else {
        foodItems[index] = this.data.foods;
      }
    } else {
      if (index !== -1) {
        foodItems.splice(index, 1);
      } else {
        wx.navigateBack();
        return false;
      }
    }
    this.handleFoodBasketAdd(this.data.personNum, foodItems, foodorder.data.foodOrderId);
  },
  // 显示弹窗
  handleShowMaskAndPopup(type) {
    this.setData({
      black_mask: true,
      popup: true
    });
    setTimeout(_ => {
      this.setData({
        popupType: type,
        maskStatus: 'show',
        popupStatus: 'show'
      })
    }, 100)
  },
  // 隐藏弹窗
  handleHideMaskAndPopup() {
    this.setData({
      maskStatus: 'hide',
      popupStatus: 'hide',
    });
    setTimeout(_ => {
      this.setData({
        black_mask: false,
        popup: false,
        popupType: '',
      })
    }, 300)
  }
})