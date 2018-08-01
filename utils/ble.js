const utils = require("./util.js")
const knowuConfig = {
  uuid: "0000FFF0-0000-1000-8000-00805F9B34FB",
  seriveId: "00002010-0000-1000-8000-00805F9B34FB",
  characteristic: "00001092-0000-1000-8000-00805F9B34FB"
}
const protocol = {
  start:0x0a,
  end:0x0b,
  control:{
    READ: 0x01,
    WRITE: 0x02,
    READ_RESPONSE: 0x03,
    WRITE_RESPONSE: 0x123
  },
  types:{
    SWITCH: 0xc0,
    MODE: 0xc1,
    INTENSITY: 0xc2,
    CHECK: 0xc3,
    LINK: 0xc4,
    BATTERY: 0xC5
  },
  data:{
    ENABLE: 0x01,
    DISABLE: 0x00,
    MODE: [0x01,0x02,0x03,0x04],
    INTENSITY:[0x01,0x02,0x03,0x04,0x05],
    CONNECT_OFF: 0x01,
    CONNECT_WAITTING: 0x02,
    CONNECT_ON: 0x03,
    SUCCESS: 0x01,
    FAILED: 0x00
  }
}
const bleState = {
  open: false,
  findDevice: false
}
function send(deviceId,type,value,callback=()=>{}) {
  // 帧头.长度.帧位.控制位.类型.数据,结束码
  let buffer = new Uint8Array([0X0A, 0X07, 0X02, 0X02, type, value, 0X0B])
  console.log(buffer)
  wx.writeBLECharacteristicValue({
    // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
    deviceId: deviceId,
    // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
    serviceId: knowuConfig.seriveId,
    // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
    characteristicId: knowuConfig.characteristic,
    // 这里的value是ArrayBuffer类型
    value: buffer.buffer,
    complete: callback
  })
}
function open(){
  wx.openBluetoothAdapter({
    success: (res) => {
      bleState.open = true
      discover()
    },
    fail: (res) => {
      bleState.open = false
      utils.showMsg("ble.蓝牙适配启动失败", res.errMsg)
    },
    complete: (res) => {}
  })
}
function discover(){
  wx.startBluetoothDevicesDiscovery({
    services: [knowuConfig.uuid],
    allowDuplicatesKey: false,
    complete(res) {
      // {errCode: 0, errMsg: "startBluetoothDevicesDiscovery:ok", isDiscovering: true}
      if (res.isDiscovering) {
        console.log("discover success")
        console.log(res)
        wx.onBluetoothDeviceFound(function (res) {
          console.log("foundDevice")
          if(bleState.findDevice) return
          bleState.findDevice = true
          wx.stopBluetoothDevicesDiscovery({
            success: function (res) {
              console.log("stop success:")
              console.log(res)
          }})
          const devices = res.devices
          wx.createBLEConnection({
            // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接 
            deviceId: devices[0].deviceId,
            success: function (res) {
              // wx.closeBLEConnection(OBJECT)
              wx.notifyBLECharacteristicValueChange({
                state: true, // 启用 notify 功能
                // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接  
                deviceId: devices[0].deviceId,
                // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
                serviceId: knowuConfig.seriveId,
                // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
                characteristicId: knowuConfig.characteristic,
                success: function (res) {
                  console.log('notifyBLECharacteristicValueChange success', res.errMsg)
                }
              })
            }
          })
        })
      }
    }
  })
}
module.exports = {
  bleState,
  init: function(){
    wx.onBluetoothAdapterStateChange(this._onStateChange)    
    open()
  },
  discover,
  close(){
    wx.closeBluetoothAdapter({
      success: (res) => {
        console.log("ble.蓝牙适配器断开成功:%s", res.errMsg)
      },
      fail: (res) => {
        console.log("ble.蓝牙适配器断开失败:%s", res.errMsg)
      },
      complete: (res) => { }
    })
  },
  // 蓝牙状态改变
  _onStateChange(res){
    console.log("ble.onBluetoothAdapterStateChange:")
    console.log(res)
    //{available: false, discovering: false}
    if (res.available) {
    }
  },
  send,
  protocol
}