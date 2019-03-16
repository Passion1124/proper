import utils from '../../utils/util.js'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    star: 0,
    comment: '',
    target: '',
    pics: []
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
  // 修改评分
  handleUpdateStar (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      star: index
    })
  },
  // 同步评论内容
  handleInputComment (e) {
    this.setData({
      comment: e.detail.value
    })
  },
  // 选择图片
  handleClickFileInput () {
    let _this = this;
    wx.chooseImage({
      count: 9 - this.data.pics.length,
      success: function(res) {
        console.log(res);
        let pics = _this.data.pics.concat(res.tempFilePaths);
        _this.setData({
          pics: pics
        })
      },
    })
  }
})