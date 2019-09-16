<template>
  <div class="show_wrap">

    <div id="all">
      <div id="main">
        <div id="list">
          <ul />
        </div>
      </div>
    </div>
    <Btnlist :current-mode="currentMode" @sun_event="sun_event" />
    <div id="red_pocket">
      <div class="box">
        <img
          class="close_icon"
          src="../assets/images/close.png"
          alt=""
          @click="close_red_pocket"
        >
        <img class="red_bg" src="../assets/images/red_wrap.png" alt="">
        <div id="qrcode" />
      </div>
    </div>
    <div id="alert_box">
      <Alertcontent :alert-option="alertOption" @close_alert="close_alert" />
    </div>
    <div id="banner_box">
      <Banner :banner-list="bannerList" @close_banner="close_banner" />
    </div>
  </div>
</template>
<script>

import libsApi from '@/api/urls/api'
import QRCode from 'qrcode2'
import Btnlist from '../components/Btnlist'
import Alertcontent from '../components/Alertcontent'
import Banner from '../components/Banner'

export default {
  data() {
    return {
    //   bgUrl: 'url(../assets/images/bg.jpg)',
      bg_img_list: [], // 背景图列表
      bg_index: 0, // 当前背景图的下标
      magic: null, // 动画效果实例对象
      ainimate_timer: null, // 动画巡航循环控制器
      is_auto: true, // 当前页面的动画是否在巡航
      is_full_screen: false, // 当前页面是否全屏
      animate_type: ['grid', 'helix', 'small_grid', 'small_helix'], // 动画类别
      currentMode: 'Grid', // 当前的动画类别
      animate_index: 0, // 当前动画编号
      red_pocket_address: '', // 当前页面红包二维码的地址
      img_list: [], // 加载的商品列表信息
      alertOption: { // 弹出框的信息对象
        img_index: null,
        product_list: [
          {
            spxxpp: '',
            lsprice: '',
            originalprice: '',
            images: [
              {
                zsjurlsmall: ''
              }
            ],
            detailimages: [{ picurl: '' }]
          }
        ]
      },
      size: { // 动画元素的尺寸
        big: 125,
        small: 48
      },
      bannerList: []
    }
  },
  // eslint-disable-next-line
    components:{QRCode,Btnlist,Alertcontent,Banner},
  created() {
    this.img_list = [
      // {
      //     src:"images/products/1.jpg",
      //     has_icon:true,
      //     icon:"images/products/icon/1.png"
      // },
      // {
      //     src:"images/products/2.png",
      //     has_icon:false,
      // },
      // {
      //     src:"images/products/3.jpg",
      //     has_icon:true,
      //     icon:"images/products/icon/2.png"
      // },
      // {
      //     src:"images/products/4.jpg",
      //     has_icon:false,
      // },
      // {
      //     src:"images/products/5.png",
      //     has_icon:true,
      //     icon:"images/products/icon/3.png"
      // },
      // {
      //     src:"images/products/6.png",
      //     has_icon:true,
      //     icon:"images/products/icon/4.png"
      // }
    ]
    this.bg_img_list = [
      'images/bg.jpg',
      'images/bg2.jpg',
      'images/bg3.jpg',
      'images/bg4.jpg',
      'images/bg5.jpg'
    ]
    document.body.style.backgroundImage = `url(${this.bg_img_list[0]})`
    this.red_pocket_address = 'https://www.baodu.com'

    const userPhone = localStorage.getItem('user_phone')
    if (userPhone === 'null' || userPhone === '') {
      this.$router.push('/login')
      return
    } else {
      const vm = this
      libsApi.getCommodity(localStorage.getItem('user_phone'))
        .then(res => {
          if (res.status === 200 && res.data.status_code === 200) {
            console.log(res.data.data)
            var imgs = res.data.data.commodities
            vm.img_list = []
            for (var i = 0; i < imgs.length; i++) {
              vm.img_list.push({
                src: imgs[i].img,
                groupid: imgs[i].groupid,
                has_icon: false
              })
            }
            console.log(vm.img_list)
            vm.red_pocket_address = res.data.data.organization.orgqrcode
            vm.init()
            vm.qrcodeScan()
            vm.bannerList = res.data.data.activities.activityinfo
          } else {
            console.log('failed')
          }
        })
        .catch(err => {
          console.log(err)
        })
    //   this.axios.get('/h/api/commodity?phone=' + localStorage.getItem('user_phone'))
    //     .then(res => {
    //       if (res.status === 200 && res.data.status_code === 200) {
    //         console.log(res.data.data)
    //         var imgs = res.data.data.commodities
    //         vm.img_list = []
    //         for (var i = 0; i < imgs.length; i++) {
    //           vm.img_list.push({
    //             src: imgs[i].img,
    //             groupid: imgs[i].groupid,
    //             has_icon: false
    //           })
    //         }
    //         console.log(vm.img_list)
    //         vm.red_pocket_address = res.data.data.organization.orgqrcode
    //         vm.init()
    //         vm.qrcodeScan()
    //         vm.bannerList = res.data.data.activities.activityinfo
    //       } else {
    //         console.log('failed')
    //       }
    //       // vm.init()
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     })
    }
  },
  mounted() {

    // this.init()
    // this.qrcodeScan()
  },
  methods: {
    set_backface_visiable() {
      var list = document.querySelectorAll('#list li')
      list.forEach(function(element) {
        element.style.backfaceVisibility = 'visible'
      })
    },
    set_backface_unvisiablb() {
      var list = document.querySelectorAll('#list li')
      list.forEach(function(element) {
        element.style.backfaceVisibility = 'hidden'
      })
    },
    sun_event($event) { // 接受来自边缘按钮的动作
      if ($event.type === 'back') {
        localStorage.setItem('user_phone', '')
        this.$router.push('/login')
      } else if ($event.type === 'auto') {
        if (this.is_auto) {
          cancelAnimationFrame(this.ainimate_timer)
        } else {
          this.ainimate_timer = this.rotate_scene()
        }
        this.is_auto = !this.is_auto
      } else if ($event.type === 'full_screen') { // full_screen
        if (!this.is_full_screen) {
          var el = document.documentElement
          var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen
          if (typeof rfs !== 'undefined' && rfs) {
            rfs.call(el)
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen()
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen()
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
          }
          // if(typeof cfs != "undefined" && cfs) {
          //     cfs.call(el);
          // }
        }
        this.is_full_screen = !this.is_full_screen
      } else if ($event.type === 'bg_change') {
        this.bg_index++
        if (this.bg_index > this.bg_img_list.length - 1) {
          this.bg_index = 0
        }
        document.body.style.backgroundImage = `url(${this.bg_img_list[this.bg_index]})`
      } else if ($event.type === 'style_change') {
        const vm = this
        const raduis = document.getElementById('main').clientWidth
        switch (vm.animate_index) {
          case 0: // grid -> helix
            vm.magic.oUlZ = -raduis * 1.3
            vm.currentMode = 'Helix'
            vm.magic.helix()
            vm.set_backface_unvisiablb()
            vm.animate_index = 1
            break
          case 1: // helix -> grid
            vm.magic.oUlZ = -raduis * 1.3
            vm.currentMode = 'Grid'
            vm.magic.grid()
            vm.set_backface_visiable()
            vm.animate_index = 0
            break
          case 2: // small_grid -> small_helix
            vm.magic.oUlZ = -raduis * 0.8
            vm.currentMode = 'Small_Helix'
            vm.magic.small_helix()
            vm.set_backface_unvisiablb()
            vm.animate_index = 3
            break
          case 3: // small_helix -> small_grid
            // this.currentMode = "Small_Grid"
            vm.magic.oUlZ = -raduis * 1.3
            vm.currentMode = 'Grid'
            // this.magic.small_grid()
            vm.magic.grid()
            vm.set_backface_visiable()
            vm.animate_index = 1
            break
        }
        vm.magic.oUl.style.transform = 'translate3D(0px,0px,' + vm.magic.oUlZ +
                                                    'px) rotateX(' + vm.magic.rotateX +
                                                    'deg) rotateY(' + vm.magic.rotateY + 'deg)'
      } else if ($event.type === 'actives') {
        const wrap = document.getElementById('banner_box')
        wrap.style.top = '0'
        wrap.style.left = '0'
        wrap.style.width = '100%'
        wrap.style.height = '100%'
      } else if ($event.type === 'red_pocket') {
        const wrap = document.getElementById('red_pocket')
        wrap.style.top = '0'
        wrap.style.left = '0'
        wrap.style.width = '100%'
        wrap.style.height = '100%'
      } else if ($event.type === 'size_change') {
        const vm = this
        const raduis = document.getElementById('main').clientWidth
        switch (vm.animate_index) {
          case 0: // grid -> small_grid
            vm.magic.oUlZ = -raduis * 0.8
            vm.currentMode = 'Small_Grid'
            vm.magic.small_grid()
            vm.set_backface_visiable()
            vm.animate_index = 2
            break
          case 1: // helix -> small_helix
            vm.magic.oUlZ = -raduis * 0.8
            vm.currentMode = 'Small_Helix'
            vm.magic.small_helix()
            vm.set_backface_unvisiablb()
            vm.animate_index = 3
            break
          case 2: // small_grid -> grid
            vm.magic.oUlZ = -raduis * 1.3
            vm.currentMode = 'Grid'
            vm.magic.grid()
            vm.set_backface_visiable()
            vm.animate_index = 0
            break
          case 3: // small_helix -> helix
            vm.magic.oUlZ = -raduis * 1.3
            vm.currentMode = 'Helix'
            vm.magic.helix()
            vm.set_backface_unvisiablb()
            vm.animate_index = 1
            break
        }
        vm.magic.oUl.style.transform = 'translate3D(0px,0px,' + vm.magic.oUlZ +
                                                    'px) rotateX(' + vm.magic.rotateX +
                                                    'deg) rotateY(' + vm.magic.rotateY + 'deg)'
      }
    },
    rotate_scene() { // 页面动画自动旋转
      var vm = this
      vm.magic.rotateY += 0.09
      vm.magic.oUl.style.transform = 'translate3D(0px,0px,' + vm.magic.oUlZ +
                                            'px) rotateX(' + vm.magic.rotateX +
                                            'deg) rotateY(' + vm.magic.rotateY + 'deg)'
      vm.ainimate_timer = requestAnimationFrame(vm.rotate_scene)
    },
    init() { // 初始化页面的效果
      var main_ele = document.getElementById('main')
      var radius = main_ele.clientWidth //* 0.8
      var screen_width = main_ele.clientWidth //* 0.8
      var screen_height = main_ele.clientHeight //* 0.8
      var img_list = this.img_list
      var magic = null; var vm = this
      var oImg = new Image()
      oImg.src = img_list[0].src
      oImg.onload = function() {
        // console.log(111)

        var oUL = document.getElementById('list').children[0]
        while (oImg.width > radius / 5) {
          oImg.width = oImg.width / 1.3
          oImg.height = oImg.height / 1.3
        } // 动态设置图片的何止大小
        oUL.style.width = oImg.width + 'px'
        oUL.style.height = oImg.height + 'px'

        function Magic() {
          this.liNum = 125
          this.small_liNum = 48
          this.oUl = oUL
          this.oUl.style.transition = 0.5
          this.aLi = this.oUl.children
          this.disX = screen_width / 4
          this.disY = screen_height / 4
          this.disZ = radius / 4
          this.oUlZ = -radius * 1.3
          this.rotateX = 0
          this.rotateY = 0
        }
        const animate_wrap = document.getElementById('all')
        animate_wrap.onmousedown = function(event) {
          var rotate_deg = 5
          // if(this.currentMode === "Helix"){
          //     rotate_deg = 5
          // }
          if (!event) event = window.event
          var x = event.clientX
          var y = event.clientY
          var cutX = x
          var cutY = y
          animate_wrap.onmousemove = function(event) {
            if (!event) event = window.event
            cutX = event.clientX - x
            cutY = event.clientY - y
            magic.rotateX += -cutY * 0.02
            if (magic.rotateX > rotate_deg) {
              magic.rotateX -= -cutY * 0.02
            } else if (magic.rotateX < -rotate_deg) {
              magic.rotateX -= -cutY * 0.02
            }
            magic.rotateY += cutX * 0.005
            magic.oUl.style.transform = 'translate3D(0px,0px,' + magic.oUlZ +
                                                    'px) rotateX(' + magic.rotateX +
                                                    'deg) rotateY(' + magic.rotateY + 'deg)'
          }
          animate_wrap.onmouseup = function() {
            animate_wrap.onmousemove = null
          }
        }// end of document.onmousedown
        animate_wrap.ontouchstart = function(event) {
          var rotate_deg = 5
          // if(this.currentMode === "Helix"){
          //     rotate_deg = 5
          // }
          if (!event) event = window.event
          var x = event.changedTouches[0].clientX
          var y = event.changedTouches[0].clientY
          var cutX = x
          var cutY = y
          animate_wrap.ontouchmove = function(event) {
            if (!event) event = window.event
            cutX = event.changedTouches[0].clientX - x
            cutY = event.changedTouches[0].clientY - y
            magic.rotateX += -cutY * 0.02
            if (magic.rotateX > rotate_deg) {
              magic.rotateX -= -cutY * 0.02
            } else if (magic.rotateX < -rotate_deg) {
              magic.rotateX -= -cutY * 0.02
            }
            magic.rotateY += cutX * 0.005
            magic.oUl.style.transform = 'translate3D(0px,0px,' + magic.oUlZ +
                                                    'px) rotateX(' + magic.rotateX +
                                                    'deg) rotateY(' + magic.rotateY + 'deg)'
          }
          animate_wrap.ontouchend = function() {
            animate_wrap.ontouchmove = null
          }
        }

        Magic.prototype.init = function() { // 创建li元素
          var fragment = document.createDocumentFragment()// 使用文档片段 轻量级
          for (var i = 0; i < this.liNum; i++) {
            var oLi = document.createElement('li')

            var index = Math.floor(Math.random() * img_list.length)
            oLi.style.backgroundImage = `url('${img_list[ index ].src}')`
            oLi.style.backgroundSize = '100% 100%'
            oLi._my_info = {
              index: index,
              groupid: img_list[ index ].groupid
            }
            if (img_list[ index ].has_icon) {
              oLi.innerHTML = `<img style='position: absolute;top:0;left:5%;' src='${img_list[ index ].icon}' />`
            }

            fragment.appendChild(oLi)
          }
          this.oUl.appendChild(fragment)// 避免直接的DOM插入
        }
        Magic.prototype.grid = function() {
          // magic.oUlZ = -radius*1.3
          for (var i = 0; i < this.liNum; i++) {
            this.aLi[i].style.display = 'block'
            this.aLi[i].index = i	// 保存排序
            this.aLi[i].x = i % 5	// 确定元素的位置(排列位置)
            this.aLi[i].y = ~~(i % 25 / 5)
            this.aLi[i].z = 4 - ~~(i / 25)
            this.aLi[i].pox = (this.aLi[i].x - 2) * this.disX * 1.5 - oImg.width / 2 // 设置元素的位置（空间位置）
            this.aLi[i].poy = (this.aLi[i].y - 2) * this.disY * 1.5
            this.aLi[i].poz = (this.aLi[i].z - 3) * this.disZ * 1.5 + 500
            this.aLi[i].style.transform = 'translate3D(' + this.aLi[i].pox + 'px,' + this.aLi[i].poy + 'px,' + this.aLi[i].poz + 'px)'
          }
        }
        Magic.prototype.small_grid = function() {
          // magic.oUlZ = -radius
          for (var i = 0; i < this.liNum; i++) {
            if (i < this.small_liNum) {
              this.aLi[i].index = i	// 保存排序
              this.aLi[i].x = i % 4	// 确定元素的位置(排列位置)
              this.aLi[i].y = ~~(i % 16 / 4)
              this.aLi[i].z = 4 - ~~(i / 16)
              this.aLi[i].pox = (this.aLi[i].x - 2) * this.disX * 1.5 - oImg.width / 2 // 设置元素的位置（空间位置）
              this.aLi[i].poy = (this.aLi[i].y - 2) * this.disY * 1.5
              this.aLi[i].poz = (this.aLi[i].z - 3) * this.disZ * 1.5
              this.aLi[i].style.transform = 'translate3D(' + this.aLi[i].pox + 'px,' + this.aLi[i].poy + 'px,' + this.aLi[i].poz + 'px)'
            } else {
              this.aLi[i].style.display = 'none'
            }
          }
        }
        Magic.prototype.helix = function() {
          // magic.oUlZ = -radius*1.3
          // console.log(222)
          for (var i = 0; i < this.liNum; i++) {
            this.aLi[i].style.display = 'block'
            this.aLi[i].pox = 0

            if (i < 25) {
              this.aLi[i].poy = oImg.height * 2 + 40
            } else if (i < 50) {
              this.aLi[i].poy = oImg.height + 20
            } else if (i < 75) {
              this.aLi[i].poy = 0
            } else if (i < 100) {
              this.aLi[i].poy = -oImg.height - 20
            } else {
              this.aLi[i].poy = -oImg.height * 2 - 40
            }

            this.aLi[i].rotateY = i * (360 / 25)

            this.aLi[i].style.transform = `rotateY(${this.aLi[i].rotateY}deg) translate3D(${this.aLi[i].pox}px,${this.aLi[i].poy}px,${radius * 1.1}px)`
          }
        }
        Magic.prototype.small_helix = function() {
          // magic.oUlZ = -radius*0.5
          for (var i = 0; i < this.liNum; i++) {
            if (i < 80) {
              this.aLi[i].pox = 0
              if (i < 20) {
                this.aLi[i].poy = -oImg.height * 2 - 0
              } else if (i < 40) {
                this.aLi[i].poy = -oImg.height + 50
              } else if (i < 60) {
                this.aLi[i].poy = oImg.height - 50
              } else {
                this.aLi[i].poy = oImg.height * 2 + 0
              }

              this.aLi[i].rotateY = i * (360 / 20)

              this.aLi[i].style.transform = `rotateY(${this.aLi[i].rotateY}deg) translate3D(${this.aLi[i].pox}px,${this.aLi[i].poy}px,${radius * 0.8}px)`
            } else {
              this.aLi[i].style.display = 'none'
            }
          }
        }
        vm.magic = new Magic()
        magic = vm.magic
        magic.init()
        magic.grid()
        // magic.small_helix()
        // 打开对应的弹窗
        magic.oUl.onmouseup = function(e) {
          // 192.168.1.103:8031/api/commodity/100001?phone=15088729383
          // localStorage.getItem("user_phone")
          vm.axios.get(`/h/api/commodity/${e.target._my_info.groupid}?phone=` + localStorage.getItem('user_phone'))
            .then(res => {
              // console.log(res)
              if (res.status === 200 && res.data.status_code === 200) {
                // console.log(res.data.data)

                if (e) {
                  vm.alertOption = {
                    img_index: e.target._my_info,
                    product_list: res.data.data
                  }
                  console.log(vm.alertOption)
                  const alert_box = document.getElementById('alert_box')
                  alert_box.style.width = '100%'
                  alert_box.style.height = '100%'
                  alert_box.style.top = '0%'
                  alert_box.style.left = '0%'
                }
              } else {
                console.log('failed')
              }
            })
          //
        }

        vm.rotate_scene()
      } // end of img onload
    }, // end of init
    close_red_pocket() { // 关闭红包页面
      const wrap = document.getElementById('red_pocket')
      wrap.style.top = '50%'
      wrap.style.left = '50%'
      wrap.style.width = '0%'
      wrap.style.height = '0%'
    },
    close_alert() { // 关闭弹窗
      const alert_box = document.getElementById('alert_box')
      alert_box.style.width = '0%'
      alert_box.style.height = '0%'
      alert_box.style.top = '50%'
      alert_box.style.left = '50%'
    },
    close_banner() { // 关闭轮播
      const alert_box = document.getElementById('banner_box')
      alert_box.style.width = '0%'
      alert_box.style.height = '0%'
      alert_box.style.top = '50%'
      alert_box.style.left = '50%'
    },
    qrcodeScan() { // 生成二维码
      const text = this.red_pocket_address
      new QRCode('qrcode', {
        // width: 200,  // 二维码宽度
        // height: 200, // 二维码高度
        text: text
      })
    }

  }
}
</script>
<style lang="scss">
.show_wrap{

    height:100%;
    #all{
        position: relative;
        // z-index: -1;
        width: 400%;
        height: 100%;
        transition: 1s;
        #main{
            float: left;
            position: relative;
            width: 25%;
            height: 100%;
            perspective: 800px;
            #list ul{
                position: absolute;
                top: 50%;
                left: 48%;
                width: 120px;
                height: 160px;
                margin-top: -80px;
                margin-left: -60px;
                transform-style: preserve-3d;
                transform: translateZ(-2000px) rotateX(0deg) rotateY(0deg);
                li{
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: #ffffff;
                    margin:-2px;
                    border: 2px solid transparent;
                    box-shadow: 0 0 40px rgba(0, 0, 0, 0.2);
                    text-align: center;
                    // color: #70caff;
                    cursor: pointer;
                    transition: 2s cubic-bezier(.94,.02,.49,.98);
                }
            }
        }
    }
    #red_pocket{
        position: absolute;
        top: 50%;
        left: 50%;
        background-color: rgba(0, 0, 0, 0.64);
        height: 0%;
        width: 0%;
        transition: 0.5s;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        .box{
            position: relative;
            img{
                border-radius: 10px;
            }
            .close_icon{
                position: absolute;
                top: -100px;
                left: 214px;
                width: 50px;
                height: 50px;
                cursor: pointer;
            }
            .red_bg{
                width: 500px;
                height: 600px;
            }
            #qrcode{
                position: absolute;
                top: 40px;
                left: 90px;
                width: 320px;
                height: 320px;
                // border: 1px solid;
                img{
                    border-radius: 5px;
                    width: 100%
                }
            }
        }

    }
    #alert_box,#banner_box{
        position: absolute;
        top: 50%;
        left: 50%;
        background-color: rgba(0, 0, 0, 0.64);
        height: 0%;
        width: 0%;
        transition: 0.5s;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }
}
</style>
