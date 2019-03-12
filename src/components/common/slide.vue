<template>
  <div>
    <div v-if="data.length>0">
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide v-for="(item, index) in data" :key="item.id" @click="go(item.url)">
          <img :src="item.path" alt>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
    <!-- <div class="loading" v-if="data.length<=0">
      <Load/>
    </div> -->
  </div>
</template>
<script>
import indexImg from "../../assets/img/banner@2x.png";
import detailImg from "../../assets/img/detail@3x.png";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import Load from "./loading";
export default {
  name: "slide",
  data() {
    return {
      swiperOption: {
        //autoplay:true,
        pagination: {
          el: ".swiper-pagination"
        }
      }
    };
  },
  props: ["data"],
  components: {
    swiper,
    swiperSlide,
    Load
  },
  mounted() {},
  methods: {
    go(url) {
      window.location.href = url;
    }
  }
};
</script>
<style lang="less" scoped>
.swiper-wrapper {
  //height: 3.5rem;
  img {
    max-width: 100%;
  }
}
</style>
<style lang="less">
.swiper-pagination-bullet-active {
  background-color: #fff;
}
.loading {
  height: 4.25rem;
  display: flex;
  justify-content: center;
  align-items: center;

  // svg{
  //   display: inline;
  // }
}
</style>



