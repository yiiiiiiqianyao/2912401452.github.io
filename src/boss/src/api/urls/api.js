import ajax from '../../utils/http'
// import getUrlParam from '../../assets/commen/getUrlParam'

// 发送验证码
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
  getCommodity(phoneNumber) {
    return ajax({
      method: 'get',
      url: 'api/commodity',
      data: {
        phone: phoneNumber
      }
    })
  },
  sendCode(phoneNmuber) {
    return ajax({
      method: 'get',
      url: 'api/sms_code',
      data: {
        phone: phoneNmuber
      }
    })
  },
  postAnswers(application_id, phone, answers, st_time, source_type) {
    return ajax({
      method: 'post',
      url: 'api/answers',
      data: {
        application_id: application_id,
        phone: phone,
        answers: answers,
        st_time: st_time,
        source_type: source_type
      }
    })
  },

  getCurrentTime() {
    return ajax({
      method: 'get',
      url: 'api/current_time'
    })
  }
}

export default libsApi
