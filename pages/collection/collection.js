import utils from '../../utils/util.js'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    pagination: {
      page: 1,
      size: 10
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFavorListApiService();
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
    this.data.pagination.page = 1;
    this.getFavorListApiService();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if ((this.data.goods.length / this.data.pagination.size) % 1 === 0) {
      this.data.pagination.page++;
      this.getFavorListApiService();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  getFavorListApiService () {
    let api = 'com.ttdtrip.api.goods.apis.FavorListApiService';
    let data = Object.assign({ base: app.globalData.baseBody }, this.data.pagination);
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        goods: res.goodsVOS.map(item => {
          item.favor = true;
          return item;
        })
      });
      wx.stopPullDownRefresh();
    }, err => {
      console.error(err);
      wx.stopPullDownRefresh();
    })
  },
  handleGoodsFavorApiService (e) {
    let gid = e.currentTarget.dataset.gid;
    let index = e.currentTarget.dataset.index;
    let api = 'com.ttdtrip.api.goods.apis.FavorApiService';
    let data = { base: app.globalData.baseBody, gid: gid };
    app.request(api, data, (res) => {
      wx.showToast({
        title: '收藏成功',
        icon: 'none'
      });
      let favor = 'goods['+ index +'].favor';
      this.setData({
        [favor]: true
      })
    }, (err) => {
      console.error(err);
    })
  },
  handleGoodsUnFavorApiService (e) {
    let gid = e.currentTarget.dataset.gid;
    let index = e.currentTarget.dataset.index;
    let api = 'com.ttdtrip.api.goods.apis.UnFavorApiService';
    let data = { base: app.globalData.baseBody, gid: gid };
    app.request(api, data, (res) => {
      wx.showToast({
        title: '已取消收藏',
        icon: 'none'
      });
      let favor = 'goods[' + index + '].favor';
      this.setData({
        [favor]: false
      });
    }, (err) => {
      console.error(err);
    })
  },
  goToTheDetail (e) {
    let item = e.currentTarget.dataset.item;
    let url = '';
    let type = item.goodsBase.type;
    let gid = item.goodsInfo.gid;
    if (type === '2') {
      url = '/pages/fooddetail/fooddetail?gid=' + gid + '&type=' + type;
    } else {
      url = '/pages/poi_detail/poi_detail?gid=' + gid + '&type' + type;
    }
    utils.navigateTo(url);
  }
})