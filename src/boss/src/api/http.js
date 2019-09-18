import instance from './config/interceptors'

const ajax = (config) => {
  return new Promise((resolve, reject) => {
    instance[config.method || 'get'](
      config.url,
      (config.method || 'get') === 'get' ? { params: config.data } : config.data

    ).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

export default ajax
