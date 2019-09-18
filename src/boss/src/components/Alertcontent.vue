<template>
  <div id="wrapcontent">
    <img class="close" src="../assets/images/alert_close.png" alt="" @click="quit">
    <div id="content">
      <div class="show_part">
        <div class="left_panel">
          <div class="media_box">
            <img class="product_img" :src="alertOption.product_list[curret_product_index].images[curret_product_list_index].zsjurlbig" alt="">
          </div>
          <div class="video_list_bar">
            <img class="left_icon" src="../assets/images/alert/left.png" alt="" @click="slider_right">
            <img class="right_icon" src="../assets/images/alert/right.png" alt="" @click="slider_left">
            <div class="slider">
              <div id="slider_content" class="slider_content">
                <img
                  v-for="(item,key) in alertOption.product_list[curret_product_index].images"
                  :key="key"
                  :src="item.zsjurlsmall"
                  :style="{ border:'4px solid '+(key==curret_product_list_index?'#1890FF':'rgba(0,63,103,1)') }"
                  alt=""
                  @click="change_media(key)"
                >
              </div>
            </div>
          </div>
        </div>
        <div class="right_panel">
          <div class="title">{{ alertOption.product_list[curret_product_index].spxxname }}</div>
          <div class="price_tohand">
            <div class="label">到手价</div>
            <div class="wrap">
              <div class="icon">￥ </div>
              <div class="price">{{ alertOption.product_list[curret_product_index].lsprice }}</div>
            </div>
          </div>
          <div class="price">
            <div class="label">价格</div>
            <div class="wrap">
              <div class="icon">￥ </div>
              <div class="price">{{ alertOption.product_list[curret_product_index].originalprice }}</div>
            </div>
          </div>
          <div class="bar" />
          <div class="model_box">
            <div class="title">产品型号</div>
            <div class="model_panel">
              <ul class="list">
                <li
                  v-for="(item,index) in alertOption.product_list"
                  :key="index"
                  :style="{ border:'4px solid '+(index==curret_product_index?'#1890FF':'rgba(0,63,103,1)') }"
                  @click="(curret_product_index==index)?(curret_product_index):(curret_product_index=index)"
                >
                  <span>{{ item.specname }}</span>
                </li>
              </ul>
              <div v-show="is_address_box" id="address_box" class="address_box">
                <img
                  class="close"
                  src="../assets/images/close.png"
                  width="16px"
                  height="16px"
                  alt=""
                  @click="is_address_box=false"
                >
                <div id="address" class="address" />
                <div class="text">微信扫码购买</div>
                <div class="angle" />
              </div>
              <button class="btn" @click="phone_shop">手机购买</button>
            </div>
          </div>
        </div>
        <div class="control_bar">
          <div class="bar" />
          <button v-if="alertOption.product_list[curret_product_index].detailimages.length>0" class="btn" @click="scroll">
            商品详情
            <img v-show="is_hidden" src="../assets/images/alert/drop.png" alt="">
            <img v-show="!is_hidden" src="../assets/images/alert/up.png" alt="">
          </button>
        </div>

      </div>
      <div v-show="!is_hidden" class="hidden_part">
        <img v-for="(item,index) in alertOption.product_list[curret_product_index].detailimages" :key="index" width="100%" :src="item.picurl" alt="">
      </div>
    </div>
  </div>
