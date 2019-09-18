import axios from 'axios'
// import baseUrl from './baseUrl'

const instance = axios.create({
  baseURL: 'http://robam-server.test.kulchao.com',
  timeout: 10000 // 请求超时
})
instance.interceptors.request.use(
  config => {
    return config
  },
  err => {
    setTimeout(() => {
      return Promise.reject(err)
    }, 200)
  }
)
instance.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return response
    } else {
      return Promise.reject(response.data)
    }
  }
)

export default instance
