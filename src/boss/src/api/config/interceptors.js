import axios from 'axios'
import baseUrl from './baseUrl'
// import store from '@/store';

const instance = axios.create({
  baseURL: baseUrl,
  timeout: 10000 // 请求超时
})
// 请求响应前
instance.interceptors.request.use(
  config => {
    // console.log(config)
    // store.commit('AJAX_RESPONSE');
    // console.log('开始请求')
    return config
  },
  err => {
    setTimeout(() => {
      // store.commit('AJAX_RESPONSE');
      return Promise.reject(err)
    }, 200)
  }
)
// 请求响应后
instance.interceptors.response.use(
  response => {
    // console.log(response)
    if (response.status === 200) {
      //    store.commit('AJAX_RESPONSE');
      return response
    } else {
      //    store.commit('AJAX_RESPONSE')
      return Promise.reject(response.data)
    }
  }
)

export default instance
