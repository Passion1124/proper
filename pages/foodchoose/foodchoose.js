import md5 from '../../utils/md5.js'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    giid: '',
    price: '',
    discount: '',
    p_mask: false,
    receiver: {
      name: '',
      alias: '',
      phoneNo: '',
      email: '',
      faxNo: '',
      addr: '',
      addType: ''
    },
    receiverId: '',
    orderMerches: {
      merchId: '',
      merchName: '',
      merchType: '',
      merchImgUrl: '',
      merchSpecific: '',
      usingDate: '',
      ext: {},
      merchCount: 1,
      goodsId: ""
    },
    preOrderInfo: {
      date: '',
      mName: '',
      mid: ''
    },
    useData: '',
    maxNum: 100,
    goods: {},
    goodsItem: {},
    coupons: [],
    selectCoupon: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.giid = options.giid;
    this.data.orderMerches.merchId = options.giid;
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
  getReceiverLatest() {
    let api = 'com.ttdtrip.api.order.apis.service.ReceiverLatestApiService';
    let data = { base: app.globalData.baseBody };
    app.request(api, data, res => {
      console.log(res);
      if (res.receiver) {
        let { addr, addrType, alias, email, faxNo, name, phoneNo } = res.receiver;
        this.setData({
          receiver: { addr, addrType, alias, email, faxNo, name, phoneNo }
        });
      }
    }, err => {
      console.error(err);
    })
  },
  // 获取子商品详情
  getGoodsItemDetail() {
    let api = 'com.ttdtrip.api.goods.apis.GoodsItemDetailApiService';
    let data = { base: app.globalData.baseBody, giId: this.data.giid, spec: 1 };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        goodsItem: res.goodsItemVO,
        price: res.goodsItemVO.goodsItemBase.amount || res.goodsItemVO.goodsItemBase.sourceAmount
      });
      this.getGoodsDetail(res.goodsItemVO.goodsItemBase.gid);
      this.getUserCouponUsable(res.goodsItemVO.goodsItemBase.subType);
      this.getMerchInventoryl();
    }, err => {
      console.error(err);
    })
  },
  // 获取商品详情
  getGoodsDetail(gid) {
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
      qryType: 1,
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
  getMerchInventoryl() {
    let api = 'com.ttdtrip.api.order.apis.service.MerchInventorylApiService';
    let data = { base: app.globalData.baseBody, itemValues: {}, merchId: this.data.giid, merchType: this.data.goodsItem.goodsItemBase.subType };
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
    let data = Object.assign({ base: app.globalData.baseBody }, this.data.receiver);
    app.request(api, data, res => {
      console.log(res);
      this.data.receiverId = res.receiverId;
      this.handleCreateOrderGen();
    }, err => {
      console.error(err);
    })
  },
  // 生成订单
  handleCreateOrderGen() {
    let api = 'com.ttdtrip.api.order.apis.service.OrderGenApiService';
    let p_data = { orderType: 0, receiverId: this.data.receiverId, orderMerches: this.data.orderMerches, preOrderInfo: this.data.preOrderInfo };
    if (this.data.selectCoupon.couponId) {
      p_data.couponId = this.data.selectCoupon.couponId;
    };
    let sn = md5(p_data + new Date().getTime());
    let data = Object.assign({ base: app.globalData.baseBody }, p_data, { sn });
    app.request(api, data, res => {
      console.log(res);
      wx.navigateTo({
        url: '/pages/pay/pay?orderId=' + res.orderId + '&orderNo=' + res.orderNo + '&currency=' + res.currency + '&type=' + this.data.type,
      })
    }, err => {
      console.error(err);
    })
  },
  // 点击去付款按钮
  handleClickPaymentButton() {
    this.data.orderMerches.merchType = this.data.goodsItem.goodsItemBase.subType;
    this.data.orderMerches.merchName = this.data.goodsItem.goodsItemInfo.name;
    this.data.orderMerches.usingDate = this.getUsingDate(this.data.goodsItem.goodsItemBase.end);
    this.data.orderMerches.merchSpecific = "";
    this.data.orderMerches.merchImgUrl = this.data.goods.goodsBase.poster;
    this.data.preOrderInfo.date = this.getUsingDate(this.data.goodsItem.goodsItemBase.start);
    this.data.preOrderInfo.mid = this.data.goods.goodsBase.mid;
    this.data.preOrderInfo.mName = this.data.goods.goodsInfo.name;
    this.handleSaveReceiverInfo();
  },
  // 修改姓名
  handleInputName(e) {
    this.setData({
      ['receiver.name']: e.detail.value
    })
  },
  // 修改手机号
  handleInputPhone(e) {
    this.setData({
      ['receiver.phoneNo']: e.detail.value
    })
  },
  // 修改邮箱
  handleInputEmail(e) {
    this.setData({
      ['receiver.email']: e.detail.value
    })
  },
  // 点击减号
  bindMinus: function () {
    var num = this.data.orderMerches.merchCount;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    var merchCount = 'orderMerches.merchCount';
    // 将数值与状态写回  
    this.setData({
      [merchCount]: num
    });
  },
  // 点击加号
  bindPlus: function () {
    var num = this.data.orderMerches.merchCount;
    if (num < this.data.maxNum) {
      num++;
    } else {
      wx.showToast({
        title: '仅剩' + this.data.maxNum + '件',
        icon: 'none'
      })
    }
    // 将数值与状态写回  
    var merchCount = 'orderMerches.merchCount';
    this.setData({
      [merchCount]: num
    });
  },
  // 输入框事件
  bindManual: function (e) {
    var num = e.detail.value;
    if (num > this.data.maxNum) {
      num = this.data.maxNum;
    }
    if (num < 1) {
      num = 1;
    }
    var merchCount = 'orderMerches.merchCount';
    this.setData({
      [merchCount]: num
    })
  },
  // 选中的优惠券
  selectedCoupon(e) {
    let selectCoupon = this.data.coupons.find(item => item.id === e.currentTarget.dataset.id);
    if (selectCoupon.id === this.data.selectCoupon.id) {
      this.setData({
        selectCoupon: {}
      });
      this.closePopup();
      return false;
    }
    if (selectCoupon.type !== 1) {
      this.setData({
        selectCoupon: selectCoupon
      })
    } else {
      if (this.data.price * this.data.orderMerches.merchCount >= selectCoupon.sourcePrice) {
        this.setData({
          selectCoupon: selectCoupon
        })
      } else {
        wx.showToast({
          title: '未达到满减条件，不可使用该优惠券',
          icon: 'none'
        });
        return false;
      }
    }
    this.closePopup();
  },
  // 点击优惠券栏
  clickCouponLan() {
    if (this.data.coupons.length) {
      this.setData({
        p_mask: true
      })
    }
  },
  // 关闭弹窗
  closePopup() {
    this.setData({
      p_mask: false
    })
  },
  getUsingDate (time) {
    var date = new Date(time);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    if (m < 10) m = "0" + m;
    if (d < 10) d = "0" + d;
    return '' + y + m + d;
  }
})