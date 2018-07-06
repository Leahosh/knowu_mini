//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log("globalData:")              
              console.log(this.globalData)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onError: function(err){
    // todo 
  },
  // path	String	不存在页面的路径
  // query	Object	打开不存在页面的 query
  // isEntryPage	Boolean	是否本次启动的首个页面（例如从分享等入口进来，首个页面是开发者配置的分享页面）
  onPageNotFound: function (res){
    console.log('page not Found')
    console.log(res)
    // todo 
    // wx.redirectTo({
    //   url: 'pages/...'
    // }) // 如果是 tabbar 页面，请使用 wx.switchTab
  },
  onHide: function(){
    // todo 
  },
  onShow: function(){
    // todo
  },
  globalData: {
    userInfo: null
  }
})