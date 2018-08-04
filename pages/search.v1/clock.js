let ctx = {}
let height = '300'
let width = '300'
let offset = 100
let dimension = {
  innerR: 0,
  outerR: 0,
  scale: 120
}
let style = {
  primary: '#FC9E8D',
  grey: '#DBD9D8'
}

module.exports = {
  init() {
    ctx = wx.createCanvasContext('clock');
    height = '300'
    width = '300'
    dimension.innerR = '80'
    // 设置文字对应的半径
    dimension.outerR = width / 2 - 45
    // 把原点的位置移动到屏幕中间，及宽的一半，高的一半
    ctx.translate(width / 2, height / 2)
    ctx.rotate(-Math.PI/2)
  },
  // 画外框
  drawInnerCircle() {
    ctx.setLineWidth(1)
    // arc(x,y,半径,起始位置，结束位置，false为顺时针运动)
    ctx.arc(0, 0, dimension.innerR, 0, 2 * Math.PI, false);
    // 描出点的路径
    ctx.setStrokeStyle(style.grey);
    ctx.stroke();
  },
  // 画外围矩形
  drawdots() {
    const rw = 2, rh = 8,rwh = 3, rhh = 12
    ctx.lineJoin = "round"
    ctx.lineWidth = 2
    for (let i = 0; i < dimension.scale; i++) {
      var rad = 2 * Math.PI / dimension.scale * i
      var x = (dimension.outerR + 15) * Math.cos(rad)
      var y = (dimension.outerR + 15) * Math.sin(rad)
      rad = rad + 0.5 * Math.PI
      ctx.beginPath()
      ctx.translate(x, y)
      ctx.rotate(rad)
      if(i<=offset)
        ctx.setFillStyle(style.primary)
      else
        ctx.setFillStyle(style.grey)

      if (i === 0) {
        ctx.fillRect(-0.5 * rwh, -0.5 *rhh,rwh,rhh)
      } else {
        ctx.fillRect(-0.5 * rw, -0.5 *rh,rw,rh)
      }
      if(i==offset){
        ctx.drawImage('/assets/image/pick.png', 20, 20)

      }
      ctx.rotate(-rad)
      ctx.translate(-x, -y)
      ctx.fill();
    }
    ctx.closePath();
  },
  // 画秒针
  drawSecond(second, msecond) {
    ctx.save();
    ctx.beginPath();
    // 根据秒数确定大的偏移
    var rad = 2 * Math.PI / 60 * second;
    // 1000ms=1s所以这里多除个1000
    var mrad = 2 * Math.PI / 60 / 1000 * msecond;
    ctx.rotate(rad + mrad);
    ctx.setLineWidth(4);
    // 设置线条颜色为红色，默认为黑色
    ctx.setStrokeStyle('red');
    ctx.setLineCap('round');
    ctx.moveTo(0, 12);
    ctx.lineTo(0, - dimension.outerR);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  },
  //画出中间那个灰色的圆
  drawDot() {
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, 2 * Math.PI, false);
    ctx.setFillStyle('lightgrey');
    ctx.fill();
    ctx.closePath();
  },

  run() {
    // 实时获取各个参数
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes()
    var second = now.getSeconds();
    var msecond = now.getMilliseconds();
    // 依次执行各个方法
    this.drawInnerCircle();
    this.drawdots();
    this.drawSecond(second, msecond);
    this.drawDot();
    // 微信小程序要多个draw才会画出来，所以在最后画出
    ctx.draw();
  }
}