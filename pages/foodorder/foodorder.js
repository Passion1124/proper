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
    checkCategory: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sn: options.sn,
    });
    this.handleLineWait();
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
  }
})