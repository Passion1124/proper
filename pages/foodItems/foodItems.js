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
    foods: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      foodId: options.foodId,
      personNum: options.personNum,
      type: options.type,
      foodNum: options.foodNum
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
  }
})