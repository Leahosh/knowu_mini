// pages/search.v1/search.js
const ble = require('../../utils/ble.js')
const util = require('../../utils/util.js')
const clock = require('./clock.js')
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
      mode: 0,
      intensity: 0,
      deviceId: '',
      isSearching: false,
      isLink: false,
      running: false
    }
  },
  // 设置模式
  setMode(event) {
    if (!this.data.state.isLink) {
      wx.showToast({
        icon: 'none',
        title: '尚未找到设备！',
        duration: 2000
      })
      return
    }
    const state = this.data.state
    state.mode = event.currentTarget.dataset.mode
    this.data.state.isLink && ble.send(this.data.state.deviceId, ble.protocol.types.MODE, ble.protocol.data.MODE[state.mode])
    this.setData({
      state
    })
  },
  // 改变力度
  changeIntensity(event) {
    let value = Math.floor(event.detail.value / 100)
    if (this.data.state.intensity === value)
      return
    this.data.state.intensity = value
    if (this.data.state.isLink) {
      ble.send(this.data.state.deviceId, ble.protocol.types.INTENSITY, ble.protocol.data.INTENSITY[this.data.state.intensity])
    }
  },
  // 开关蓝牙
  switchClock(){
    const state = this.data.state
    state.running = !state.running
    clock.setRunState(state.running)
    this.setData({state})
    const sh = state.running?ble.protocol.data.ENABLE:ble.protocol.data.DISABLE
    console.log(`开关：${state.running}`)
    ble.send(state.deviceId, ble.protocol.types.SWITCH,sh)
  },
  // 设置开关
  switchSearching(event){
    const state = this.data.state
    if(event.currentTarget.dataset.mode === 'on'){
      ble.discover()
      state.isSearching = true
    }else{
      wx.stopBluetoothDevicesDiscovery({complete:(res)=>{
        state.isSearching = res.errMsg === 'ok'
        this.setData({state})
      }})
    }
    this.setData({state})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    // 连接状态改变
    wx.onBLEConnectionStateChange(function (res) {
      console.log(`connect state change:${JSON.stringify(res)}`)
      const state = that.data.state
      state.isLink = res.connected
      state.isSearching = false
      state.running = false
      if (res.connected) {
        state.deviceId = res.deviceId
        setTimeout(()=>{
          that.initBle()
        },0)
      } else {
        wx.showToast({
          icon: 'none',
          title: '设备意外断开！',
          duration: 2000
        })
      }
      that.setData({
        state
      })
    })
    ble.init()
  },
  initBle(){
    if(!this.data.state.isLink){
      return
    }
    ble.send(this.data.state.deviceId, ble.protocol.types.INTENSITY, ble.protocol.data.INTENSITY[this.data.state.intensity],()=>{
      ble.send(this.data.state.deviceId, ble.protocol.types.MODE, ble.protocol.data.MODE[this.data.mode],()=>{})
    })
  },
  touchClock(e){ 
    if(e.changedTouches.length<=0 || e.timeStamp - this._timeStamp <50 ) return
    this._timeStamp = e.timeStamp
    const touch = e.changedTouches[0]
      const offset = {
        x: touch.x - 150,
        y: touch.y - 150
      }
      clock.setOffset(util.angle({x:0,y:-60},offset)/360)
  },
  setClock(e){
    if(e.changedTouches.length<=0) return
    const touch = e.changedTouches[0]
    const offset = {
      x: touch.x - 150,
      y: touch.y - 150
    }
    clock.setOffset(util.angle({x:0,y:-60},offset)/360)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    clock.init((running)=>{
      console.log("running state:",running)
      const sh = running?ble.protocol.data.ENABLE:ble.protocol.data.DISABLE
      ble.send(this.data.state.deviceId, ble.protocol.types.SWITCH,sh)
    })
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