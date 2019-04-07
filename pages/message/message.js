import utils from '../../utils/util.js'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMessageList();
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
  getMessageList () {
    let data = { base: app.globalData.baseBody, page: 1, size: 30 };
    let api = 'com.ttdtrip.api.account.apis.service.msg.MsgListApiService';
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        msgs: res.msgs
      })
    }, err => {
      console.error(err);
    })
  },
  getOrderDetail(orderId) {
    let api = 'com.ttdtrip.api.order.apis.service.OrderDetailApiService';
    let data = { base: app.globalData.baseBody, orderId };
    app.request(api, data, res => {
      console.log(res);
      let url = '/pages/orderDetail/orderDetail';
      if (!res.orderMerches.length) {
        url = '/pages/bookDetail/bookDetail';
      }
      utils.navigateTo(url + '?id=' + orderId);
    }, e => {
      console.error(e);
    })
  },
  goToTheDetail (e) {
    let id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title;
    let type = e.currentTarget.dataset.type;
    if (type === 'order') {
      this.getOrderDetail(id);
    } else {

    }
  }
})