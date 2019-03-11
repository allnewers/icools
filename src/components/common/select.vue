<template>
  <div>  
    <div class="bg">
      <div class="close-dialog" @click="close(false)">
        <img src="../../assets/img/close.png" alt>
      </div>
      <slot></slot>
    </div>
    
    <transition name="fade">
      <div class="mark" @click="close(false)" @touchmove.prevent></div>
    </transition>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "selects",
  data() {
    return {
      
    };
  },
  computed: {
    //...mapState(["showDialog1"])
  },
  methods: {
    close(val) {
      this.$emit("closeD", val);
    }
  }
  // watch: {
  //   showDialog1: {
  //     handler(val, oldVal) {
  //       if (val === true) {
  //         this.noScroll();
  //       } else {
  //         this.canScroll();
  //       }
  //       document.body.scrollTop = this.pageScrollYoffset;
  //       window.scroll(0, this.pageScrollYoffset);
  //     },
  //     deep: false
  //   }
  // }
};
</script>
<style lang="less" scoped>

.bg {
  background: #fff;
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  .close-dialog {
    position: absolute;
    top: 0.2rem;
    right: 0.2rem;
    height: 0.6rem;
    width: 0.6rem;
    text-align: center;
    img {
      max-width: 100%;
      width: 0.48rem;
      display: inline;
    }
  }
}

.mark {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  height: 100%;
  z-index: -1;
}

</style>


