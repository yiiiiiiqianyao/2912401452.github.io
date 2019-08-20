# web worker 限制
* 同源限制 分配给 Worker 线程运行的脚本文件，必须与主线程的脚本文件同源
* DOM 限制 无法读取主线程所在网页的 DOM 对象，也无法使用document、window、parent这些对象。但是，Worker 线程可以navigator对象和location对象
* 通信联系 Worker 线程和主线程不在同一个上下文环境，它们不能直接通信，必须通过消息完成
* 脚本限制 Worker 线程不能执行alert()方法和confirm()方法，但可以使用 XMLHttpRequest 对象发出 AJAX 请求
* 文件限制 Worker 线程无法读取本地文件，即不能打开本机的文件系统（file://），它所加载的脚本，必须来自网络

# worker特性检测
```
    if (window.Worker) {
        // your code ...
    }
```

# 生成一个专用worker 调用Worker() 的构造器， 指定一个脚本的URI来执行worker线程
```
    var myWorker = new Worker('worker.js')
```

# 专用worker中消息的接收和发送  worker.js 通过postMessage() 方法和onmessage事件处理函数生效
