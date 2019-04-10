import util from '../../utils/util.js'
import md5 from '../../utils/md5.js'

var WxParse = require('../../wxParse/wxParse.js');

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sn: '',
    mid: '',
    tableNo: '',
    tno: '',
    toPage: '',
    line: {},
    goods: {},
    menus: [],
    foodItems: [],
    orderItems: [],
    foodCartList: {},
    foodOrderBatch: {},
    category: [],
    foodList: [],
    foodOrder: {},
    foodOrderBatchDetailDtos: [],
    foodOrderBatches: [],
    foodOrderId: '',
    batchStatus: 0,
    checkCategory: '',
    consumerCount: 0,
    numRange: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    winHeight: '',
    specifications: {},
    newFoods: {},
    selectFood: {},
    deleteFoodItems: [],
    selfHelp: [],
    spcMd5: '',
    black_mask: false,
    maskStatus: 'hide',
    popup: false,
    popupType: '',
    popupStatus: 'hide',
    orderStatus: '',
    orderWarningTipsText: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { sn, mid, tno, orderId, personNum, toPage } = options;
    if (sn) this.data.sn = sn;
    if (orderId) this.data.foodOrderId = orderId;
    if (mid) this.data.mid = mid;
    if (tno) this.data.tno = tno;
    let s_data = {};
    if (toPage) s_data.toPage = toPage;
    if (tno) {
      s_data.tableNo = tno;
    }
    this.setData(s_data);
    if (personNum) this.data.consumerCount = personNum;
    this.getGoodsDetail();
    // this.handleGetMenuDetail();
    this.handleGetFoodMenu();
    let that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 120;
        that.setData({
          winHeight: calc
        });
      }
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
    this.handleGetFoodOrderDetail();
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
  // 获取订单详情
  handleGetFoodOrderDetail () {
    if (this.data.sn) {
      this.handleLineWait();
    }
    if (this.data.mid && this.data.tno) {
      this.handleScanCodeEnter();
    }
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
      this.handleFoodOrderGenSuccessCallback(res);
    }, e => {
      console.error(e);
      if (e.ret_code === '3102' || e.ret_code === '3101') {
        this.setData({
          orderStatus: e.ret_code,
          orderWarningTipsText: e.ret_msg
        })
      }
    })
  },
  // 通过扫码进入
  handleScanCodeEnter () {
    let api = 'com.ttdtrip.api.restaurant.apis.service.v2.FoodOrderGenApiService';
    let line = this.data.line;
    let data = { base: app.globalData.baseBody, mid: this.data.mid, tableNo: this.data.tno };
    app.request(api, data, res => {
      console.log(res);
      this.handleFoodOrderGenSuccessCallback(res);
    }, e => {
      console.error(e);
      if (e.ret_code === '3102' || e.ret_code === '3101') {
        this.setData({
          orderStatus: e.ret_code,
          orderWarningTipsText: e.ret_msg
        })
      }
    })
  },
  // 菜单详情接口（全菜品）
  handleGetFoodMenu () {
    let api = 'com.ttdtrip.api.restaurant.apis.service.v2.FoodMenuApiService';
    let data = { base: app.globalData.baseBody, mid: this.data.mid };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        menus: res.menus,
        checkCategory: res.menus[0],
        selfHelp: res.menus.map(item => item.items).reduce((c, n) => c.concat(n), []).map(item => item.foods[0]).filter(item => item).filter(item => item.type === 2 && item.userNumType !== 1)
      });
      console.log(this.data.selfHelp);
    }, e => {
      console.error(e);
    })
  },
  // 菜篮子添加菜品
  handleFoodBasketAdd(consumerCount, foodItems, type) {
    let api = 'com.ttdtrip.api.restaurant.apis.service.v2.FoodBasketAddApiService';
    let data = { base: app.globalData.baseBody, foodOrderId: this.data.foodOrderId, consumerCount, foodItems };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        consumerCount: res.consumerCount,
        foodItems: res.foodItems
      });
      this.handleGetFoodOrderDetail();
      if (type === 'popup_add') {
        this.handleHideMaskAndPopup();
      }
      if (type === 'popup_delete_num' && !this.data.foodItems.filter(item => item.foodId === this.data.selectFood.id).length) {
        this.handleHideMaskAndPopup();
      }
    }, e => {
      console.error(e);
    })
  },
  // 菜品规格详情
  handleFoodSpcDetail(foodId, type) {
    let api = 'com.ttdtrip.api.restaurant.apis.service.v2.FoodSpcDetailApiService';
    let data = { base: app.globalData.baseBody, foodId };
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
  // 查询或生成点菜订单之后的成功回调
  handleFoodOrderGenSuccessCallback (res) {
    let s_data = { foodOrderId: res.foodOrderId };
    if (res.foodBasket || this.data.toPage) {
      let foodCartList = {};
      if (res.foodBasket) {
        foodCartList.mustPoint = res.foodBasket.orderItems.filter(item => item.type === 9);
        foodCartList.putQuestions = res.foodBasket.orderItems.filter(item => item.type === 2);
        foodCartList.setMeal = res.foodBasket.orderItems.filter(item => item.type === 3);
        foodCartList.ordinary = res.foodBasket.orderItems.filter(item => item.type === 1);
      }
      s_data.foodCartList = foodCartList;
      s_data.consumerCount = res.foodBasket ? res.foodBasket.consumerCount : 0;
      s_data.foodItems = res.foodBasket ? res.foodBasket.foodItems : [];
      s_data.orderItems = res.foodBasket ? res.foodBasket.orderItems : [];
      s_data.foodOrderBatch = res.foodOrderBatch || {};
    } else if (res.foodOrderBatch) {
      util.redirectTo('/pages/foodadd/foodadd?orderId=' + res.foodOrderId);
    } else if (!this.data.consumerCount) {
      wx.redirectTo({
        url: '/pages/chooseFoodNumber/chooseFoodNumber?foodOrderId=' + res.foodOrderId
      });
    }
    this.setData(s_data);
  },
  // 修改分类
  bindChangeCategoryId (e) {
    let category = e.currentTarget.dataset.category;
    if (category.id === this.data.checkCategory.id) return false;
    this.setData({
      checkCategory: category
    });
    this.mandatoryTipsShow();
  },
  // 修改用餐人数
  handleChangeEatNumber (e) {
    if ((this.data.toPage || this.data.foodOrderBatch.consumerCount) && this.data.foodOrderBatch.consumerCount > parseInt(e.detail.value) + 1) {
      util.showMessage('加菜时，只能添加用餐人数');
      return false;
    }
    this.setData({
      consumerCount: parseInt(e.detail.value) + 1 - (this.data.foodOrderBatch.consumerCount || 0)
    });
    if (this.data.consumerCount) this.handleFoodBasketAdd(this.data.consumerCount, this.data.foodItems);
  },
  // 点击去下单按钮
  handleClickGoToTheOrder () {
    if (!this.data.foodItems.length) {
      util.showMessage('你还未添加菜品哦');
      return false;
    }
    if (this.mandatoryFoodSelectAll()) {
      if (!this.getSelfHelpTipsShow(this.data.selfHelp, this.data.foodItems, this.data.consumerCount)) {
        console.log('可以去下单了');
        util.navigateTo('/pages/foodorderconfirm/foodorderconfirm?foodOrderId=' + this.data.foodOrderId + '&mid=' + this.data.mid + '&consumerCount=' + this.data.consumerCount + '&tno=' + this.data.tno);
      } else {
        console.log('放题数量不对');
      }
    }
  },
  // 点击加号按钮
  handleClickPlusButton (e) {
    let item = e.currentTarget.dataset.item;
    let foods = e.currentTarget.dataset.foods;
    if (foods.type === 1) {
      if (foods.specCount) {
        let newFoods = { foodGroupId: '', foodId: foods.id, foodNumber: 1, menuId: this.data.checkCategory.id, menuItemId: item.id, rootFoodId: '', selfFoodStyle: 0, spcItemId: [], subFoodItems: [] };
        this.setData({
          newFoods,
          selectFood: foods
        })
        if (this.data.specifications[foods.id]) {
          this.handleShowMaskAndPopup('spec_add');
        } else {
          this.handleFoodSpcDetail(foods.id, 'spec_add');
        }
      } else {
        let foodItems = this.data.foodItems;
        let index = foodItems.findIndex(item => item.foodId === foods.id);
        if (index !== -1) {
          foodItems[index].foodNumber += 1;
          this.handleFoodBasketAdd(this.data.consumerCount, foodItems, 'food_plus');
        } else {
          let obj = { foodGroupId: "", foodId: foods.id, foodNumber: 1, menuItemId: item.id, menuId: this.data.checkCategory.id, rootFoodId: '', selfFoodStyle: 0, spcItemId: [], subFoodItems: [] };
          foodItems.push(obj);
          this.handleFoodBasketAdd(this.data.consumerCount, foodItems, 'food_plus');
        }
      }
    } else {
      this.handleGoToTheFoodDetailPage(e); 
    }
  },
  // 点击减号按钮
  handleClickMinusButton (e) {
    let item = e.currentTarget.dataset.item;
    let foods = e.currentTarget.dataset.foods;
    let num = e.currentTarget.dataset.num;
    let foodItems = this.data.foodItems;
    let index = foodItems.findIndex(item => item.foodId === foods.id);
    if (num === 1) {
      foodItems.splice(index, 1);
      this.handleFoodBasketAdd(this.data.consumerCount, foodItems, 'food_minus');
    } else {
      if (foods.specCount) {
        this.setData({
          selectFood: foods,
          deleteFoodItems: this.data.foodItems.filter(item => item.foodId === foods.id)
        })
        if (this.data.specifications[foods.id]) {
          this.handleShowMaskAndPopup('spec_delete');
        } else {
          this.handleFoodSpcDetail(foods.id, 'spec_delete');
        }
      } else {
        foodItems[index].foodNumber -= 1;
        this.handleFoodBasketAdd(this.data.consumerCount, foodItems, 'food_minus');
      }
    }
  },
  // 修改规格参数
  handleSpecificationsDataChange (e) {
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    let spcItemId = this.data.newFoods.spcItemId;
    spcItemId[index] = id;
    this.setData({
      ['newFoods.spcItemId']: spcItemId
    });
    if (spcItemId.filter(item => item).length === this.data.specifications[this.data.selectFood.id].foodSpcs.length) {
      let spcMd5 = md5(spcItemId.sort().join(''));
      this.setData({
        spcMd5
      })
    }
  },
  // 点击添加按钮
  handleAddFoodButton () {
    if (this.data.newFoods.spcItemId.filter(item => item).length === this.data.specifications[this.data.selectFood.id].foodSpcs.length) {
      let foodItems = this.data.foodItems;
      let index = foodItems.findIndex(item => {
        let arr = [].concat(this.data.newFoods.spcItemId);
        return item.foodId === this.data.selectFood.id && item.spcItemId.toString() === arr.reverse().toString();
      });
      if (index !== -1) {
        foodItems[index].foodNumber += 1;
        this.handleFoodBasketAdd(this.data.consumerCount, foodItems, 'popup_add');
      } else {
        this.data.newFoods.spcItemId = util.reverseArray(this.data.newFoods.spcItemId);
        foodItems.push(this.data.newFoods);
        this.handleFoodBasketAdd(this.data.consumerCount, foodItems, 'popup_add');
      }
    } else {
      util.showMessage('请选择完整规格');
    }
  },
  // 点击弹窗的减号按钮
  handleClickPopupMinusButton (e) {
    console.log(e);
    let num = e.currentTarget.dataset.num;
    let index = e.currentTarget.dataset.index;
    let foodItems = this.data.foodItems;
    if (num <= 1) {
      foodItems.splice(index, 1);
    } else {
      foodItems[index].foodNumber = num - 1;
    };
    this.handleFoodBasketAdd(this.data.consumerCount, foodItems, 'popup_delete_num');
  },
  // 点击弹窗的加号按钮
  handleClickPopupPlusButton (e) {
    console.log(e);
    let num = e.currentTarget.dataset.num;
    let index = e.currentTarget.dataset.index;
    let foodItems = this.data.foodItems;
    foodItems[index].foodNumber = num + 1;
    this.handleFoodBasketAdd(this.data.consumerCount, foodItems, 'popup_add_num');
  },
  // 点击购物车里面的减号按钮
  handleClickFoodCartMinusButton (e) {
    console.log(e);
    let food = e.currentTarget.dataset.food;
    let num = e.currentTarget.dataset.num;
    if (food.type === 2 || food.type === 3) {
      util.navigateTo('/pages/foodItems/foodItems?foodId=' + food.foodId + '&personNum=' + this.data.consumerCount + '&type=' + food.type + '&foodNum=' + food.foodNumber);
    } else {
      let index = this.data.foodItems.findIndex(item => {
        if (food.spcItems.length) {
          return food.spcItems.map(sp => sp.id).toString() === item.spcItemId.toString();
        } else {
          return item.foodId === food.foodId;
        }
      });
      if (num <= 1) {
        this.data.foodItems.splice(index, 1);
      } else {
        this.data.foodItems[index].foodNumber = num - 1;
      };
      this.handleFoodBasketAdd(this.data.consumerCount, this.data.foodItems);
    }
  },
  // 点击购物车里面的加号按钮
  handleClickFoodCartPlusButton (e) {
    let food = e.currentTarget.dataset.food;
    if (food.type === 2 || food.type === 3) {
      util.navigateTo('/pages/foodItems/foodItems?foodId=' + food.foodId + '&personNum=' + this.data.consumerCount + '&type=' + food.type + '&foodNum=' + food.foodNumber);
    } else {
      let index = this.data.foodItems.findIndex(item => {
        if (food.spcItems.length) {
          return food.spcItems.map(sp => sp.id).toString() === item.spcItemId.toString();
        } else {
          return item.foodId === food.foodId;
        }
      });
      this.data.foodItems[index].foodNumber += 1;
      this.handleFoodBasketAdd(this.data.consumerCount, this.data.foodItems);
    }
  },
  // 点击菜品封面
  handleClickFoodPoster (e) {
    let food = e.currentTarget.dataset.food;
    this.setData({
      selectFood: food
    });
    WxParse.wxParse('article', 'html', food.info, this, 5);
    this.handleShowMaskAndPopup('goods_info');
  },
  // 点击选择必点菜提示
  handleSwitchMandatoryFood () {
    let find = this.data.menus.find(item => item.type === 1);
    this.setData({
      checkCategory: find
    });
  },
  // 点击菜品数量
  handleClickFoodTotalNum (e) {
    this.handleShowMaskAndPopup('shopping_cart');
  },
  // 显示弹窗
  handleShowMaskAndPopup (type) {
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
  handleHideMaskAndPopup () {
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
  },
  // 去套餐页面或者放题页面
  handleGoToTheFoodDetailPage (e) {
    let item = e.currentTarget.dataset.item;
    let foods = e.currentTarget.dataset.foods;
    if (foods.type !== 1) {
      let selecTable = this.getNowFoodSelectable(foods.limitType, foods.limitTimeStart, foods.limitTimeEnd);
      if (selecTable) {
        let food = this.data.foodItems.find(food => food.foodId === foods.id);
        let foodNum = food ? food.foodNumber : 0;
        if (!foodNum && foods.type === 3) foodNum = 1;
        util.navigateTo('/pages/foodItems/foodItems?foodId=' + foods.id + '&personNum=' + this.data.consumerCount + '&type=' + foods.type + '&foodNum=' + foodNum + '&userNumType=' + foods.userNumType);
      }
    }
  },
  // 去商家详情页
  handleGoToTheGoodsDetailPage (e) {
    let gid = e.currentTarget.dataset.gid;
    util.navigateTo('/pages/fooddetail/fooddetail?gid=' + gid + '&type=2&form=foodorder');
  },
  // 必点菜是否全部选择
  mandatoryFoodSelectAll () {
    if (this.data.toPage) { return true; };
    let mandatoryArray = this.data.menus.filter(item => item.type === 1);
    var mandatoryItems = mandatoryArray.map(item => item.items).reduce((c, n) => c.concat(n), []);
    var every = mandatoryItems.every(this.getMandatoryFoodNumberSatisfyEvery);
    if (every) {
      return true;
    } else {
      util.showMessage('必点菜菜品选择不全');
      return false;
    }
  },
  // 选择必点菜弹窗提示是否展示
  mandatoryTipsShow () {
    if (this.data.toPage) return false;
    let nowMenu = this.data.checkCategory;
    let mandatoryArray = this.data.menus.filter(item => item.type === 1);
    var mandatoryId = mandatoryArray.length ? mandatoryArray.map(item => item.id) : '';
    if (mandatoryId.indexOf(nowMenu.id) === -1) {
      var mandatoryItems = mandatoryArray.map(item => item.items).reduce((c, n) => c.concat(n), []);
      var every = mandatoryItems.every(this.getMandatoryFoodNumberSatisfyEvery);
      if (every) {
        console.log('buzhanshi');
      } else {
        console.log('zhanshi');
      }
    } else {
      console.log('buzhanshi');
    }
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
        util.showMessage('当前菜品不在可点时段');
        return false;
      }
    }
  },
  // 判断放题提示是否展示
  getSelfHelpTipsShow (self, foodItems, pNum) {
    if (self.length) {
      var sId = self.map(function (item) {
        return item.id;
      });
      var num = foodItems.filter(function (item) {
        return sId.indexOf(item.foodId) !== -1;
      }).reduce(function (cur, next) {
        return cur + next.foodNumber;
      }, 0);
      if (num) {
        if (num >= pNum) {
          return false;
        } else {
          util.showMessage('全部放题至少选'+ pNum +'份，已选'+ num +'份');
          return true;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
  // 判断必点菜是否满足条件
  getMandatoryFoodNumberSatisfyEvery (val) {
    var limit = val.limit;
    var foodNumber = this.data.foodItems.filter(item => item.menuItemId === val.id).reduce((curr, next) => curr + next.foodNumber, 0);
    if (!limit && foodNumber) {
      return true;
    } else if (limit && foodNumber >= limit) {
      return true;
    } else {
      return false;
    }
  }
})