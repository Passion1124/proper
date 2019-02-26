const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    list: ['密码、用户名忘记了，无法登录怎么办？', '如何成为TTD会员？', '什么是TTD优惠券？', '优惠券会过期吗？', '什么是收藏优惠券，为什么我要收藏优惠券？', '如何使用优惠券？', '优惠券金额会显示在发票里面吗？', '优惠券无法使用怎么办？', '优惠券的使用规则？', '如何查询优惠券信息？', '预订流程介绍', '预订问题', '付款成功后还有什么要做的？', '如何查看订单？', '订单支付方式', '如何申请退款？', '如何判断所购买商品是否支持退改？', '客服中心热线', '如何索要发票?', '如何进行投诉及意见建议？'],
    list_detail: [
      ['如果您的账户已经和Email或者手机绑定，可以在“登录”界面填写用户名/手机号/邮箱，然后点击“忘记密码？”，并在新界面中输入验证码点击“提交”；', '在新页面中，点击对应的重置按钮，系统会将验证密码或邮件直接发送到手机上或邮箱中；', '手机验证时，在页面中输入短信里的验证码；邮箱验证时，点击邮件中的确认链接，最终需要您设定新的密码。', '手机验证时，在页面中输入短信里的验证码；邮箱验证时，点击邮件中的确认链接，最终需要您设定新的密码。'],
      ['您可以通过以下方法来注册：', 'A．通过访问手机客户端TTD APP，使用手机号码注册。按照指示完成注册操作', 'B.通过微信关联注册'],
      ['优惠券是TTD发行的，用户通过购买或免费领取方式获取，可冲抵TTD特定产品部分订单金额的优惠产品。每张订单中优惠券只可使用一次，不可找零，不能兑换现金。购物优惠券按照使用属性和规定使用日期使用。优惠券适用于TTD的某些特定产品或特定站点。具体细则可在“我的”-“我的优惠券”中查看或对应的领取页面上查看。'],
      ['优惠券都是有期限的，优惠券具体有效期可在“我的”-“我的优惠券”中查看或对应的领取页面上查看。'],
      ['TTD的优惠券会不定期更新，为了方便使用和记忆，您可以登录“我的”-“我的优惠券”中查看优惠券的。', '如果是单次券，被一个账户收藏过的优惠券不能再被其他账户收藏。'],
      ['优惠券一般适用于该券指定的TTD产品，建议您先查看、了解优惠券的适用范围和优惠说明。如您的订单已完成支付，后续无法追加使用优惠券'],
      ['优惠券属于消费奖励，发票金额只会体现实际支付金额。'],
      ['1.有可能您预订的产品不在优惠券使用范围内；', '2.优惠券分公共券和单次券两种，单次券在有效期内只能使用一次，使用后状态为【已使用】；', '3.每张订单中只可使用一张优惠券，不支持多张；', '4.优惠券都是有期限的，建议您关注一下有效期，请在有效期内使用您的优惠券；', '5.部分优惠券是有使用限制的，请确认您的账户、设备、手机号、订单金额符合该优惠券的使用规则。 如需帮助可以直接致电******，由专员为您服务'],
      ['在“我的-优惠券”里，可以查看优惠券的使用细则。'],
      ['您可在具体领取页面或“我的”-“我的优惠券”中查看您的优惠券信息（包含优惠代码，优惠金额、优惠说明、适用范围、有效期等）。'],
      ['第一步：选择产品；', '第二步：填写订单 ；', '第三步：支付 ：', '第四步：预订成功'],
      ['我看了线路/门票/订餐，需要预订，该怎么办？ 可以直接在我们的app上面直接选择需要预订的产品，进行预订。或者直接致电*******，将有专线的客服为例解答和帮助处理预订'],
      ['请等待TTD客服给您发预订成功的短信通知，请保持手机开机状态'],
      ['进入“我的”---‘全部订单’中查看'],
      ['为了您的交易安全，目前我们主要支持具有相应安全保障的第三方支付平台提供的交易方式： 微信支付、支付宝。'],
      ['对于支持退款的商品，且在可以退款的期限内，用户可以在“我的订单”里找到相应的订单并申请退款。 退款申请一旦被我们确认后（即确认可退），退款金额将原路返回， 预计3至7个工作日到账。'],
      ['购买商品前请查看商品详情页面的退改政策，不可退的商品，一旦确认则不可退改。 随时退的商品，只要经确认未使用则随时可退。限时退的商品，根据退款的时间点的不同会有不同的退改标准。'],
      ['如果你对我们在使用我们的APP中遇到问题，可以随时联系我们的客服中心：**********，会有专人帮你处理问题'],
      ['请致电TTD客服*********或者添加TTD客服微信公众号“*****”进行反馈，我们将尽快为您处理。'],
      ['您可以在‘我的’--‘意见反馈’ 留下您宝贵意见，或者致电TTD客服********或者添加TTD客服微信公众号“********”，我们将尽力为您解决问题。']
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      index: parseInt(options.index)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})