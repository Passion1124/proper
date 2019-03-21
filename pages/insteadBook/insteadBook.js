import md5 from '../../utils/md5.js'
import utils from '../../utils/util.js'
import pinyin from '../../utils/pinyin.js'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mid: '',
    shopName: '',
    gid: '',
    giid: '',
    price: '',
    discount: '',
    receiver: {
      name: '',
      alias: '',
      phoneNo: '',
      email: '',
      faxNo: '',
      addr: '',
      addType: '',
      enName: ''
    },
    surname: '',
    en_name: '',
    receiverId: '',
    // 购买的商品信息
    orderMerches: {
      merchId: '',
      merchName: '',
      merchType: '',
      merchImgUrl: '',
      merchSpecific: '',
      usingDate: '',
      ext: {},
      merchCount: 1
    },
    // 餐厅供应商扩展属性
    orderRestaurantProviderMerch: {
      mName: '',
      mid: '',
      userUpTime: '',
      upTime: '',
      needAssign: 0,
      remark: ''
    },
    maxNum: 100,
    goods: {},
    goodsItem: {},
    coupons: [],
    selectCoupon: {},
    setting: {},
    p_mask: false,
    stratDate: '',
    timeRange: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let{ mid, shopName, gid, giid } = options;
    this.setData({ mid, shopName, gid, giid });
    this.getGoodsItemDetail();
    this.getReceiverLatest();
    this.getPreOrderSetting();
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
        let { addr, addrType, alias, email, faxNo, name, phoneNo, enName } = res.receiver;
        let surname = enName.split('|')[1] || '';
        let en_name = enName.split('|')[0] || '';
        this.setData({
          receiver: { addr, addrType, alias, email, faxNo, name, phoneNo },
          surname,
          en_name
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
      // this.getGoodsDetail(res.goodsItemVO.goodsItemBase.gid);
      this.getUserCouponUsable(res.goodsItemVO.goodsItemBase.subType);
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
  // 预订单设置查询
  getPreOrderSetting() {
    let api = 'com.ttdtrip.api.order.apis.service.PreOrderSettingApiService';
    let data = {
      base: app.globalData.baseBody,
      mid: this.data.mid
    };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        setting: res.setting
      });
      this.initPreOrderBookTime();
    }, e => {
      console.error(e);
    })
  },
  // 代预订可选时间段
  getRestProviderOrderBookTime(date) {
    let api = 'com.ttdtrip.api.order.apis.service.RestProviderOrderBookTimeApiService';
    let data = {
      base: app.globalData.baseBody,
      merchId: this.data.giid,
      usingDate: date,
      preOrderTime: this.data.goodsItem.goodsItemBase.ext.preOrderTime
    };
    app.request(api, data, res => {
      console.log(res);
      // res.schedules.filter(item => item.currentBookTimes < item.maxBookTimes).map(item => item.startTime)
      this.setData({
        timeRange: res.schedules.map(item => item.startTime)
      });
    }, e => {
      console.log(e);
      this.setData({
        timeRange: []
      });
    });
  },
  // 保存收货信息
  handleSaveReceiverInfo() {
    let api = 'com.ttdtrip.api.order.apis.service.ReceiverSaveApiService';
    if (this.data.en_name && this.data.surname) {
      this.data.receiver.enName = this.data.en_name + '|' + this.data.surname;
    } else {
      this.data.receiver.enName = "";
    }
    if (this.data.goodsItem.goodsItemBase.vouchWay === 3) {
      this.data.receiver.addrType = 1;
    }
    let data = Object.assign({ base: app.globalData.baseBody }, this.data.receiver);
    app.request(api, data, res => {
      console.log(res);
      this.data.receiverId = res.receiverId;
      this.handleCreateOrderGen();
    }, err => {
      console.error(err);
    })
  },
  // 初始化页面获取日期选择的起始时间
  initPreOrderBookTime() {
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
  // 选择日期改变
  bindDateChange: function (e) {
    this.setData({
      useData: e.detail.value,
      timeRange: [],
      ['orderRestaurantProviderMerch.upTime']: ''
    });
    this.getRestProviderOrderBookTime(e.detail.value.replace(/-/g, ''));
  },
  // 选择时间
  bindUpTimeChange (e) {
    this.setData({
      ['orderRestaurantProviderMerch.upTime']: this.data.timeRange[e.detail.value]
    });
  },
  // 调配时间
  bindNeedAssignTime (e) {
    let needAssign = this.data.orderRestaurantProviderMerch.needAssign;
    this.setData({
      ['orderRestaurantProviderMerch.needAssign']: !needAssign
    });
  },
  // 转为英文姓名
  handleTransformEnglishName() {
    let cName = this.data.receiver.name;
    if (cName.length < 2) {
      utils.showMessage('中文姓名不能少于两个字');
    } else if (!this.isChinese(cName)) {
      utils.showMessage('请输入中文的姓名');
    } else {
      let surname = pinyin.pinyin.getFullChars(cName.substring(0, 1));
      let en_name = pinyin.pinyin.getFullChars(cName.substring(1));
      this.setData({
        surname,
        en_name
      })
    }
  },
  // 修改英文名称
  bindEnNameChange(e) {
    let type = parseInt(e.currentTarget.dataset.type);
    let str = type ? 'surname' : 'en_name';
    this.setData({
      [str]: e.detail.value
    });
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
  // 判断是否为汉字
  isChinese(str) {
    let reg = new RegExp(/^[\u4e00-\u9fa5]+$/);
    return reg.test(str);
  }
})