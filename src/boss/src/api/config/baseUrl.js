const NODE_ENV = process.env.NODE_ENV
let baseUrl = ''

if (NODE_ENV === 'production') {
  if (process.env.VUE_APP_FLAG === 'pro') {
    // 正式环境
    baseUrl = 'http://robam-server.kulchao.com'
  } else {
    // 测试环境
    baseUrl = 'http://robam-server.test.kulchao.com'
  }
} else {
  // 本地环境
  baseUrl = 'http://robam-server.kulchao.com'
}

export default baseUrl
