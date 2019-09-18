<template>
  <div id="banner">
    <div class="img_wrap">
      <transition-group name="banner" tag="p">
        <img v-for="(item,index) in bannerList" v-show="current_img_index==index" :key="'item-' + index" :src="item.url" alt="">
      </transition-group>
    </div>
    <img class="left" src="../assets/images/banner/left.png" alt="" @click="toleft">
    <img class="right" src="../assets/images/banner/right.png" alt="" @click="toright">
    <img class="product" src="../assets/images/banner/product.png" alt="" @click="quit">
  </div>
</template>
<script>
export default {
  props: {
    bannerList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      banner_width: null,
      banner_height: null,
      banner_imgs: [],
      wrap_pos: 0,
      current_img_index: 0
    }
  },
  computed: {
    is_show() {
      return true
    }
  },
  created() {
    this.banner_imgs = [
      {
        img_src: 'images/products/1.jpg'
      },
      {
        img_src: 'images/products/3.jpg'
      },
      {
        img_src: 'images/products/4.jpg'
      }
    ]
  },
  methods: {
    quit() {
      this.$emit('close_banner')
    },
    toleft() {
      this.current_img_index += 1
      if (this.current_img_index > this.bannerList.length - 1) {
        this.current_img_index = 0
      }
    },
    toright() {
      this.current_img_index -= 1
      if (this.current_img_index < 0) {
        this.current_img_index = this.bannerList.length - 1
      }
    }
  }
}
</script>
<style lang="scss">
#banner{
    position: absolute;
    top: 0;
    left: 0;
    background-color: #FFFFFF;
    width: 100%;
    height: 100%;
    .img_wrap{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
       img{
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
       }
    }
    .left{
        position: absolute;
        left: 80px;
        top: 45%;
        width: 60px;
        height: 60px;
        cursor: pointer;
    }
    .right{
        position: absolute;
        top: 45%;
        right: 80px;
        width: 60px;
        height: 60px;
        cursor: pointer;
    }
    .product{
        position: absolute;
        right: 48px;
        top: 48px;
        cursor: pointer;
    }
}
.banner-enter-active, .banner-leave-active {
  transition: opacity .5s;
}
.banner-enter, .banner-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
