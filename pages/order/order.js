const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    giid: '',
    type: '',
    receiver: {
      name: '',
      alias: '',
      phoneNo: '',
      email: '',
      faxNo: '',
      addr: '',
    },
    preOrderInfo: {
      date: '',
      name: '',
      alias: '',
      phoneNo: '',
      email: '',
      faxNo: '',
      addr: '',
      totalCount: 1
    },
    maxNum: 10,
    minusStatus: 'disabled',
    maxusStatus: 'normal',
    genderRange: [
      {
        value: 'gentleman',
        label: '先生'
      },
      {
        value: 'gentlewoman',
        label: '女士'
      }
    ],
    goods: {},
    goodsItem: {},
    coupons: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.giid = options.giid;
    this.data.type = options.type;
    this.getReceiverLatest();
    this.getGoodsItemDetail();
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
  // 获取最近使用的收货信息
  getReceiverLatest () {
    let api = 'com.ttdtrip.api.order.apis.service.ReceiverLatestApiService';
    let data = { base: app.globalData.baseBody };
    app.request(api, data, res => {
      console.log(res);
      if (res.receiver) {
        let preOrderInfo = Object.assign(this.data.preOrderInfo, res.receiver);
        this.setData({
          preOrderInfo: preOrderInfo
        });
      }
    }, err => {
      console.error(err);
    })
  },
  // 获取子商品详情
  getGoodsItemDetail () {
    let api = 'com.ttdtrip.api.goods.apis.GoodsItemDetailApiService';
    let data = { base: app.globalData.baseBody, giId: this.data.giid, spec: 1 };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        goodsItem: res.goodsItemVO
      });
      this.getGoodsDetail(res.goodsItemVO.goodsItemBase.gid);
      this.getUserCouponUsable(res.goodsItemVO.goodsItemBase.subType);
    }, err => {
      console.error(err);
    })
  },
  // 获取商品详情
  getGoodsDetail (gid) {
    let api = 'com.ttdtrip.api.goods.apis.GoodsDetailApiService';
    let data = { base: app.globalData.baseBody, gid: gid };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        goods: res.goodsVO
      })
    }, err => {
      console.error(err);
    })
  },
  // 获取用户优惠券订单可用
  getUserCouponUsable(merchType) {
    let orderMerches = {
      qryType: this.data.type,
      merchId: this.data.giid,
      merchType: merchType
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
  getMerchInventoryl () {
    let api = 'com.ttdtrip.api.order.apis.service.MerchInventorylApiService';
    let data = { base: app.globalData.baseBody, itemValues: {}, merchId: this.data.giid, merchType: this.goodsItem.goodsItemBase.subType };
    app.request(api, data, res => {
      console.log(res);
    }, err => {
      console.error(err);
    })
  },
  // 保存收货信息
  handleSaveReceiverInfo () {
    let api = 'com.ttdtrip.api.order.apis.service.ReceiverSaveApiService';
    let { name, alias, phoneNo, email, faxNo, addr, addrType } = this.data.preOrderInfo;
    let data = { base: app.globalData.baseBody, name, alias, phoneNo, email, faxNo, addr, addrType };
    app.request(api, data, res => {
      console.log(res);
    }, err => {
      console.error(err);
    })
  },
  // 生成订单
  handleCreateOrderGen () {
    let api = 'com.ttdtrip.api.order.apis.service.OrderGenApiService';
    let data = { base: app.globalData.baseBody, sn: '', orderType: 1, couponId: '', receiverId: '', orderMerches: [], preOrderInfo: {} };
    app.request(api, data, res => {
      console.log(res);
    }, err => {
      console.error(err);
    })
  },
  // 选择使用时间改变
  bindDateChange: function (e) {
    this.setData({
      ['preOrderInfo.date']: e.detail.value
    });
    this.getMerchInventoryl();
  },
  bindGenderChange: function (e) {
    let gender = this.data.genderRange[Number(e.detail.value)];
    this.setData({
      ['preOrderInfo.gender']: gender.value
    })
  },
  // 点击减号
  bindMinus: function () {
    var num = this.data.preOrderInfo.totalCount;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 只有小于库存的时候，才能normal状态，否则disable状态  
    var maxusStatus = num < this.data.maxNum ? 'normal' : 'disabled';
    var totalCount = 'preOrderInfo.totalCount';
    // 将数值与状态写回  
    this.setData({
      [totalCount]: num,
      minusStatus: minusStatus,
      maxusStatus: maxusStatus
    });
  },
  // 点击加号
  bindPlus: function () {
    var num = this.data.preOrderInfo.totalCount;
    if (num < this.data.maxNum) {
      num++;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 只有小于库存的时候，才能normal状态，否则disable状态  
    var maxusStatus = num < this.data.maxNum ? 'normal' : 'disabled';
    // 将数值与状态写回  
    var totalCount = 'preOrderInfo.totalCount';
    this.setData({
      [totalCount]: num,
      minusStatus: minusStatus,
      maxusStatus: maxusStatus
    });
  },
  // 输入框事件
  bindManual: function (e) {
    var num = e.detail.value;
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 只有小于库存的时候，才能normal状态，否则disable状态  
    var maxusStatus = num < this.data.maxNum ? 'normal' : 'disabled';
    if (num > this.data.maxNum) {
      num = this.data.maxNum;
    }
    if (num < 1) {
      num = 1;
    }
    var totalCount = 'preOrderInfo.totalCount';
    this.setData({
      [totalCount]: num,
      minusStatus: minusStatus,
      maxusStatus: maxusStatus
    })
  },
})