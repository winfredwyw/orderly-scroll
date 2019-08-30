/**
 * @module 间隔滚动
 * @author Yawei Wang 
 * @date 2019-08-30 11:42:16 
 * @description
 */
function BaseOrderlScroll (config) {
  config = config || {}

  // 滚动对象
  this.target = config.target
  // 目标间隔距离
  this.interval_distance = config.interval_distance
  // 是否横向滚动
  this.isX = config.isX || false

  if (!this.target) {
    return
  }

  // 自动滚动定时器
  this.auto_scroller = null
  // 即将滚动定时器
  this.will_auto_scroller = null
  // 上次滚动位置
  this.last_scroll = 0

  this.init()

  return this
}

// 初始化入口
BaseOrderlScroll.prototype.init = function () {
  this.initMethod()
  this.bindEvent()

  if (this.isX) {
    this.initX()
  }
}

// 添加辅助方法
BaseOrderlScroll.prototype.initMethod = function () {
  var _this = this

  _this.utils = {
    // 鼠标滚动
    mousewheel: function (e) {
      e.preventDefault();
      e.stopPropagation();
  
      var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
  
      _this.target.scrollLeft += -60 * delta
    },

    willscroll: function (e) {
      clearTimeout(_this.will_auto_scroller)
  
      _this.will_auto_scroller = setTimeout(function () {
        _this.exeScroll()
      }, 20);
    }
  }
}

// 横向滚动初始化
BaseOrderlScroll.prototype.initX = function () {
  this.target.addEventListener('mousewheel', this.utils.mousewheel)
  this.target.addEventListener('DOMMouseScroll', this.utils.mousewheel)
}

// 销毁
BaseOrderlScroll.prototype.destroy = function () {
  this.target.removeEventListener('mousewheel', this.utils.mousewheel)
  this.target.removeEventListener('DOMMouseScroll', this.utils.mousewheel)
  this.target.removeEventListener('scroll', this.utils.willscroll)
}

// 基础事件绑定
BaseOrderlScroll.prototype.bindEvent = function () {
  this.target.addEventListener('scroll', this.utils.willscroll)
}

// 预滚动干预
BaseOrderlScroll.prototype.exeScroll = function () {
  clearInterval(this.auto_scroller)

  var client_size = this.target[this.isX ? 'clientWidth' : 'clientHeight']
  var scroll_size = this.target[this.isX ? 'scrollWidth' : 'scrollHeight']
  var real_scroll = this.target[this.isX ? 'scrollLeft' : 'scrollTop']

  // 额外滚动距离
  var ext_scroll = real_scroll % this.interval_distance

  if (ext_scroll === 0) {
    clearTimeout(this.will_auto_scroller)
    clearInterval(this.auto_scroller)

    return
  }


  if (real_scroll + client_size >= scroll_size) {
    return this.last_scroll = real_scroll
  }


  // 往下
  if (this.last_scroll <= real_scroll) {
    this.exeAutoScroll(real_scroll, this.interval_distance - ext_scroll, 1)
  }

  // 往上
  else if (this.last_scroll > real_scroll) {
    this.exeAutoScroll(real_scroll, ext_scroll, -1)
  }
}

// 自动执行滚动干预
BaseOrderlScroll.prototype.exeAutoScroll = function (last_top, val, dir) {
  var _this = this
  var _val = val
  var step = 20
  var step_time = 16
  var _key = this.isX ? 'scrollLeft' : 'scrollTop'

  _this.auto_scroller = setInterval(function () {
    // 执行完成，清除定时器
    if (_val <= 0) {
      clearInterval(_this.auto_scroller)
    }

    var cur_val = _val > 20 ? 20 : (_val > 0 ? _val : 0)

    _this.target[_key] = last_top + (cur_val * dir)

    last_top = _this.target[_key]
    _this.last_scroll = _this.target[_key]

    _val -= step
  }, step_time);
}

// 组合继承
function OrderlyScroll () {
  return BaseOrderlScroll.apply(this, arguments)
}

OrderlyScroll.prototype = new BaseOrderlScroll()
OrderlyScroll.prototype.constructor = OrderlyScroll

