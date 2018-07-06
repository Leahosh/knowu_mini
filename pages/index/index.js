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
      wx.switchTab({
        url: '/pages/options/options'
      })
    },3000)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else {
      // // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // // 所以此处加入 callback 以防止这种情况
      // app.userInfoReadyCallback = res => {
      //   this.setData({
      //     userInfo: res.userInfo,
      //     hasUserInfo: true
      //   })
      // }
      // // 在没有 open-type=getUserInfo 版本的兼容处理
      // wx.getUserInfo({
      //   success: res => {
      //     app.globalData.userInfo = res.userInfo
      //     this.setData({
      //       userInfo: res.userInfo,
      //       hasUserInfo: true
      //     })
      //   }
      // })
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