const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKey: '',
    winHeight: "", //窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    all_goods: [],
    all_goods_body: {
      page: 1,
      size: 30,
      sortType: 1,
      goodsType: 0
    },
    full_day: [],
    full_day_body: {
      page: 1,
      size: 30,
      sortType: 1,
      goodsType: 1
    },
    food: [],
    food_body: {
      page: 1,
      size: 30,
      sortType: 1,
      goodsType: 2
    },
    traffic: [],
    traffic_body: {
      page: 1,
      size: 30,
      sortType: 1,
      goodsType: 3
    },
    lark: [],
    lark_body: {
      page: 1,
      size: 30,
      sortType: 1,
      goodsType: 4
    },
    shopping: [],
    shopping_body: {
      page: 1,
      size: 30,
      sortType: 1,
      goodsType: 5
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.searchKey = options.search;
    wx.setNavigationBarTitle({
      title: options.search,
    });
    this.handleHeightAuto();
    this.getAllGoodsList();
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
  handleHeightAuto() {
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 80;
        that.setData({
          winHeight: calc
        });
      }
    });
  },
  getAllGoodsList () {
    let api = 'com.ttdtrip.api.search.apis.service.ResSearchApiService';
    let data = Object.assign({base: app.globalData.baseBody, searchKey: this.data.searchKey}, this.data.all_goods_body);
    app.request(api, data, (res) => {
      console.log(res);
      let all_goods = this.data.all_goods.concat(res.results);
      this.setData({
        all_goods: all_goods
      })
    }, (err) => {
      console.error(err);
    })
  },
  getFullDayGoodsList() {
    let api = 'com.ttdtrip.api.search.apis.service.ResSearchApiService';
    let data = Object.assign({ base: app.globalData.baseBody, searchKey: this.data.searchKey }, this.data.full_day_body);
    app.request(api, data, (res) => {
      console.log(res);
      let full_day = this.data.full_day.concat(res.results);
      this.setData({
        full_day: full_day
      })
    }, (err) => {
      console.error(err);
    })
  },
  getFoodGoodsList() {
    let api = 'com.ttdtrip.api.search.apis.service.ResSearchApiService';
    let data = Object.assign({ base: app.globalData.baseBody, searchKey: this.data.searchKey }, this.data.food_body);
    app.request(api, data, (res) => {
      console.log(res);
      let food = this.data.food.concat(res.results);
      this.setData({
        food: food
      })
    }, (err) => {
      console.error(err);
    })
  },
  getTrafficGoodsList() {
    let api = 'com.ttdtrip.api.search.apis.service.ResSearchApiService';
    let data = Object.assign({ base: app.globalData.baseBody, searchKey: this.data.searchKey }, this.data.traffic_body);
    app.request(api, data, (res) => {
      console.log(res);
      let traffic = this.data.traffic.concat(res.results);
      this.setData({
        traffic: traffic
      })
    }, (err) => {
      console.error(err);
    })
  },
  getLarkGoodsList() {
    let api = 'com.ttdtrip.api.search.apis.service.ResSearchApiService';
    let data = Object.assign({ base: app.globalData.baseBody, searchKey: this.data.searchKey }, this.data.lark_body);
    app.request(api, data, (res) => {
      console.log(res);
      let lark = this.data.lark.concat(res.results);
      this.setData({
        lark: lark
      })
    }, (err) => {
      console.error(err);
    })
  },
  getShoppingGoodsList() {
    let api = 'com.ttdtrip.api.search.apis.service.ResSearchApiService';
    let data = Object.assign({ base: app.globalData.baseBody, searchKey: this.data.searchKey }, this.data.shopping_body);
    app.request(api, data, (res) => {
      console.log(res);
      let shopping = this.data.shopping.concat(res.results);
      this.setData({
        shopping: shopping
      })
    }, (err) => {
      console.error(err);
    })
  },
  scrolltolower(e) {
    if (this.data.currentTab === 0 && this.isInteger(this.data.all_goods.length / 30)) {
      this.all_goods_body.page++;
      this.getAllGoodsList();
    } else if (this.data.currentTab === 1 && this.isInteger(this.data.full_day.length / 30)) {
      this.full_day_body.page++;
      this.getFullDayGoodsList();
    } else if (this.data.currentTab === 2 && this.isInteger(this.data.food.length / 30)) {
      this.food_body.page++;
      this.getFoodGoodsList();
    } else if (this.data.currentTab === 3 && this.isInteger(this.data.traffic.length / 30)) {
      this.traffic_body.page++;
      this.getTrafficGoodsList();
    } else if (this.data.currentTab === 4 && this.isInteger(this.data.lark.length / 30)) {
      this.lark_body.page++;
      this.getLarkGoodsList();
    } else if (this.data.currentTab === 5 && this.isInteger(this.data.shopping.length / 30)) {
      this.shopping_body.page++;
      this.getShoppingGoodsList();
    }
  },
  handleGetGoodsList() {
    if (this.data.currentTab === 0 && !this.data.all_goods.length) {
      this.getAllGoodsList();
    } else if (this.data.currentTab === 1 && !this.data.full_day.length) {
      this.getFullDayGoodsList();
    } else if (this.data.currentTab === 2 && !this.data.food.length) {
      this.getFoodGoodsList();
    } else if (this.data.currentTab === 3 && !this.data.traffic.length) {
      this.getTrafficGoodsList();
    } else if (this.data.currentTab === 4 && !this.data.lark.length) {
      this.getLarkGoodsList();
    } else if (this.data.currentTab === 5 && !this.data.shopping.length) {
      this.getShoppingGoodsList();
    }
  },
  switchTab(e) {
    console.log(e);
    this.setData({
      currentTab: e.detail.current
    });
    this.handleGetGoodsList();
  },
  swichNav(e) {
    var cur = e.currentTarget.dataset.current;
    this.setData({
      currentTab: cur
    });
  },
  changeSortType(e) {
    let sortType = e.currentTarget.dataset.sorttype;
    if (this.data.currentTab === 0 && this.data.all_goods_body.sortType !== sortType) {
      this.setData({
        ['all_goods_body.sortType']: Number(sortType),
        ['all_goods_body.page']: 1
      });
      this.data.all_goods = [];
      this.getAllGoodsList();
    } else if (this.data.currentTab === 1 && this.data.full_day_body.sortType !== sortType) {
      this.setData({
        ['full_day_body.sortType']: Number(sortType),
        ['full_day_body.page']: 1
      });
      this.data.full_day = [];
      this.getFullDayGoodsList();
    } else if (this.data.currentTab === 2 && this.data.food_body.sortType !== sortType) {
      this.setData({
        ['food_body.sortType']: Number(sortType),
        ['food_body.page']: 1
      });
      this.data.food = [];
      this.getFoodGoodsList();
    } else if (this.data.currentTab === 3 && this.data.traffic_body.sortType !== sortType) {
      this.setData({
        ['food_body.sortType']: Number(sortType),
        ['food_body.page']: 1
      });
      this.data.food = [];
      this.getFoodGoodsList();
    } else if (this.data.currentTab === 4 && this.data.lark_body.sortType !== sortType) {
      this.setData({
        ['lark_body.sortType']: Number(sortType),
        ['lark_body.page']: 1
      });
      this.data.lark = [];
      this.getLarkGoodsList();
    } else if (this.data.currentTab === 5 && this.data.shopping_body.sortType !== sortType) {
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
  isInteger(obj) {
    return obj % 1 === 0;
  }
})