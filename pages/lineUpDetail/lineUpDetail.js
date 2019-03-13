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
    count: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = { sn: options.sn };
    if (options.skipType) data.skipType = options.skipType;
    this.setData(data);
    this.handleLineWait();
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
        })
      } else {
        if (this.data.count >= 12) {
          lineStatus = 'fail';
        } else {
          this.handleLineWait();
        }
      }
      this.setData({
        lineStatus
      })
    }, e => {
      console.error(e);
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
      url: '/pages/foodorder/foodorder?sn=' + this.data.sn
    })
  }
})