// pages/search.v1/search.js
const ble = require('../../utils/ble.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgs: {
      mode1_on: '/assets/image/search_mode11.png',
      mode1_off: '/assets/image/search_mode10.png',
      mode2_on: '/assets/image/search_mode21.png',
      mode2_off: '/assets/image/search_mode20.png',
      mode3_on: '/assets/image/search_mode31.png',
      mode3_off: '/assets/image/search_mode30.png',
      mode4_on: '/assets/image/search_mode41.png',
      mode4_off: '/assets/image/search_mode40.png'
    },
    state: {
      mode: 1,
    }
  },
  // 设置模式
  setMode(event) {
    if (!ble.bleState.findDevice) {
      wx.showToast({
        icon: 'none',
        title: '尚未找到设备！',
        duration: 2000
      })
      return
    }
    // todo 设置模式
    const state = this.data.state
    state.mode = event.currentTarget.dataset.mode
    this.setData({
      state
    })
  },
  changeIntensity(event) {
    // todo 设置强度
    console.log(event.detail.value)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.onBLEConnectionStateChange(function(res){
      console.log("connect state change:")
      console.log(res)
    })
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

  }
})