</template>
<script>
import TWEEN from '@tweenjs/tween.js'
import QRCode from 'qrcode2'
export default {
  props: {
    alertOption: {
      type: Object,
      default() {
        return { }
      }
    }
  },
  data() {
    return {
      len: 116,
      current_media_index: 0, // 弹出框当前媒体( video/image )序号
      slider_content_pos: 0, // 视频列表位置
      selected_model_index: -1, // 当前选中的产品型号序号
      is_address_box: false, // 通过手机购买选中模型的二维码
      is_hidden: true,
      qrcode: null, // 生成二维码的实例对象
      curret_product_index: 0,
      curret_product_list_index: 0
    }
  },
  // eslint-disable-next-line
  components:{QRCode},
  computed: {
    slider_content_width() { // 视频列表的长度
      return document.getElementById('slider_content').clientWidth + 20
    }
  },
  watch: {
    alertOption(newVal, oldVal) {
      document.getElementById('slider_content').style.width = this.alertOption.product_list[this.curret_product_index].images.length * this.len + 'px'
    }
  },
  methods: {
    quit() { // 关闭弹窗
      this.$emit('close_alert')
    },
    slider_left() { // 视频列表左移
      const content = document.getElementById('slider_content')
      if (this.slider_content_pos - 116 < 444 - this.slider_content_width) {
        content.style.left = '0px'
        this.slider_content_pos = 0
      } else {
        content.style.left = this.slider_content_pos - 116 + 'px'
        this.slider_content_pos -= 116
      }
    },
    slider_right() { // 视频列表右移
      const content = document.getElementById('slider_content')
      if (this.slider_content_pos + 116 > 0) {
        content.style.left = '0px'
        this.slider_content_pos = 0
      } else {
        content.style.left = this.slider_content_pos + 116 + 'px'
        this.slider_content_pos += 116
      }
    },
    change_media(key) {
      this.curret_product_list_index = key
    },
    phone_shop() { // 用户点击手机购买按钮
      this.init_address(this.alertOption.product_list[this.curret_product_index].spxxqrcode)
      this.is_address_box = true
    },
    init_address(text) { // 生成二维码
      if (!this.qrcode) {
        this.qrcode = new QRCode('address', {
          text: text
        })
        document.getElementById('address_box').style.top = '-200px'
        document.querySelector('#address img').style.width = '100%'
      } else {
        this.qrcode.clear()
        this.qrcode.makeCode(text)
      }
    },
    scroll() {
      var vm = this
      var wrap = document.getElementById('content')
      var timer = null
      if (this.is_hidden) {
        this.is_hidden = !this.is_hidden
        setTimeout(function() {
          new TWEEN.Tween({ h: 0 })
            .to({ h: 500 }, 200)
            .onUpdate(function(obj) {
              wrap.scrollTop = obj.h
            })
            .onComplete(function() {
              cancelAnimationFrame(timer)
            })
            .start()
          animate()
        }, 50)
      } else {
        new TWEEN.Tween({ h: wrap.scrollTop })
          .to({ h: 0 }, 200)
          .onUpdate(function(obj) {
            wrap.scrollTop = obj.h
          })
          .onComplete(function() {
            cancelAnimationFrame(timer)
            vm.is_hidden = !vm.is_hidden
          })
          .start()
        animate()
      }
      function animate() {
        timer = requestAnimationFrame(animate)
        TWEEN.update()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#wrapcontent{
  position: relative;
  .close{
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 1;
  }
}
#content{
    position: relative;
    width:1342px;
    height:824px;
    overflow-y: auto;
    background:rgba(0,63,103,1);
    box-shadow:0px 2px 15px 0px rgba(0,124,197,1);
    border-radius:8px;
    border:2px solid rgba(112,202,255,1);
    .close{
        position: absolute;
        top: 17px;
        right: 17px;
        cursor: pointer;
    }
    .show_part{
        height: 824px;
        display: flex;
        flex-wrap: wrap;
        .left_panel{
            margin-left: 26px;
            width: 560px;
            height: 744px;
            .media_box{
                position: relative;
                cursor: pointer;
                margin-top: 32px;
                position: relative;
                height: 560px;
                width: 560px;
                .product_img{
                    width: 100%;
                    height: 100%;
                    border-radius: 5px;
                }
            }
            .video_list_bar{
                margin-top: 26px;
                width: 560px;
                position: relative;
                .left_icon{
                    position: absolute;
                    top: 4px;
                    left: 0;
                    height: 96px;
                    cursor: pointer;
                }
                .right_icon{
                    position: absolute;
                    top: 4px;
                    right: 0;
                    height: 96px;
                    cursor: pointer;
                }
                .slider{
                    position: relative;
                    display: flex;
                    // flex-flow: column;
                    flex-wrap: nowrap;
                    width: 444px;
                    height: 108px;
                    margin: 0 auto;
                    overflow: hidden;
                     cursor: pointer;
                     .slider_content{
                         position: absolute;
                         top: 0;
                         left: 0;
                        //  width: 1000px;
                         height: 96px;
                         transition: 0.5s;
                         img{
                             float: left;
                             margin-right: 20px;
                             width: 96px;
                             height: 96px;
                         }
                     }
                }
            }
        }
        .right_panel{
            width: 739px;
            height: 744px;
            color: #FFFFFF;
            .title{
                margin: 24px 0 48px 32px;
                text-align: left;
                width:651px;
                height:92px;
                font-size:28px;
                font-family:PingFangSC-Medium;
                font-weight:500;
                color:rgba(255,255,255,1);
                line-height:46px;
            }
            .price_tohand ,.price{
                .label{
                    float: left;
                    margin-left: 32px;
                    font-size: 20px;
                    color:rgba(255,255,255,0.64);
                }
                .wrap{
                    text-align: left;
                    margin-left: 120px;
                    .icon{
                        display: inline-block;
                        transform: translateY(-15px);
                        font-size:20px;
                        font-family:PingFangSC-Semibold;
                        font-weight:600;
                        color:rgba(255,108,108,1);
                    }
                    .price{
                        display: inline-block;
                        transform: translateY(-15px);
                        font-size:42px;
                        font-family:PingFangSC-Semibold;
                        font-weight:600;
                        color:rgba(255,108,108,1);
                    }
                }
            }
            .price{
                margin-bottom: 18px;
                 .wrap{
                    .icon{
                        transform: translateY(-4px);
                        color:rgba(255,255,255,0.64);
                    }
                    .price{
                        transform: translateY(-4px);
                        font-size:24px;
                        color:rgba(255,255,255,0.64);
                    }
                }
            }
            .bar{
                width:662px;
                height:1px;
                background:rgba(255,255,255,0.24);
                margin: 0 auto;
            }
            .model_box{
                position: relative;
                .title{
                    margin-top: 48px;
                    float: left;
                    width:80px;
                    height:28px;
                    font-size:20px;
                    font-family:PingFangSC-Medium;
                    font-weight:500;
                    color:rgba(255,255,255,0.64);
                    line-height:28px;
                }
                .model_panel{
                    position: absolute;
                    right: 45px;
                    top: 32px;
                    float: left;
                    width:540px;
                    .list{
                        list-style: none;
                        padding: 0;
                        margin: 0;
                        li{
                            padding: 5px 20px 5px 20px;
                            float: left;
                            display: flex;
                            align-items: center;
                            border-radius: 4px;
                            border: 4px solid #FFFFFF;
                            margin: 5px;
                            background:rgba(255,255,255,1);
                            box-shadow:0px 2px 10px 0px rgba(0,0,0,0.2);
                            span{
                                font-size:20px;
                                font-family:PingFangSC-Medium;
                                font-weight:500;
                                color:rgba(51,51,51,1);
                            }
                           cursor: pointer;
                        }
                    }
                    .address_box{
                        position: absolute;
                        transform:translateY(-70px);
                        width: 270px;
                        height: 330px;
                        background:rgba(0,63,103,1);
                        box-shadow:0px 2px 15px 0px rgba(0,124,197,1);
                        border-radius:8px;
                        border:2px solid rgba(112,202,255,1);
                        .close{
                            position: absolute;
                            top: 10px;
                            right: 10px;
                        }
                        #address{
                            width: 227px;
                            height: 227px;
                            // border: 2px solid #FFFFFF;
                            border-radius: 5px;
                            overflow: hidden;
                            margin: 40px auto 5px auto;
                            // width: 75%;
                            // height: 70%;
                            img{
                                width: 100%;

                                // border: 2px solid #FFFFFF;
                                // width: 200px;
                                // height: 200px;
                            }
                            // margin: 25px auto 0 auto;
                        }
                        .text{
                            font-size:26px;
                            font-family:PingFangSC-Medium;
                            font-weight:500;
                            color:rgba(255,255,255,1);
                        }
                        .angle{
                            margin: 0 auto;
                            width: 40px;
                            height: 40px;
                            border-right: 2px solid rgba(112,202,255,1);
                            border-bottom: 2px solid rgba(112,202,255,1);
                            border-radius:4px;
                            background-color: rgba(0,63,103,1);
                            transform: rotate(45deg) translateY(3px) translateX(3px);
                        }
                    }
                    .btn{
                        position: absolute;
                        left: 0;
                        bottom: -100px;
                        border: none;
                        outline: none;
                        width:236px;
                        height:60px;
                        background:rgba(0,132,255,1);
                        border-radius:6px;
                        font-size:22px;
                        font-family:PingFangSC-Medium;
                        font-weight:500;
                        color:rgba(255,255,255,1);
                        cursor: pointer;
                    }
                }
            }
        }
        .control_bar{
            height: 80px;
            width: 1325px;
            .bar{
                margin: 20px auto;
                width:1136px;
                height:1px;
                background:rgba(255,255,255,0.24);
            }
            .btn{
                border: none;
                outline: none;
                background: transparent;
                font-size:20px;
                font-family:PingFangSC-Medium;
                font-weight:500;
                color:rgba(255,255,255,1);
                cursor: pointer;
            }
        }
    }
}
</style>

