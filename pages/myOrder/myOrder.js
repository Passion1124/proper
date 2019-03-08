const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderType: '',
    activeOrderType: 'tourism',
    orderStatus: '-2',
    show_order_status_choice: false,
    orderOptions: [{
        label: '全部订单',
        value: 0
      },
      {
        label: '待付款',
        value: 1
      },
      {
        label: '待使用',
        value: 2
      },
      {
        label: '待点评',
        value: 3
      }
    ],
    orders: [],
    lines: [],
    foodOrders: [],
    pending: {
      page: 1,
      size: 10,
      orderType: null,
      orderCharac: 0,
      orderStatus: -1
    },
    use: {
      page: 1,
      size: 10,
      orderCharac: 0,
      orderStatus: 3,
      orderType: null
    },
    comment: {
      page: 1,
      size: 10,
      orderCharac: 0,
      orderStatus: 4,
      orderType: null
    },
    tourism: {
      orderCharac: 2,
      orderType: 1,
      page: 1,
      size: 10
    },
    shopping: {
      orderCharac: 1,
      orderType: 1,
      page: 1,
      size: 10
    },
    line: {
      page: 1,
      size: 10
    },
    book: {
      orderCharac: null,
      orderType: 0,
      page: 1,
      size: 10
    },
    food: {
      appFrom: 1,
      eatingStatuses: null,
      orderStatuses: [1, 2],
      limit: 10,
      page: 1,
      size: 10,
      userId: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let orderType = Number(options.orderType);
    wx.setNavigationBarTitle({
      title: this.data.orderOptions.find(item => item.value === orderType).label,
    })
    this.setData({
      orderType: orderType
    });
    this.getCheckedOrderList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.data.food.userId = wx.getStorageSync('authority').myUid;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getCheckedOrderList() {
    let orderType = this.data.orderType;
    let activeType = this.data.activeOrderType;
    if (orderType === 0) {
      let orderStatus = this.data.orderStatus;
      if (activeType === 'tourism') {
        this.data.tourism.orderStatus = orderStatus !== '-2' ? parseInt(orderStatus) : "";
        this.getOrderList(this.data.tourism);
      } else if (activeType === 'shopping') {
        this.data.shopping.orderStatus = orderStatus !== '-2' ? parseInt(orderStatus) : "";
        this.getOrderList(this.data.shopping);
      } else if (activeType === 'line') {
        this.getMyLineList(this.data.line);
      } else if (activeType === 'book') {
        this.getOrderList(this.data.book);
      } else if (activeType === 'food') {
        this.getFoodOrderList(this.data.food);
      }
    } else if (orderType === 1) {
      this.getOrderList(this.data.pending);
    } else if (orderType === 2) {
      this.getOrderList(this.data.use);
    } else if (orderType === 3) {
      this.getOrderList(this.data.comment);
    }
  },
  // 获取订单列表
  getOrderList(obj) {
    let api = 'com.ttdtrip.api.order.apis.service.OrderListApiService';
    let data = Object.assign({
      base: app.globalData.baseBody
    }, obj);
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        orders: this.data.orders.concat(res.orders)
      })
    }, e => {
      console.error(e);
    })
  },
  // 获取排队列表
  getMyLineList (obj) {
    let api = 'com.ttdtrip.api.goods.apis.line.MyLineListApiService';
    let data = Object.assign({ base: app.globalData.baseBody }, obj);
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        orders: [],
        lines: res.lines,
        foodOrders: []
      })
    })
  },
  // 获取点菜列表
  getFoodOrderList (obj) {
    let api = 'com.ttdtrip.api.restaurant.apis.service.FoodOrderListApiService';
    let data = Object.assign({ base: app.globalData.base }, obj);
    app.request(api, data, res => {
      console.log(res);
      let foodOrders = this.data.foodOrders || [];
      if (res.foodOrders) foodOrders = foodOrders.concat(res.foodOrders);
      this.setData({
        orders: [],
        lines: [],
        foodOrders
      })
    })
  },
  // 获取订单详情接口
  handleOrderDetail(orderId) {
    let api = 'com.ttdtrip.api.order.apis.service.OrderDetailApiService';
    let data = { base: app.globalData.baseBody, orderId };
    app.request(api, data, res => {
      console.log(res);
      let merches = res.orderMerches[0];
      let url = '/pages/order/order?giid=' + merches.merchId + '&type=' + merches.merchType;
      if (res.order.preOrder) {
        url = '/pages/foodchoose/foodchoose?giid=' + merches.merchId;
      }
      wx.navigateTo({
        url: url,
      })
    }, fail => {
      wx.hideLoading();
    })
  },
  // 修改选中的订单
  handleChangeActiveOrderType (e) {
    let type = e.currentTarget.dataset.type;
    if (type !== this.data.activeOrderType) {
      this.setData({
        activeOrderType: type,
        orders: [],
        lines: [],
        foodOrders: []
      });
      this.getCheckedOrderList();
    }
  },
  // 去详情页面
  goToTheDetail (e) {
    let id = e.currentTarget.dataset.id;
    let item = e.currentTarget.dataset.order;
    let orderType = this.data.orderType;
    let active_type = this.data.activeOrderType;
    let url = '';
    if (orderType === 0) {
      if (active_type === 'book' && item.preOrder.time) {
        url = '/pages/bookDetail/bookDetail'
      } else {
        url = '/pages/orderDetail/orderDetail'
      }
    };
    wx.navigateTo({
      url: url + '?id=' + id,
    });
  },
  // 去付款或者再次购买
  goToTheShoppingOrPay (e) {
    let order = e.currentTarget.dataset.order;
    if (order.orderStatus === -1) {
      wx.navigateTo({
        url: '/pages/pay/pay?orderId=' + order.id + '&orderNo=' + order.orderNo,
      })
    } else {
      this.handleOrderDetail(order.id);
    }
    console.log(order);
  },
  // 修改筛选的订单状态
  handleChangeOrderStatus (e) {
    let status = e.currentTarget.dataset.status;
    this.setData({
      orderStatus: status,
      show_order_status_choice: false
    });
    this.data.orders = [];
    this.getCheckedOrderList();
  },
  handleShowOrderStatusChoice () {
    this.setData({
      show_order_status_choice: true
    });
  },
  handleCloseOrderStatusChoicePopup () {
    this.setData({
      show_order_status_choice: false
    });
  },
  goToTheLineUpDetail (e) {
    let sn = e.currentTarget.dataset.sn;
    wx.navigateTo({
      url: '/pages/lineUpDetail/lineUpDetail?sn=' + sn + '&skipType=order',
    })
  },
  goToTheFoodOrder (e) {
    let sn = e.currentTarget.dataset.sn;
    wx.navigateTo({
      url: '/pages/foodorder/foodorder?sn=' + sn
    })
  },
  goToTheOrderMealDetailPage (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/orderMealDetail/orderMealDetail?id=' + id,
    })
  }
})