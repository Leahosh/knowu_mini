let ctx = {}
let height = '300'
let width = '300'
let offset = 0
const dimension = {
  innerR: 0,
  outerR: 0,
  scale: 120
}
const style = {
  primary: '#FC9E8D',
  grey: '#DBD9D8'
}
const state = {
  running : false
}
module.exports = {
  init(callback=()=>{}) {
    offset = 120*30
    ctx = wx.createCanvasContext('clock')
    height = 250 || ctx._context.canvas.height
    width = 250 || ctx._context.canvas.width
    console.log('height:',height,'width:',width)
    dimension.outerR = width / 2 - 10
    dimension.innerR = dimension.outerR - 15
    state.running = false
    this.draw()
    this.clock(callback)
  },
  // 设置offset
  setOffset(scale){
    offset = Math.round(scale * dimension.scale) % dimension.scale * 30
    this.draw()
  },
  // 设置运行状态
  setRunState(run){
    state.running = run
  },
  // 定时任务
  clock(callback){
    setInterval(()=>{
      if(!state.running) return
      if(offset===0){
        state.running = false
        callback(state.running)
      }else{
        offset = offset - 1
      }
      this.draw()
    },500)
  },
  // 画内框
  drawInnerCircle() {
    ctx.setLineWidth(1)
    // arc(x,y,半径,起始位置，结束位置，false为顺时针运动)
    ctx.arc(0, 0, dimension.innerR - 10, 0, 2 * Math.PI, false)
    // 描出点的路径
    ctx.setStrokeStyle(style.grey)
    ctx.stroke()
  },
  _getTime(){
    const m = ('00'+Math.floor(offset/60)).substr(-2)
    const s = ('00'+Math.floor(offset%60)).substr(-2)
    return `${m}:${s}`
  },
  // 画外围矩形圈
  drawdots() {
    const rw = 2, rh = 8, rwh = 3, rhh = 12
    ctx.lineJoin = "round"
    ctx.lineWidth = 2
    for (let i = 0; i < dimension.scale; i++) {
      const rOffset = Math.round(offset/30);
      let rad = 2 * Math.PI / dimension.scale * i
      let x = dimension.outerR * Math.cos(rad)
      let y = dimension.outerR * Math.sin(rad)
      rad = rad + 0.5 * Math.PI
      ctx.beginPath()
      ctx.translate(x, y)
      ctx.rotate(rad)
      if (i >= rOffset)
        ctx.setFillStyle(style.grey)
      else
        ctx.setFillStyle(style.primary)
      if (i === 0) {
        ctx.fillRect(-0.5 * rwh, -0.5 * rhh, rwh, rhh)
      } else {
        ctx.fillRect(-0.5 * rw, -0.5 * rh, rw, rh)
      }
      if (i === rOffset) {
        ctx.drawImage('/assets/image/pick.png', -10, -5 + dimension.outerR - dimension.innerR, 20, 20)
      }
      ctx.rotate(-rad)
      ctx.translate(-x, -y)
      ctx.fill();
    }
    ctx.closePath();
  },
  drawTime() {
    ctx.rotate(Math.PI / 2)
    ctx.font = "normal 16px 宋体"
    ctx.fillStyle = style.primary
    let m = ctx.measureText("分   秒")
    ctx.fillText("分   秒", -m.width/2, -20)
    // 写时间
    ctx.font = "bold 50px 宋体"
    const timeStr = this._getTime()
    m = ctx.measureText(timeStr)
    ctx.fillText(timeStr, -m.width/2, 22)
    ctx.rotate(-Math.PI / 2)
  },
  draw() {
    // 把原点的位置移动到屏幕中间，及宽的一半，高的一半
    ctx.translate(width / 2, height / 2)
    ctx.rotate(-Math.PI / 2)
    this.drawInnerCircle()
    this.drawdots()
    this.drawTime()
    ctx.draw()
  }
}