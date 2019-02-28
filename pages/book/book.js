const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mid: '',
    shopName: '',
    gid: '',
    goodsItem: [],
    goodsItemCount: 0,
    timeRange: [],
    date: '',
    time: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.mid = options.mid;
    this.data.gid = options.gid;
    this.setData({
      shopName: options.shopName
    });
    let date = new Date();
    let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let now = date.getFullYear() + month + day;
    this.getGoodsItemList();
    this.getPreOrderBookTime(now);
    this.getPreOrderSetting();
    this.getReceiverLatest();
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
  // 子商品列表
  getGoodsItemList() {
    let api = 'com.ttdtrip.api.goods.apis.GoodsItemListApiService';
    let data = {
      base: app.globalData.baseBody,
      gid: this.data.gid,
      subType: 22,
      page: 1,
      size: 5
    };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        goodsItem: res.goodsItemVOS,
        goodsItemCount: res.total
      });
    }, e => {
      console.error(e);
    })
  },
  // 预订单设置查询
  getPreOrderSetting () {
    let api = 'com.ttdtrip.api.order.apis.service.PreOrderSettingApiService';
    let data = {
      base: app.globalData.baseBody,
      mid: this.data.mid
    };
    app.request(api, data, res => {
      console.log(res);
    }, e => {
      console.error(e);
    })
  },
  // 预订单预约时间v2
  getPreOrderBookTime(date) {
    console.log(date);
    let api = 'com.ttdtrip.api.order.apis.service.PreOrderBookTimeApiService';
    let data = {
      base: app.globalData.baseBody,
      mid: this.data.mid,
      date
    };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        timeRange: res.schedules.map(item => item.startTime)
      });
    }, e => {
      console.log(e);
    });
  },
  // 最近使用的收货信息
  getReceiverLatest () {
    let api = 'com.ttdtrip.api.order.apis.service.ReceiverLatestApiService';
    let data = { base: app.globalData.baseBody };
    app.request(api, data, res => {
      console.log(res);
    }, e => {
      console.error(e);
    })
  },
  // 修改用餐日期
  handleChangeDate (e) {
    this.setData({
      date: e.detail.value,
      time: ''
    });
    this.getPreOrderBookTime(e.detail.value.replace(/-/g, ''));
  },
  // 修改用餐时间
  handleChangeTime (e) {
    this.setData({
      time: e.detail.value
    });
  }
})