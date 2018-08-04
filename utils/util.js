const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const showMsg = (title, content) => {
  console.log(`title=${title},msg=${content}`)
  wx.showModal({
    title,
    content
  })
}
const debounce = function (fn, delay, immediate) {
  // fn是回调函数，delay是延迟时间，immediate是否先执行一次再节流
  var timer = null
  var _this = null
  var args = null
  return function () {
    _this = this
    args = arguments
    // 如果有定时器先清除，让定时器的函数不执行
    timer && clearTimeout(timer)
    if (immediate) {
      // 没有定时器的话，告诉后面的函数可以先执行一次，首次进入函数没有定义定时器，d为true
      var d = !timer
      // 然后在delay时间以后将timer设置为null，首次执行之后，只有在timer为null之后才会再次执行
      timer = setTimeout(function () { timer = null }, delay)
      if (d) { fn.apply(_this, args) }
    } else {
      // 如果没设置第三个参数，就是什么时候停止，之后delay时间才执行
      timer = setTimeout(function () {
        fn.apply(_this, args)
      }, delay)
    }

  }
}
module.exports = {
  formatTime: formatTime,
  showMsg,
  debounce
}
