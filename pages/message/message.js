import utils from '../../utils/util.js'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgs: [],
    page: 1,
    size: 10
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
    if (this.data.msgs.length % this.data.size === 0) {
      this.data.page++;
      this.getMessageList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  getMessageList () {
    let data = { base: app.globalData.baseBody, page: this.data.page, size: this.data.size };
    let api = 'com.ttdtrip.api.account.apis.service.msg.MsgListApiService';
    app.request(api, data, res => {
      console.log(res);
      let msgs = this.data.page === 1 ? [] : this.data.msgs;
      this.setData({
        msgs: msgs.concat(res.msgs)
      });
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
      if (res.order.preOrder && res.order.preOrder.timeEnd) {
        url = '/pages/bookDetail/bookDetail';
      }
      utils.navigateTo(url + '?id=' + orderId);
    }, e => {
      console.error(e);
    })
  },
  getLineWaitInfo (sn) {
    let api = 'com.ttdtrip.api.goods.apis.line.LineWaitApiService';
    let data = { base: app.globalData.baseBody, lineStatus: 1, sn };
    app.request(api, data, res => {
      console.log(res);
      utils.navigateTo('/pages/foodorder/foodorder?sn=' + sn + '&mid=' + res.line.mid);
    }, e => {
      console.error(e);
    })
  },
  goToTheDetail (e) {
    let id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title;
    let type = e.currentTarget.dataset.type;
    let content = e.currentTarget.dataset.content;
    if (type === 'order') {
      this.getOrderDetail(id);
    } else if (type === 'foodqueue') {
      let str = '点击提前点菜，就餐快人一步！';
      if (content.indexOf(str) !== -1) {
        this.getLineWaitInfo(id);
      } else {
        utils.navigateTo('/pages/lineUpDetail/lineUpDetail?sn=' + id);
      }
    } else if (type === 'foodorder') {
      let url = '/pages/orderDishesDetail/orderDishesDetail?id=' + id;
      utils.navigateTo(url);
    }
  }
})