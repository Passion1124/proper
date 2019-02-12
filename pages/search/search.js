const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotWord: [],
    history: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let history = wx.getStorageSync('history') || [];
    console.log(history);
    if (history.length) {
      this.setData({
        history: history
      });
    }
    this.getHotWord();
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
    let history = wx.getStorageSync('history') || [];
    this.setData({
      history: history
    });
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
  // 获取热门推荐
  getHotWord () {
    let data = { base: app.globalData.baseBody, count: 10 };
    let api = 'com.ttdtrip.api.search.apis.service.HotWordQryApiService';
    app.request(api, data, (res) => {
      console.log(res);
      this.setData({
        hotWord: res.hotWords
      })
    }, (err) => {
      console.error(err);
    })
  },
  // 清除历史记录
  handleClearHistory () {
    let _that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除历史记录吗？',
      success (res) {
        if (res.confirm) {
          wx.removeStorageSync('history');
          _that.setData({
            history: []
          })
        }
      }
    })
  },
  // 跳转到搜索列表及保存搜索的历史记录
  goToTheSearchList (e) {
    let type = e.type;
    let search = type === 'tap' ? e.currentTarget.dataset.name : e.detail.value;
    if (this.data.history.indexOf(search) === -1) {
      let history = this.data.history;
      history.push(search);
      wx.setStorageSync('history', history);
    }
    wx.navigateTo({
      url: '/pages/searchList/searchList?search=' + search,
    })
  }
})