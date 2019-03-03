const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: '',
    winHeight: "", //窗口高度
    scHeight: "", // 滚动区域的高度
    foodScHeight: "", // 美食的滚动区域高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    mask: false,
    popup_type: '',
    tabs_type: 'vertical',
    full_day: [],
    full_day_body: {
      page: 1,
      size: 30,
      sortType: 1,
      type: 1
    },
    food: [],
    food_body: {
      page: 1,
      size: 30,
      sortType: 1,
      type: 2,
      categoryId: '',
      areaId: '',
      cityId: '',
      tradingId: ''
    },
    traffic: [],
    traffic_body: {
      page: 1,
      size: 30,
      sortType: 1,
      type: 3
    },
    lark: [],
    lark_body: {
      page: 1,
      size: 30,
      sortType: 1,
      type: 4
    },
    shopping: [],
    shopping_body: {
      page: 1,
      size: 30,
      sortType: 1,
      type: 5
    },
    areaInfos: [],
    foodCategories: [],
    preference_text: '偏好综合',
    delicacy_text: '全部美食',
    region_text: '全部区域'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: app.globalData.cityName
    })
    this.handleHeightAuto();
    this.setData({
      city: app.globalData.cityName
    });
    this.initCurrentTab(Number(options.type));
    if (this.data.currentTab === 0) {
      this.getFullDayGoodsList();
    };
    this.getAreaList();
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
  handleHeightAuto () {
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 80;
        var calc_sc = clientHeight * rpxR - 80 - 24 - 48;
        var food_sc = clientHeight * rpxR - 80 - 88; 
        that.setData({
          winHeight: calc,
          scHeight: calc_sc,
          foodScHeight: food_sc
        });
      }
    });
  },
  getFullDayGoodsList () {
    let api = 'com.ttdtrip.api.goods.apis.GoodsListApiService';
    let data = Object.assign({ base: app.globalData.baseBody }, this.data.full_day_body);
    app.request(api, data, (res) => {
      console.log(res);
      let full_day = this.data.full_day.concat(res.goodsVOs);
      this.setData({
        full_day: full_day
      })
    }, (err) => {
      console.error(err);
    })
  },
  getFoodGoodsList() {
    let api = 'com.ttdtrip.api.goods.apis.GoodsListApiService';
    let data = Object.assign({ base: app.globalData.baseBody }, this.data.food_body);
    app.request(api, data, (res) => {
      console.log(res);
      let food = this.data.food.concat(res.goodsVOs);
      this.setData({
        food: food
      })
    }, (err) => {
      console.error(err);
    })
  },
  getTrafficGoodsList() {
    let api = 'com.ttdtrip.api.goods.apis.GoodsListApiService';
    let data = Object.assign({ base: app.globalData.baseBody }, this.data.traffic_body);
    app.request(api, data, (res) => {
      console.log(res);
      let traffic = this.data.traffic.concat(res.goodsVOs);
      this.setData({
        traffic: traffic
      })
    }, (err) => {
      console.error(err);
    })
  },
  getLarkGoodsList() {
    let api = 'com.ttdtrip.api.goods.apis.GoodsListApiService';
    let data = Object.assign({ base: app.globalData.baseBody }, this.data.lark_body);
    app.request(api, data, (res) => {
      console.log(res);
      let lark = this.data.lark.concat(res.goodsVOs);
      this.setData({
        lark: lark
      })
    }, (err) => {
      console.error(err);
    })
  },
  getShoppingGoodsList() {
    let api = 'com.ttdtrip.api.goods.apis.GoodsListApiService';
    let data = Object.assign({ base: app.globalData.baseBody }, this.data.shopping_body);
    app.request(api, data, (res) => {
      console.log(res);
      let shopping = this.data.shopping.concat(res.goodsVOs);
      this.setData({
        shopping: shopping
      })
    }, (err) => {
      console.error(err);
    })
  },
  // 获取区域列表
  getAreaList () {
    let api = 'com.ttdtrip.api.config.apis.service.AreaListApiService';
    let city = wx.getStorageSync('city');
    let cityId = city ? city.cityId :'';
    let data = { base: app.globalData.baseBody, cityId };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        areaInfos: res.areaInfos
      })
    }, e => {
      console.error(e);
    })
  },
  // 获取分类列表
  getAreaList() {
    let api = 'com.ttdtrip.api.config.apis.service.CategoryQryApiService';
    let data = { base: app.globalData.baseBody };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        foodCategories: res.foodCategories
      })
    }, e => {
      console.error(e);
    })
  },
  scrolltolower (e) {
    if (this.data.currentTab === 0 && this.isInteger(this.data.full_day.length / 30)) {
      this.data.full_day_body.page++;
      this.getFullDayGoodsList();
    } else if (this.data.currentTab === 3 && this.isInteger(this.data.food.length / 30)) {
      this.data.food_body.page++;
      this.getFoodGoodsList();
    } else if (this.data.currentTab === 1 && this.isInteger(this.data.traffic.length / 30)) {
      this.data.traffic_body.page++;
      this.getTrafficGoodsList();
    } else if (this.data.currentTab === 2 && this.isInteger(this.data.lark.length / 30)) {
      this.data.lark_body.page++;
      this.getLarkGoodsList();
    } else if (this.data.currentTab === 4 && this.isInteger(this.data.shopping.length / 30)) {
      this.data.shopping_body.page++;
      this.getShoppingGoodsList();
    }
  },
  handleGetGoodsList () {
    if (this.data.currentTab === 0 && !this.data.full_day.length) {
      this.getFullDayGoodsList();
    } else if (this.data.currentTab === 3 && !this.data.food.length) {
      this.getFoodGoodsList();
    } else if (this.data.currentTab === 1 && !this.data.traffic.length) {
      this.getTrafficGoodsList();
    } else if (this.data.currentTab === 2 && !this.data.lark.length) {
      this.getLarkGoodsList();
    } else if (this.data.currentTab === 4 && !this.data.shopping.length) {
      this.getShoppingGoodsList();
    }
  },
  switchTab (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.handleGetGoodsList();
  },
  swichNav (e) {
    var cur = e.currentTarget.dataset.current;
    this.setData({
      currentTab: cur
    });
  },
  changeSortType (e) {
    let sortType = e.currentTarget.dataset.sorttype;
    if (this.data.currentTab === 0 && this.data.full_day_body.sortType !== sortType) {
      this.setData({
        ['full_day_body.sortType']: Number(sortType),
        ['full_day_body.page']: 1
      });
      this.data.full_day = [];
      this.getFullDayGoodsList();
    } else if (this.data.currentTab === 3 && this.data.food_body.sortType !== sortType) {
      let text = e.currentTarget.dataset.text;
      this.setData({
        ['food_body.sortType']: Number(sortType),
        ['food_body.page']: 1,
        mask: false,
        popup_type: '',
        preference_text: text
      });
      this.data.food = [];
      this.getFoodGoodsList();
    } else if (this.data.currentTab === 1 && this.data.traffic_body.sortType !== sortType) {
      this.setData({
        ['traffic_body.sortType']: Number(sortType),
        ['traffic_body.page']: 1
      });
      this.data.traffic = [];
      this.getTrafficGoodsList();
    } else if (this.data.currentTab === 2 && this.data.lark_body.sortType !== sortType) {
      this.setData({
        ['lark_body.sortType']: Number(sortType),
        ['lark_body.page']: 1
      });
      this.data.lark = [];
      this.getLarkGoodsList();
    } else if (this.data.currentTab === 4 && this.data.shopping_body.sortType !== sortType) {
      this.setData({
        ['shopping_body.sortType']: Number(sortType),
        ['shopping_body.page']: 1
      });
      this.data.shopping = [];
      this.getShoppingGoodsList();
    }
  },
  goToThePoiDetail(e) {
    let gid = e.currentTarget.dataset.gid;
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/poi_detail/poi_detail?gid=' + gid + '&type=' + type,
    })
  },
  isInteger (obj) {
    return obj % 1 === 0;
  },
  initCurrentTab (type) {
    let currentTab = 0;
    if (type === 2) {
      currentTab = 3;
    } else if (type === 3) {
      currentTab = 1;
    } else if (type === 4) {
      currentTab = 2
    } else if (type === 5) {
      currentTab = 4;
    };
    this.setData({
      currentTab
    })
  },
  handleChangeTabsType (e) {
    this.setData({
      tabs_type: e.currentTarget.dataset.type
    });
  },
  handleShowPopupAndMask (e) {
    let type = e.currentTarget.dataset.type;
    let mask = true;
    if (this.data.popup_type === type) {
      type = '';
      mask = false;
    }
    this.setData({
      mask: mask,
      popup_type: type
    })
  },
  handleChangeCategoryId (e) {
    let categoryid = e.currentTarget.dataset.categoryid;
    let text = e.currentTarget.dataset.text;
    this.setData({
      delicacy_text: text,
      ['food_body.categoryId']: categoryid,
      ['food_body.page']: 1,
      mask: false,
      popup_type: ''
    });
    this.data.food = [];
    this.getFoodGoodsList();
  },
  handleClickMask () {
    this.setData({
      mask: false,
      popup_type: ''
    })
  }
})