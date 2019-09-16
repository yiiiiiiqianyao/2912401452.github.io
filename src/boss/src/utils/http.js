import instance from '../api/config/interceptors'

const ajax = (config) => {
  // 每次请求的时候都在header属性中写入token 如果不需要token验证 再配置即可
  // instance.defaults.headers['token'] = JSON.parse(localStorage.token || '');

  return new Promise((resolve, reject) => {
    instance[config.method || 'get'](
      // 参数传进来的url地址
      config.url,
      // 默认get请求 配置params对象接收参数 post请求直接写入
      (config.method || 'get') === 'get' ? { params: config.data } : config.data

    ).then(res => {
      // 成功
      resolve(res)
    }).catch(err => {
      // 失败
      reject(err)
    })
  })
}

export default ajax
