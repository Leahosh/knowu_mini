const utils = require("./util.js")
const knowuConfig = {
  uuid: "0000FFF0-0000-1000-8000-00805F9B34FB",
  seriveId: "00002010-0000-1000-8000-00805F9B34FB",
  characteristic: "00001092-0000-1000-8000-00805F9B34FB"
}
const protocol = {
  start: 0x0a,
  end: 0x0b,
  control: {
    READ: 0x01,
    WRITE: 0x02,
    READ_RESPONSE: 0x03,
    WRITE_RESPONSE: 0x123
  },
  types: {
    SWITCH: 0xc0,
    MODE: 0xc1,
    INTENSITY: 0xc2,
    CHECK: 0xc3,
    LINK: 0xc4,
    BATTERY: 0xC5
  },
  data: {
    ENABLE: 0x01,
    DISABLE: 0x00,
    MODE: [0x01, 0x02, 0x03, 0x04],
    INTENSITY: [0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f],
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
function send(deviceId, type, value, callback = () => { },mode = protocol.control.WRITE) {
  // 帧头.长度.帧位.控制位.类型.数据,结束码
  let buffer = new Uint8Array([0X0A, 0X07, 0X02, mode, type, value, 0X0B])
  console.log(`send:[${buffer}] to:[${deviceId}]`)
  wx.writeBLECharacteristicValue({
    deviceId: deviceId,
    serviceId: knowuConfig.seriveId,
    characteristicId: knowuConfig.characteristic,
    value: buffer.buffer,
    complete: (res) => {
      console.log(`send:[${buffer.toString()}],response:${JSON.stringify(res)}`)
      callback(res)
    }
  })
}
function open() {
  wx.openBluetoothAdapter({
    success: (res) => {
      bleState.open = true
    },
    fail: (res) => {
      bleState.open = false
      console.log(`蓝牙适配打开失败:${JSON.stringify(res.errMsg)}`)
      utils.showMsg("提示", "请先打开手机蓝牙！")
    },
    complete: (res) => { }
  })
}
function connect(deviceId,stateCallback=()=>{},battery=()=>{}) {
  wx.createBLEConnection({
    deviceId: deviceId,
    success: function (res) {
      console.log(`连接设备成功：${JSON.stringify(res)}`)
      // todo 准备删除的代码
      wx.getBLEDeviceServices({
        deviceId: deviceId,
        fail: function (res) {
          wx.showModal({
            title:'服务发现错误',
            content:JSON.stringify(res)
          })
        }
      })
      wx.notifyBLECharacteristicValueChange({
        // 启用 notify 功能
        state: true,
        deviceId: deviceId,
        serviceId: knowuConfig.seriveId,
        characteristicId: knowuConfig.characteristic,
        success: function (res) {
          console.log('设置特征值监听：' + JSON.stringify(res.errMsg))
          send(deviceId,protocol.types.BATTERY,protocol.data.NONE,()=>{},protocol.control.READ)
          bleState.intervalId = setInterval(()=>{
            send(deviceId,protocol.types.BATTERY,protocol.data.NONE,()=>{},protocol.control.READ)
          },10000)
          // 添加电源监听
          wx.onBLECharacteristicValueChange(function (res) {
            //0a 07 02 03 c5 46 0b
            const data = new Uint8Array(res.value)
            const mType = data[4]
            const value = data[5]
            console.log(`msgTye=${mType},battery=${value}`)
            if(mType===0xc5 && battery){
              battery(value)
            }
          })
        }
      })
    },
    complete:(res)=>{
      console.log(`连接结果回调：${JSON.stringify(res)}`)
      stateCallback && stateCallback(...(res.available?[1,'连接成功！']:[-1,'连接失败！']))
    }
  })
}
function discover(callback=()=>{}) {
  wx.startBluetoothDevicesDiscovery({
    services: [knowuConfig.uuid],
    allowDuplicatesKey: false,
    complete(res) {
      if (res.isDiscovering) {
        console.log("begin discover!")
        wx.onBluetoothDeviceFound(function (res) {
          console.log("foundDevice")
          if (bleState.findDevice) return
          bleState.findDevice = true
          wx.stopBluetoothDevicesDiscovery({
            success: function (res) {
              console.log("stop success:")
              console.log(res)
            }
          })
          const devices = res.devices
          // 连接设备
          callback(devices[0].deviceId)
        })
      }
    }
  })
}
module.exports = {
  bleState,
  init: function () {
    wx.onBluetoothAdapterStateChange(this._onStateChange)
    open()
  },
  discover,
  connect,
  close() {
    wx.closeBluetoothAdapter({
      success: (res) => {
        console.log("蓝牙适配器断开成功:%s", res.errMsg)
      },
      fail: (res) => {
        console.log("蓝牙适配器断开失败:%s", res.errMsg)
      },
      complete: (res) => { }
    })
  },
  // 蓝牙状态改变
  _onStateChange(res) {
    console.log(`蓝牙状态改变${JSON.stringify(res)}`)
    if (res.available) {
      // todo 
      
      // open()
    }
  },
  send,
  protocol
}