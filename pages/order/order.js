import md5 from '../../utils/md5.js'
import utils from '../../utils/util.js'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    giid: '',
    type: '',
    price: '',
    discount: '',
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
      ext: {
        babyChairCount: 0
      },
      merchCount: 1
    },
    useData: '',
    merchSpecific: '',
    maxNum: 100,
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
    coupons: [],
    selectCoupon: {},
    p_mask: false,
    start_date: '',
    pickUpType: 1,
    self_taking: '',
    mail: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.data.giid = 'abbefc0d-4770-434d-9c18-4e26ff4c304a';
    // this.data.orderMerches.merchId = 'abbefc0d-4770-434d-9c18-4e26ff4c304a';
    // this.data.type = 1;
    this.data.giid = options.giid;
    this.data.orderMerches.merchId = options.giid;
    this.data.type = options.type;
    this.setData({
      start_date: this.getNowFormatDate()
    });
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
        let { addr, addrType, alias, email, faxNo, name, phoneNo } = res.receiver;
        this.setData({
          receiver: { addr, addrType, alias, email, faxNo, name, phoneNo },
          mail: addrType ? addr : ''
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
      let pickUpType = res.goodsItemVO.goodsItemBase.pickUpType;
      let self_taking = this.data.self_taking;
      let p_type = 1;
      if (pickUpType) {
        if (pickUpType !== 2) {
          self_taking = res.goodsItemVO.goodsItemInfo.pickUpAddress[0];
        } else {
          p_type = 0;
        }
      }
      this.setData({
        goodsItem: res.goodsItemVO,
        price: res.goodsItemVO.goodsItemBase.amount || res.goodsItemVO.goodsItemBase.sourceAmount,
        self_taking: self_taking,
        pickUpType: p_type
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
  getMerchInventoryl () {
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
  handleSaveReceiverInfo () {
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
  handleCreateOrderGen () {
    let api = 'com.ttdtrip.api.order.apis.service.OrderGenApiService';
    let p_data = { orderType: 1, receiverId: this.data.receiverId, orderMerches: this.data.orderMerches };
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
  handleClickPaymentButton () {
    if (!this.data.useData) {
      utils.showMessage('请选择使用时间');
    } else if (!this.data.receiver.name) {
      utils.showMessage('请输入您的姓名');
    } else if (!this.data.receiver.alias) {
      utils.showMessage('请选择您的称谓');
    } else if (!this.data.receiver.phoneNo) {
      utils.showMessage('请输入您的手机号码');
    } else if (this.data.receiver.phoneNo && !utils.validatePhone(this.data.receiver.phoneNo)) {
      utils.showMessage('请输入正确的手机号码');
    } else if (!this.data.receiver.email) {
      utils.showMessage('请输入您的邮箱');
    } else if (this.data.receiver.email && !utils.validateEmail(this.data.receiver.email)) {
      utils.showMessage('请输入正确的邮箱');
    } else if ((this.data.goodsItem.goodsItemBase.subType === 11 || this.data.goodsItem.goodsItemBase.subType === 12) && !this.data.merchSpecific) {
      utils.showMessage('请输入接送点');
    } else {
      this.data.orderMerches.merchType = this.data.goodsItem.goodsItemBase.subType;
      this.data.orderMerches.merchName = this.data.goodsItem.goodsItemInfo.name;
      this.data.orderMerches.usingDate = this.data.useData.replace(new RegExp('-', 'g'), '');
      this.data.orderMerches.merchSpecific = this.data.merchSpecific + '&1';
      this.data.orderMerches.merchImgUrl = this.data.goods.goodsBase.poster;
      if (this.data.goodsItem.goodsItemBase.pickUpType) {
        this.data.receiver.addr = this.data.pickUpType ? this.data.self_taking : this.data.mail;
        this.data.receiver.addrType = this.data.pickUpType;
        if (!this.data.receiver.addr) {
          utils.showMessage('请输入邮寄地址');
          return false;
        }
      } else {
        this.data.receiver.addr = '';
        this.data.receiver.addrType = '';
      }
      this.handleSaveReceiverInfo();
    }
  },
  // 选择使用时间改变
  bindDateChange: function (e) {
    this.setData({
      useData: e.detail.value
    });
    console.log(this.data.useData);
    this.getMerchInventoryl();
  },
  // 修改称谓
  bindGenderChange: function (e) {
    let gender = this.data.genderRange[Number(e.detail.value)];
    this.setData({
      ['receiver.alias']: gender.value
    })
  },
  // 修改姓名
  handleInputName (e) {
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
  handleInputEmail (e) {
    this.setData({
      ['receiver.email']: e.detail.value
    })
  },
  // 修改接送点
  handleInputMerchSpecific(e) {
    this.setData({
      merchSpecific: e.detail.value
    })
  },
  // 点击减号
  bindMinus: function () {
    var num = this.data.orderMerches.merchCount;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 只有小于库存的时候，才能normal状态，否则disable状态  
    var maxusStatus = num < this.data.maxNum ? 'normal' : 'disabled';
    var merchCount = 'orderMerches.merchCount';
    // 将数值与状态写回  
    this.setData({
      [merchCount]: num,
      minusStatus: minusStatus,
      maxusStatus: maxusStatus
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
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 只有小于库存的时候，才能normal状态，否则disable状态  
    var maxusStatus = num < this.data.maxNum ? 'normal' : 'disabled';
    // 将数值与状态写回  
    var merchCount = 'orderMerches.merchCount';
    this.setData({
      [merchCount]: num,
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
    var merchCount = 'orderMerches.merchCount';
    this.setData({
      [merchCount]: num,
      minusStatus: minusStatus,
      maxusStatus: maxusStatus
    })
  },
  // 选中的优惠券
  selectedCoupon (e) {
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
  clickCouponLan () {
    if (this.data.coupons.length) {
      this.setData({
        p_mask: true
      })
    }
  },
  // 关闭弹窗
  closePopup () {
    this.setData({
      p_mask: false
    })
  },
  // 安全座椅减号/加号按钮点击、输入
  bindExtMinus (e) {
    let num = this.data.orderMerches.ext.babyChairCount;
    if (num > 1) {
      num--;
    };
    this.setData({
      ['orderMerches.ext.babyChairCount']: num
    })
  },
  bindExtPlus(e) {
    let num = this.data.orderMerches.ext.babyChairCount;
    num++;
    this.setData({
      ['orderMerches.ext.babyChairCount']: num
    })
  },
  bindExtManual(e) {
    let num = e.detail.value;
    if (num < 0) {
      num = 0;
    };
    this.setData({
      ['orderMerches.ext.babyChairCount']: num
    })
  },
  getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },
  handleChangeInputMail (e) {
    this.setData({
      mail: e.detail.value
    })
  },
  handleChangeSelfTaking (e) {
    let item = e.currentTarget.dataset.item;
    this.setData({
      self_taking: item
    });
  },
  // 修改邮寄类型
  handleUpdatePickUpType (e) {
    let type = e.currentTarget.dataset.type;
    this.setData({
      pickUpType: parseInt(type)
    })
  }
})