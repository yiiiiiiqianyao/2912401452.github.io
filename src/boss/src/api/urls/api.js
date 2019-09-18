import ajax from '@/api/http'
const libsApi = {
  getCode(phoneNumber) {
    return ajax({
      method: 'get',
      url: 'api/verify/code',
      data: {
        phone: phoneNumber
      }
    })
  },
  checkCode(phoneNumber, checkNumber) {
    return ajax({
      method: 'post',
      url: 'api/verify/code/check',
      data: {
        phone: phoneNumber,
        code: checkNumber
      }
    })
  },
  getCommodity(phoneNumber) { // 获取商品列表
    return ajax({
      method: 'get',
      url: 'api/commodity',
      data: {
        phone: phoneNumber
      }
    })
  },
  getCommodityDetail(groupId, phoneNumber) { // 获取指定商品的详细信息
    return ajax({
      method: 'get',
      url: 'api/commodity/' + groupId,
      data: {
        phone: phoneNumber
      }
    })
  },
  getCommodityFilter(spxxfl2, phoneNumber) {
    return ajax({
      method: 'get',
      url: 'api/commodity',
      data: {
        phone: phoneNumber,
        spxxfl2: spxxfl2
      }
    })
  },
  categories(phoneNumber) { // 获取商品分类列表
    return ajax({
      method: 'get',
      url: 'api/commodity/categories',
      data: {
        phone: phoneNumber
      }
    })
  }
}

export default libsApi
