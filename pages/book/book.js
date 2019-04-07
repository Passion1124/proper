import md5 from '../../utils/md5.js'
import utils from '../../utils/util.js'

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
    preOrderInfo: {
      mid: '',
      mName: '',
      contactor: '',
      mail: '',
      phoneNo: '',
      isBox: 0,
      allowSmoke: -1,
      totalCount: 1,
      date: '',
      time: '',
      customerRequest: '',
      priceEachOne: 0
    },
    receiverId: '',
    orderMerches: {
      goodsId: '',
      merchId: '',
      merchName: '',
      merchType: '',
      merchImgUrl: '',
      merchSpecific: '',
      usingDate: '',
      ext: {},
      merchCount: 1
    },
    customerRequest: [],
    setting: {},
    checkedCustomer: [],
    type: 'order',
    payPrice: 0,
    currency: '',
    coupons: [],
    selectCoupon: {},
    stratDate: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.mid = options.mid;
    this.data.preOrderInfo.mid = options.mid;
    this.data.gid = options.gid;
    this.data.preOrderInfo.mName = options.shopName;
    this.setData({
      shopName: options.shopName
    });
    this.getGoodsItemList();
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
      let customerRequest = res.setting.customerRequest.split('|');
      if (!customerRequest[0]) customerRequest = [];
      this.setData({
        setting: res.setting,
        customerRequest: customerRequest,
        checkedCustomer: customerRequest.map(item => false),
        payPrice: res.setting.priceEachOne,
        currency: res.setting.currency,
        ['preOrderInfo.priceEachOne']: res.setting.priceEachOne
      });
      this.initPreOrderBookTime();
    }, e => {
      console.error(e);
    })
  },
  // 预订单预约时间v2
  getPreOrderBookTime(date) {
    let api = 'com.ttdtrip.api.order.apis.service.PreOrderBookTimeApiService';
    let data = {
      base: app.globalData.baseBody,
      mid: this.data.mid,
      date
    };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        timeRange: res.schedules.filter(item => item.currentBookTimes < item.maxBookTimes).map(item => item.startTime)
      });
    }, e => {
      console.log(e);
      this.setData({
        timeRange: []
      });
    });
  },
  // 最近使用的收货信息
  getReceiverLatest () {
    let api = 'com.ttdtrip.api.order.apis.service.ReceiverLatestApiService';
    let data = { base: app.globalData.baseBody };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        ['preOrderInfo.contactor']: res.receiver.name,
        ['preOrderInfo.phoneNo']: res.receiver.phoneNo,
        ['preOrderInfo.mail']: res.receiver.email
      })
    }, e => {
      console.error(e);
    })
  },
  initPreOrderBookTime () {
    // this.data.setting.preOrderDays * 
    let timestamp = new Date().getTime() + 24 * 3600 * 1000;
    let date = new Date(timestamp);
    let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let now = date.getFullYear() + month + day;
    this.setData({
      stratDate: date.getFullYear() + '-' + month + '-' + day
    });
    // this.getPreOrderBookTime(now);
  },
  // 获取用户优惠券订单可用
  getUserCouponUsable(item) {
    let orderMerches = {
      qryType: 1,
      merchId: item.goodsItemInfo.giid,
      merchType: item.goodsItemBase.subType
    }
    let api = 'com.ttdtrip.api.order.apis.service.UserCouponUsableApiService';
    let data = { base: app.globalData.baseBody, orderMerches: orderMerches };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        coupons: res.coupons
      });
    }, err => {
      console.error(err);
    })
  },
  // 获取商品库存信息
  getMerchInventoryl(item) {
    let api = 'com.ttdtrip.api.order.apis.service.MerchInventorylApiService';
    let data = { base: app.globalData.baseBody, itemValues: {}, merchId: item.goodsItemInfo.giid, merchType: item.goodsItemBase.subType };
    app.request(api, data, res => {
      console.log(res);
      this.data.maxNum = res.merchInventory.consumableCount;
    }, err => {
      console.error(err);
    })
  },
  // 保存收货信息
  handleSaveReceiverInfo() {
    let api = 'com.ttdtrip.api.order.apis.service.ReceiverSaveApiService';
    let preOrderInfo = this.data.preOrderInfo;
    let data = Object.assign({ base: app.globalData.baseBody }, { name: preOrderInfo.contactor, email: preOrderInfo.mail, phoneNo: preOrderInfo.phoneNo });
    app.request(api, data, res => {
      console.log(res);
      this.data.receiverId = res.receiverId;
      let preOrderInfo = Object.assign({}, this.data.preOrderInfo);
      preOrderInfo.time = this.data.timeRange[parseInt(preOrderInfo.time)];
      let filterCustomer = this.data.customerRequest.filter((item, index) => this.data.checkedCustomer[index]);
      preOrderInfo.customerRequest = filterCustomer.length ? filterCustomer.reduce((pre, next) => pre + '|' + next) : '';
      let orderMerches = this.data.type !== 'order' ? [this.data.orderMerches] : [];
      let bookOrder = {
        receiverId: res.receiverId,
        preOrderInfo,
        orderMerches: orderMerches,
        currency: this.data.currency,
        goodsItem: this.data.goodsItem
      }
      wx.setStorageSync('bookOrder', bookOrder);
      wx.navigateTo({
        url: '/pages/bookConfirm/bookConfirm',
      });
      // this.handleCreateOrderGen();
    }, err => {
      console.error(err);
    })
  },
  // 生成订单
  handleCreateOrderGen() {
    let api = 'com.ttdtrip.api.order.apis.service.OrderGenApiService';
    let p_data = { orderType: 0, receiverId: this.data.receiverId, preOrderInfo: this.data.preOrderInfo };
    if (this.data.type !== 'order') {
      p_data.orderMerches = this.data.orderMerches;
    }
    if (this.data.selectCoupon.couponId) {
      p_data.couponId = this.data.selectCoupon.couponId;
    };
    let sn = md5(p_data + new Date().getTime());
    let data = Object.assign({ base: app.globalData.baseBody }, p_data, { sn });
    app.request(api, data, res => {
      console.log(res);
      wx.navigateTo({
        url: '/pages/pay/pay?orderId=' + res.orderId + '&orderNo=' + res.orderNo + '&currency=' + res.currency + '&type=2',
      })
    }, err => {
      console.error(err);
    })
  },
  // 点击去付款按钮
  handleClickPaymentButton() {
    if (!this.data.preOrderInfo.date) {
      utils.showMessage('请选择用餐日期');
    } else if (!this.data.preOrderInfo.time) {
      utils.showMessage('请选择用餐时间');
    } else if (!this.data.preOrderInfo.contactor) {
      utils.showMessage('请输入您的姓名');
    } else if (this.isChinese(this.data.preOrderInfo.contactor)) {
      utils.showMessage('请使用名字拼音');
    } else if (!this.data.preOrderInfo.mail) {
      utils.showMessage('请输入您的邮箱');
    } else if (this.data.preOrderInfo.mail && !utils.validateEmail(this.data.preOrderInfo.mail)) {
      utils.showMessage('请输入正确的邮箱');
    } else if (!this.data.preOrderInfo.phoneNo) {
      utils.showMessage('请输入您的手机号码');
    } else if (this.data.preOrderInfo.phoneNo && !utils.validatePhone(this.data.preOrderInfo.phoneNo)) {
      utils.showMessage('请输入正确的手机号码');
    } else {
      if (this.data.type !== 'order') {
        let item = this.data.goodsItem.find(item => item.goodsItemInfo.giid === this.data.type);
        this.data.orderMerches.merchType = item.goodsItemBase.subType;
        this.data.orderMerches.merchName = item.goodsItemInfo.name;
        this.data.orderMerches.merchImgUrl = item.goodsItemBase.poster;
        this.data.orderMerches.merchId = item.goodsItemInfo.giid;
        this.data.orderMerches.merchCount = this.data.preOrderInfo.totalCount;
        this.data.orderMerches.usingDate = this.data.preOrderInfo.date.replace(new RegExp('-', 'g'), '');
      }
      this.handleSaveReceiverInfo();
    }
  },
  // 点击减号
  bindMinus: function () {
    var num = this.data.preOrderInfo.totalCount;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    var merchCount = 'preOrderInfo.totalCount';
    // 将数值与状态写回  
    this.setData({
      [merchCount]: num
    });
  },
  // 点击加号
  bindPlus: function () {
    var num = this.data.preOrderInfo.totalCount;
    num++;
    // 将数值与状态写回  
    var merchCount = 'preOrderInfo.totalCount';
    this.setData({
      [merchCount]: num
    });
  },
  // 输入框事件
  bindManual: function (e) {
    var num = e.detail.value;
    if (num < 1) {
      num = 1;
    }
    var merchCount = 'preOrderInfo.totalCount';
    this.setData({
      [merchCount]: num
    })
  },
  // 修改用餐日期
  handleChangeDate (e) {
    this.setData({
      ['preOrderInfo.date']: e.detail.value,
      ['preOrderInfo.time']: ''
    });
    this.getPreOrderBookTime(e.detail.value.replace(/-/g, ''));
  },
  // 修改用餐时间
  handleChangeTime (e) {
    this.setData({
      ['preOrderInfo.time']: e.detail.value
    });
  },
  // 点击用餐时间
  handleClickEatTime (e) {
    if (!this.data.preOrderInfo.date) {
      utils.showMessage('请选择用餐日期');
    }
  },
  // 修改包间
  handleChangeBox (e) {
    let box = parseInt(e.currentTarget.dataset.box);
    this.setData({
      ['preOrderInfo.isBox']: box
    })
  },
  // 修改吸烟区
  handleChangeSmoke(e) {
    let smoke = parseInt(e.currentTarget.dataset.smoke);
    this.setData({
      ['preOrderInfo.allowSmoke']: smoke
    })
  },
  // 修改输入框的值
  handleChangeInputValue (e) {
    let type = e.currentTarget.dataset.type;
    let str = '';
    if (type === 'name') {
      str = 'preOrderInfo.contactor';
    } else if (type === 'mail') {
      str = 'preOrderInfo.mail';
    } else {
      str = 'preOrderInfo.phoneNo'
    }
    this.setData({
      [str]: e.detail.value
    });
  },
  // 修改预约说明
  handleChangeOrderExplain (e) {
    let index = parseInt(e.currentTarget.dataset.index);
    let arr = this.data.checkedCustomer;
    arr[index] = !arr[index];
    this.setData({
      checkedCustomer: arr
    });
  },
  // 修改预订的类型
  handleChangeOrderType (e) {
    let type = e.currentTarget.dataset.type;
    let price = ''
    if (type !== 'order') {
      let item = this.data.goodsItem.find(item => item.goodsItemInfo.giid === type);
      this.getUserCouponUsable(item);
      this.getMerchInventoryl(item);
      price = item.goodsItemBase.amount || item.goodsItemBase.sourceAmount;
    } else {
      price = this.data.setting.priceEachOne
    }
    this.setData({
      type: type,
      payPrice: price
    });
  },
  // 判断是否为汉字
  isChinese(str) {
    let reg = new RegExp(/^[\u4e00-\u9fa5]+$/);
    return reg.test(str);
  }
})