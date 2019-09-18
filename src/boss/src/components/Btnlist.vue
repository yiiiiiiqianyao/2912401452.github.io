<template>
  <div class="btn_list">
    <div class="left_top">
      <div class="out" @click="handle($event,{ type:'back' })">
        <div class="out_icon">
          <img src="../assets/images/show_icons/out.png" width="20px" height="20px" alt="">
        </div>
        <span class="out_top_label">
          <!-- 退出 -->
        </span>
      </div>
      <div class="products_list">
        <div class="product_item btn" @click="is_list_close=!is_list_close">
          所有分类
          <img src="../assets/images/show_icons/drop_down.png" alt="">
        </div>
        <transition name="fade">
          <ul v-show="is_list_close">
            <li
              v-for="(product,index) of products_list"
              :key="index"
              class="product_item btn"
              @click="handle($event,{type:'product',index:index,value:product})"
            >
              {{ product }}
            </li>
          </ul>
        </transition>
      </div>
    </div>
    <div class="left_bottom">
      <ul>
        <li @click="handle($event,{type:'style_change'})">
          <div class="img">
            <img src="../assets/images/show_icons/style_change.png" alt="">
          </div>
        </li>
        <li @click="handle($event,{type:'bg_change'})">
          <div class="img">
            <img src="../assets/images/show_icons/bg_change.png" alt="">
          </div>
        </li>
        <li v-show="currentMode!='Grid'" @click="handle($event,{type:'size_change'})">
          <div class="img">
            <img src="../assets/images/show_icons/size_change.png" alt="">
          </div>
        </li>
      </ul>
    </div>
    <div class="right_top">
      <ul>
        <li @click="handle($event,{type:'full_screen'});is_fullscreen=!is_fullscreen">
          <div class="img">
            <img v-show="!is_fullscreen" src="../assets/images/show_icons/full_screen.png" alt="">
            <img v-show="is_fullscreen" src="../assets/images/show_icons/out_full_screen.png" alt="">
          </div>
        </li>
        <li @click="handle($event,{type:'auto'});">
          <div class="img">
            <img v-show="isAuto" src="../assets/images/show_icons/auto.png" alt="">
            <img v-show="!isAuto" src="../assets/images/show_icons/auto_close.png" alt="">
          </div>
        </li>
      </ul>
    </div>
    <div class="right_bottom">
      <ul>
        <li v-if="isActive" @click="handle($event,{type:'actives'})">
          <img class="btn" src="../assets/images/show_icons/actives.png" alt="">
        </li>
        <li @click="handle($event,{type:'red_pocket'})">
          <img class="btn" src="../assets/images/show_icons/red_pocket.png" alt="">
        </li>
      </ul>
    </div>
  </div>
</template>
<script>

import libsApi from '@/api/urls/api'
export default {
  props: {
    currentMode: {
      type: String,
      default: ''
    },
    isAuto: {
      type: Boolean,
      default: true
    },
    isActive: {
      type: Boolean
    }
  },
  data() {
    return {
      products_list: [], // 当前商品下拉列表的信息列表
      is_list_close: true, // 表示当前的商品下拉列表是否打开
      selected_index: -1, // 当前选中的商品的下标
      is_auto: true,
      is_fullscreen: false
    }
  },
  created() {
    var vm = this
    libsApi.categories(localStorage.getItem('user_phone'))
      .then(res => {
        if (res.data.status === 'success' && res.data.status_code === 200) {
          vm.products_list = res.data.data
        }
      })
      .catch(err => {
        console.log(err)
      })

    window.onresize = function() {
      if (!checkFull()) {
        // console.log(111)
        vm.is_fullscreen = !vm.is_fullscreen
        // 退出全屏后要执行的动作
        // vm.$emit('Fullscreen', false)
      }
    }
    function checkFull() {
      var isFull = window.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled
      if (isFull === undefined) isFull = false
      return isFull
    }
  },
  methods: {
    handle(e, option) {
      var vm = this
      if (option.type === 'product') {
        if (this.selected_index === -1) {
          e.target.style.backgroundColor = '#0084FF'
          this.selected_index = option.index
        } else if (this.selected_index === option.index) {
          e.target.style.backgroundColor = 'rgba(0,0,0,0.7)'
          this.selected_index = -1
        } else {
          var oli = document.querySelectorAll('.btn_list .products_list ul li')[vm.selected_index]
          oli.style.backgroundColor = 'rgba(0,0,0,0.7)'
          this.selected_index = option.index
          e.target.style.backgroundColor = '#0084FF'
        }
      }
      this.$emit('sun_event', option)
    }
  }

}
</script>
<style lang="scss" scoped>
.btn_list{
    width: 100%;
}
.left_top{
    .out{
        position: absolute;
        left: 40px;
        top: 32px;
        display: flex;
        flex-flow: column;
        align-items: center;
        .out_icon{
            display: flex;
            justify-content: center;
            align-items: center;
            width:50px;
            height:50px;
            background:rgba(0,0,0,0.7);
            border:1px solid rgba(44,124,201,1);
            border-radius: 50%;
            cursor: pointer;
        }
        .out_top_label{
            margin-top: 10px;
            font-size: 16px;
            font-family:PingFangSC-Medium;
            font-weight:600;
            color: #FFFFFF;
        }
    }
    .products_list{
        position: absolute;
        top: 140px;
        .btn{
            margin-top: 20px;
            width:140px;
            height:48px;
            background:rgba(0,0,0,0.7);
            border-radius:8px;
            border:1px solid rgba(44,124,201,1);
            line-height: 48px;
            color: #FFFFFF;
            cursor: pointer;
            margin-left: 40px;
        }
        ul{
            list-style: none;
            padding: 0;
            overflow: hidden;
        }
    }
}
.left_bottom{
    ul{
        position: absolute;
        left: 20px;
        bottom: 20px;
        list-style: none;
        padding: 0;
        margin: 0;
        li{
            float: left;
            .img{
                display: flex;
                justify-content: center;
                align-items: center;
                width:50px;
                height:50px;
                border:1px solid rgba(44,124,201,1);
                border-radius: 50%;
                background:rgba(0,0,0,0.7);
                margin-bottom: 10px;
            }
            color: #FFFFFF;
            font-size: 14px;
            font-weight: 600;
            margin-left: 50px;
            cursor: pointer;
        }
    }
}
.right_top{
    ul{
        position: absolute;
        top: 30px;
        right: 30px;
        list-style: none;
        padding: 0;
        margin: 0;
        li{
            color: #FFFFFF;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 30px;
            .img{
                display: flex;
                justify-content: center;
                align-items: center;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                border:1px solid rgba(44,124,201,1);
                background:rgba(0,0,0,0.7);
                cursor: pointer;
                margin-bottom: 10px;
            }
        }
    }
}
.right_bottom{
    ul{
        position: absolute;
        right: 40px;
        bottom: 20px;
        list-style: none;
        padding: 0;
        margin: 0;
        li{
            margin-bottom: 10px;
            cursor: pointer;
            .btn{
                width: 80px;
                height: 80px;
            }
        }
    }
}

.fade-enter-active {
  transition: all .4s ease;
}
.fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.fade-enter, .fade-leave-to {
  transform: translateY(-100px);
  opacity: 0;
}
</style>
