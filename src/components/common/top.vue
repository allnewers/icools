<template>
  <div class="wrap">
    <div class="ww">
      <div class="dot">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="word">
        <img :src="imgPath" alt>
      </div>
      <div class="dot rotate">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "top",
  props: ['types'],
  data() {
    return {
      imgPath: ""
    };
  },
  mounted() {
    this.getImgPath();
  },
  methods: {
    getImgPath() {
      let types = this.types;
      this.imgPath = types;
    }
  }
};
</script>
<style lang="less" scoped>
.wrap {
  background: #fff;
  overflow: hidden;
}
.ww {
  display: flex;
  width: 2.8rem;
  margin: 0 auto;
  padding: 0.3rem 0;
  justify-content: space-between;
  .dot {
    width: 0.6rem;
    display: flex;
    align-items: Center;
    justify-content: space-between;
    span {
      transform: rotate(-45deg);
      background: #bababa;
      &:nth-child(3) {
        width: 7px;
        height: 7px;
      }
      &:nth-child(2) {
        width: 5px;
        height: 5px;
      }
      &:first-child {
        width: 3px;
        height: 3px;
      }
    }
    &.rotate {
      transform: rotate(180deg);
    }
  }
  .word {
    width: 1.3rem;
    height: 0.28rem;
  }
}
</style>

