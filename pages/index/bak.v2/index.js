//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    desc: '欢迎使用女有小程序！',
    name: 'knowu',
    logoUrl: '/assets/image/logo.png',
  },
  onLoad: function () {
    setTimeout(()=>{
      wx.redirectTo({
        url: '/pages/search.v1/search'
      })
    },3000)
    console.log(app)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else {
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
