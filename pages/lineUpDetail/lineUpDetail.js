import utils from '../../utils/util.js'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sn: '',
    skipType: '',
    lineStatus: 'wait',
    line: {},
    lineNum: '',
    count: 0,
    num: '',
    email: '',
    favorName: '',
    roomName: '',
    goods: {},
    popup: false,
    emailValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { num, email, favorName, roomName } = options;
    let data = { sn: options.sn };
    if (options.skipType) data.skipType = options.skipType;
    if (num) data.num = num;
    if (email) data.email = email;
    if (favorName) data.favorName = favorName;
    if (roomName) data.roomName = roomName;
    this.setData(data);
    this.handleLineWait();
    if (options.skipType === 'order') {
      wx.setNavigationBarTitle({
        title: '订单详情',
      })
    }
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
  //排队检查(详情)
  handleLineWait () {
    let api = 'com.ttdtrip.api.goods.apis.line.LineWaitApiService';
    let data = { base: app.globalData.baseBody, sn: this.data.sn, lineStatus: 1 };
    this.data.count++;
    app.request(api, data, res => {
      console.log(res);
      let lineStatus = 'wait';
      let line = res.line;
      let lineNum = res.lineNum;
      if (line) {
        lineStatus = 'success';
        this.setData({
          line,
          lineNum
        });
        this.handleGetGoodsDetail(line.poiId);
      } else {
        if (this.data.count >= 12) {
          lineStatus = 'fail';
        } else {
          setTimeout(_ => {
            this.handleLineWait();
          }, 1000);
        }
      }
      this.setData({
        lineStatus
      })
    }, e => {
      console.error(e);
    })
  },
  // 获取商品详情
  handleGetGoodsDetail (gid) {
    let api = 'com.ttdtrip.api.goods.apis.GoodsDetailApiService';
    let data = { base: app.globalData.baseBody, gid };
    app.request(api, data, res => {
      console.log(res);
      this.setData({
        goods: res.goodsVO
      });
    }, e => {
      console.error(e);
    })
  },
  // 排队个人资料完善
  handleLineProfile () {
    let api = 'com.ttdtrip.api.goods.apis.line.LineProfileApiService';
    let data = { base: app.globalData.baseBody, sn: this.data.sn, email: this.data.emailValue };
    app.request(api, data, res => {
      console.log(res);
      this.handleHidePopup();
      this.handleLineWait();
    }, e => {
      console.error(e);
    })
  },
  // 保存邮箱
  handleSaveEmail () {
    if (!this.data.emailValue) {
      utils.showMessage('请输入您的邮箱');
    } else if (this.data.emailValue && !utils.validateEmail(this.data.emailValue)) {
      utils.showMessage('请输入正确的邮箱');
    } else {
      this.handleLineProfile();
    }
  },
  handleEmailValueInput (e) {
    this.setData({
      emailValue: e.detail.value
    });
  },
  handleShowPopup () {
    this.setData({
      popup: true
    })
  },
  handleHidePopup () {
    this.setData({
      popup: false
    })
  },
  handleResetLineWait () {
    this.setData({
      lineStatus: 'wait',
      count: 0
    });
    this.handleLineWait();
  },
  goToTheFoodOrder(e) {
    wx.navigateTo({
      url: '/pages/foodorder/foodorder?sn=' + this.data.sn + '&mid=' + this.data.line.mid
    })
  },
  goToTheFoodDetailPage () {
    wx.navigateTo({
      url: '/pages/fooddetail/fooddetail?gid=' + this.data.line.poiId + '&type=2'
    })
  }
})