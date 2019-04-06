const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = (timestamp, join) => {
  const date = new Date(timestamp);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (month < 10) month = '0' + month;
  if (day < 10) day = '0' + day;
  return [year, month, day].map(formatNumber).join(join || '');
}

const userIsLogin = _ => {
  return new Promise((resolve, reject) => {
    let user = wx.getStorageSync('user') || '';
    if (user) {
      resolve();
    } else {
      navigateTo('/pages/signIn/signIn');
      reject();
    }
  })
}

const navigateTo = url => {
  wx.navigateTo({
    url: url,
  })
}

const redirectTo = url => {
  wx.redirectTo({
    url: url,
  })
}

const showMessage = (message, icon) => {
  wx.showToast({
    title: message,
    duration: 1500,
    icon: icon ? icon : 'none'
  })
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const validatePhone = phone => {
  let reg = new RegExp('^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$');
  return reg.test(phone);
}

const validateEmail = email => {
  let reg = new RegExp('^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$');
  return reg.test(email);
}

const reverseArray = arr => {
  return arr.reverse();
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  userIsLogin: userIsLogin,
  navigateTo: navigateTo,
  redirectTo: redirectTo,
  showMessage: showMessage,
  validatePhone: validatePhone,
  validateEmail: validateEmail,
  reverseArray: reverseArray
}
