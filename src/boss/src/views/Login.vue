<template>
  <div class="login_class">
    <div class="login_wrap">

      <div class="login_body">
        <div class="login_title">
          <span />
          老板电器新零售系统
        </div>
        <div class="login_img" />
        <div class="login_panel">
          <div class="panel_icon">
            <img src="../assets/images/login_icon.png" alt="">
          </div>
          <div class="panel_phone">
            <input v-model.number="phoneNumber" type="text" placeholder="请输入手机号/邮箱" @input="checkPhone">
          </div>
          <div class="phone_log" :class="{ hidden:is_phone }">
            <img src="../assets/images/warn_icon.png" alt="">
            {{ warning_info }}
          </div>
          <div class="panel_check">
            <input v-model="checkNumber" type="text" placeholder="验证码" @input="isCodeNan">
            <button @click="countdown">{{ isCounting?count:'验证码' }}</button>
          </div>
          <div class="check_log" :class="{ hidden:is_checked }">
            <img src="../assets/images/warn_icon.png" alt="">
            {{ is_checked?"":"验证码错误" }}
          </div>
          <div class="panel_login">
            <button class="login_btn" @click="login">登录</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import libsApi from '@/api/urls/api'

export default {
  data() {
    return {
      phoneNumber: null, // 手机号
      checkNumber: null, // 验证码
      is_phone: true, // 手机号是否合法 ( 是否让警告框显示 )
      is_checked: true, // 验证码是否合法 ( 是否让警告框显示 )
      warning_info: '请输入正确的手机号',
      isCounting: false,
      count: 60
    }
  },
  created() {
    if (localStorage.getItem('user_phone')) {
      // console.log('has')
      this.$router.push('/')
    }
  },
  methods: {
    checkPhone() { // 检测手机号合法性
      this.isCounting = false
      this.count = 60
      if (JSON.stringify(this.phoneNumber).length < 11) {
        this.is_phone = true
        return
      }
      var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      if (myreg.test(this.phoneNumber)) {
        this.is_phone = true
      } else {
        this.is_phone = false
      }
    },
    isCodeNan(e) {
      if (e.target.value === '') {
        this.is_checked = false
      } else {
        this.is_checked = true
      }
    },
    login() { // 用户登录
      if (JSON.stringify(this.phoneNumber).length < 11) {
        this.showwarning('phone', '请输入正确的手机号')
        return
      }
      if (!this.checkNumber) {
        this.showwarning('check')
        return
      }

      if (this.is_phone && this.is_checked) {
        var vm = this
        libsApi.checkCode(this.phoneNumber, this.checkNumber)
          .then(res => {
            if (res.status === 200 && res.data.status_code === 200) {
              localStorage.setItem('user_phone', this.phoneNumber)
              vm.$router.push('/')
            } else {
              // console.log('failed')
            }
          })
          .catch(err => { console.log(err) })
      }
    },
    countdown($event) { // 验证码倒计时
      if (JSON.stringify(this.phoneNumber).length < 11) {
        this.showwarning('phone', '请输入正确的手机号')
        return
      }
      if (this.isCounting) return
      //   this.getCode()
      libsApi.getCode(this.phoneNumber)
      this.isCounting = true
      var vm = this
      var timer = setInterval(function() {
        if (vm.count >= 1) {
          vm.count = vm.count - 1
        } else {
          vm.count = 60
          vm.isCounting = false
          window.clearInterval(timer)
        }
      }, 1000)
    },
    showwarning(type, info) {
      var flag = this
      if (type === 'phone') {
        flag.warning_info = info
        flag.is_phone = false
      } else {
        flag.is_checked = false
      }
    }
  }
}
</script>
<style  lang="scss">
.login_class{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .login_wrap{
        width: 100%;
    }
    .login_body{
        position: relative;
        border: 2px solid rgba(112, 202, 255, 1);
        border-radius: 16px;
        width: 60%;
        min-width: 800px;
        max-width: 1000px;
        margin: 0 auto;
        height: 408px;
        // overflow: hidden;
        box-shadow: 0 0 15px #007cc5;
        .login_title{
            position: absolute;
            top: -45px;
            left: 0;
            span{
                border: 5px solid rgba(24, 144, 255, 1);
                margin-right: 14px;
            }
            margin-bottom: 15px;
            height: 40px;
            text-align: left;
            font-size: 28px;
            color:#FFFFFF;
            line-height: 40px;
        }
        .login_img{
            float: left;
            // width: 736px;
            width: 65%;
            height: 100%;
            background-image: url(../assets/images/login.png);
            background-size: 100% 100%;
        }
        .login_panel{
            float: left;
            // width: 358px;
            border-top-right-radius: 16px;
            border-bottom-right-radius: 16px;
            width: 35%;
            height: 100%;
            background-color: rgba(0, 63, 103, 0.92);
            .panel_icon{
                margin-top: 46px;
            }
            .panel_phone{
                margin-top: 39px;
                input{
                    font-size: 16px;
                    color: #FFFFFF;
                    padding: 13px;
                    padding-left: 18px;
                    outline: none;
                    width: 242px;
                    height:20px;
                    background:rgba(255,255,255,0.16);
                    border-radius:8px;
                    border:2px solid rgba(112,202,255,0.15)
                }
            }
            .phone_log{
                // opacity: 0;
                img{
                    margin-right: 8px;
                }
                width: 270px;
                margin: 0 auto;
                text-align: left;
                color: rgba(255, 26, 46, 1);
                font-size: 17px;
                padding-top: 4px;
                padding-bottom: 4px;
            }
            .panel_check{
                input{
                    font-size: 16px;
                    color: #FFFFFF;
                    width: 132px;
                    height:20px;
                    padding: 13px;
                    padding-left: 18px;
                    outline: none;
                    margin-right: 10px;
                    background:rgba(255,255,255,0.16);
                    border-radius:8px;
                    border:2px solid rgba(112,202,255,0.15)
                }
                button{
                    width: 100px;
                    outline: none;
                    cursor: pointer;
                    height:46px;
                    background:rgba(24,144,255,1);
                    box-shadow:0px 2px 10px 0px rgba(0,0,0,0.08);
                    border-radius:8px;
                    border: none;
                    color: #FFFFFF;
                }
            }
            .check_log{
                 img{
                    margin-right: 8px;
                }
                width: 270px;
                margin: 0 auto;
                text-align: left;
                color: rgba(255, 26, 46, 1);
                font-size: 17px;
                padding-top: 4px;
                padding-bottom: 4px;
            }
            .panel_login{
                margin-top: 35px;
                .login_btn{
                    width: 270px;
                    outline: none;
                    cursor: pointer;
                    height:46px;
                    background:rgba(24,144,255,1);
                    box-shadow:0px 2px 10px 0px rgba(0,0,0,0.08);
                    border-radius:8px;
                    border: none;
                    color: #FFFFFF;
                }
            }

        }
    }
}
.hidden{
    opacity: 0;
}
</style>

