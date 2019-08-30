### OrderlyScroll 

[Example](https://winfredwyw.github.io/orderly-scroll/)，OrderlyScroll 函数， 引入该库后可使用

### 开始使用

```
new OrderlyScroll(opts)
```

示例
```
new OrderlyScroll({
  target: document.getElementById('content'),
  interval_distance: 220
})
```

参数 opts 配置

- targe: Dom 内容支持滚动的 Dom 对象
- interval_distance: Number 滚动间隔值
- isX: Boolean 是否横向滚动，默认 false

### 实例方法

通过 OrderlyScroll 创建的实例。提供的方法


- destroy: Function 销毁实例



