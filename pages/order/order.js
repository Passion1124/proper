const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    preOrderInfo: {
      date: '',
      name: '',
      alias: '',
      phoneNo: '',
      email: '',
      faxNo: '',
      addr: '',
      totalCount: 1,
      gender: ''
    },
    maxNum: 10,
    minusStatus: 'disabled',
    maxusStatus: 'normal',
    genderRange: [
      {
        value: 1,
        label: '先生'
      },
      {
        value: 2,
        label: '女士'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
  // 选择使用时间改变
  bindDateChange: function (e) {
    this.setData({
      ['preOrderInfo.date']: e.detail.value
    })
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