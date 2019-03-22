import utils from '../../utils/util.js'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gid: '',
    mid: '',
    name: '',
    num: 1,
    isBox: 0,
    allowSmock: -1,
    email: '',
    onlineOrderDish: '',
    receiver: {},
    goods: {},
    tipsShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      mid: options.mid,
      onlineOrderDish: options.onlineOrderDish,
      gid: options.gid,
      name: options.shopName
    });
    this.getReceiverLatest();
    this.getGoodsDetail(options.gid);
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
          receiver: { addr, addrType, alias, email, faxNo, name, phoneNo },
          email: email
        });
      }
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
  //排队前桌台检查
  handlePreJoinLineCheckApiService () {
    if (!this.data.email) {
      utils.showMessage('请输入您的邮箱');
    } else if (this.data.email && !utils.validateEmail(this.data.email)) {
      utils.showMessage('请输入正确的邮箱');
    } else {
      let api = 'com.ttdtrip.api.order.apis.service.PreJoinLineCheckApiService';
      let data = { base: app.globalData.baseBody, mid: this.data.mid, isBox: this.data.isBox, allowSmock: this.data.allowSmock, num: this.data.num };
      app.request(api, data, res => {
        console.log(res);
        let smock = this.data.allowSmock;
        let favorName = smock ? (smock === 1 ? '吸烟区' : '不介意') : '非吸烟区';
        let roomName = this.data.isBox ? '需要' : '不需要';
        let obj = { mid: this.data.mid, name: this.data.name, num: this.data.num, box: this.data.isBox, smoke: this.data.allowSmock, email: this.data.email, onlineOrderDish: this.data.onlineOrderDish, poiId: this.data.gid, lan: 'zh-cn', favorName, roomName };
        wx.setStorageSync('line', obj);
        wx.navigateTo({
          url: '/pages/lineUpConfirm/lineUpConfirm',
        })
      }, e => {
        console.error(e);
      })
    }
  },
  // 点击减号
  bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 将数值与状态写回  
    this.setData({
      num: num
    });
  },
  // 点击加号
  bindPlus: function () {
    var num = this.data.num;
    num++;
    this.setData({
      num: num
    });
  },
  // 输入框事件
  bindManual: function (e) {
    var num = e.detail.value;
    if (num < 1) {
      num = 1;
    }
    this.setData({
      num: num
    })
  },
  handleInputEmail (e) {
    this.setData({
      email: e.detail.value
    });
  },
  handleChangeIsBox (e) {
    let box = parseInt(e.currentTarget.dataset.box);
    let num = this.data.num;
    let obj = {};
    if (box) {
      if (num >= 4) {
        obj.isBox = box;
        obj.tipsShow = false;
      } else {
        obj.isBox = 0;
        obj.tipsShow = true;
      }
    } else {
      obj.isBox = box;
      obj.tipsShow = false;
    }
    this.setData(obj);
  },
  handleChangeAllowSmock (e) {
    this.setData({
      allowSmock: parseInt(e.currentTarget.dataset.smock)
    });
  }
})