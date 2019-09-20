<template>
  <div class="wrap">
    <div class="header">
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide v-for="(item,index) in thirdNavList" :key="item.id">
          <span
            class="items"
            :class="{actives:isActive == index}"
            @click="tab(index,item.id)"
          >{{item.name}}</span>
        </swiper-slide>
      </swiper>
    </div>
    <div class="prolist">
      <!-- 标题 -->
      <!-- <Top :types="showType1"/> -->
      <!-- 商品列表（新品） -->
      <div class="list-show" v-if="!noData" :style="{'-webkit-overflow-scrolling': scrollMode}">
        <mt-loadmore
          :bottom-method="loadBottom"
          :bottom-all-loaded="allLoaded"
          :auto-fill="false"
          :bottom-distance="40"
          @bottom-status-change="handleBottomChange"
          ref="loadmore"
        >
          <ul>
            <li v-for="(item,index) in productList" :key="item.id" @click="goDetail(item.sn)">
              <img v-lazy="imgBaseUrl+item.imag" alt>
              <h2>{{item.name}}</h2>
              <div class="prices clear">
                <p class="price fl">
                  ￥{{item.groupPrice}}
                  <!-- <span>￥{{item.price}}</span> -->
                </p>
                <p class="num fr">{{item.groupNum}}人拼</p>
              </div>
            </li>
          </ul>
          <div slot="bottom" class="mint-loadmore-bottom">
            <p v-show="bottomStatus !== 'loading'" class="loadmore-tip">
              <span :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span> 释放加载更多
            </p>
            <span v-show="bottomStatus === 'loading'" class="loading-txt">
              <mt-spinner :size="10" type="snake"></mt-spinner>加载中...
            </span>
          </div>
          <p class="nomore" v-show="allLoaded">没有更多了~</p>
        </mt-loadmore>
      </div>
      <div class="noData" v-if="noData">
        <img src="../assets/img/noData.png" alt>
        <span>暂时没有数据哦~</span>
      </div>
    </div>
  </div>
</template>
<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { getNavList, search } from "../api";
import { imgBaseUrl } from "../util";
import { Indicator } from "mint-ui";
export default {
  name: "brandList",
  data() {
    return {
      d1: "",
      d2: "",
      d3: "",
      noData: false, //搜索没数据
      isActive: "0",
      scrollMode: "touch",
      allLoaded: false,
      bottomStatus: "",
      thirdNavList: [],
      productList: [],
      currentPage: 1,
      imgBaseUrl:imgBaseUrl,
      swiperOption: {
        // autoplay: {
        //   disableOnInteraction: false
        // },
        spaceBetween: 0,
        freeMode: true,
        slidesPerView: 5,
        freeModeMomentumBounceRatio: 5
      }
    };
  },
  components: {
    swiper,
    swiperSlide
  },
  mounted() {
    let query = this.$route.query;

    this.thirdNavList = JSON.parse(query.thirdNavList);
    this.d1 = query.id1;
    this.d2 = query.id2;
    //console.log(this.thirdNavList);
    this.d3 = this.thirdNavList[0].id; //初始化三级导航 id
    this.firstPage(); //初始化 三级页面 商品列表
  },
  methods: {
    tab(index, id3) {
      if (this.isActive == index) return;
      this.isActive = index;
      this.d3 = id3;
      this.noData = false;
      this.allLoaded = false;
      this.currentPage = 1;
      this.firstPage();
    },
    handleBottomChange(status) {
      //alert(status);
      this.bottomStatus = status;
    },
    loadBottom() {
      if (!this.allLoaded) {
        Indicator.open();
        this.nextPage();
        this.$refs.loadmore.onBottomLoaded(); //通知loadmore组件从新渲染，计算
      }
    },
    goDetail(sn) {
      this.$router.push({ name: "detail", params: { sn: sn } });
    },
    firstPage() {
      this.productList = [];
      Indicator.open();
      search({ id1: this.d1, id2: this.d2, id3: this.d3 })
        .then(res => {
          //console.log(res);
          if (res.result === true) {
            let data = res.data.page.list;
            let lastPage = res.data.page.lastPage;//总共页数
            this.productList = res.data.page.list;
            if (data.length == 0) {
              this.noData = true;
            }
            if (lastPage <= this.currentPage) { 
              this.allLoaded = true; //禁止上拉
            } else{
              this.allLoaded = false;
            }
            Indicator.close();
          } else {
            console.log(res.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    nextPage() {
      //alert(this.currentPage);
      ++this.currentPage;
      search({
        id1: this.d1,
        id2: this.d2,
        id3: this.d3,
        pageNum: this.currentPage
      })
        .then(res => {
          //console.log(res);
          if (res.result === true) {
            let data = res.data.page.list;
            //this.productList = res.data.page.list;
            let lastPage = res.data.page.lastPage;
            data.forEach(element => {
              this.productList.push(element);
            });
            if (lastPage <= this.currentPage) {
              this.allLoaded = true;
            } {
              this.allLoaded = false;
            }
            
            Indicator.close(); //数据加载完成，关闭加载中
          } else {
            console.log(res.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang="less" scoped>
@keyframes rotates {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(180deg);
  }
}
.swiper-slide {
  width: 20% !important;
  margin-right: 0 !important;
  text-align: center;
}
.wrap {
  overflow: hidden;
}
.bg {
  background: #fff;
  height: 0.9rem;
}
.header {
  position: fixed;
  top: 0;
  width: 100%;
  left: 0;
  background: #fff;
  z-index: 1000;
  height: 0.7rem;
  border-bottom: 1px solid #f0f0f0;
  .items {
    height: 0.7rem;
    line-height: 0.7rem;
    color: #666;
    font-size: 0.28rem;
    padding: 0.05rem 0.1rem .16rem;
    &.actives {
      border-bottom: 1px solid #333;
      color: #333;
    }
  }
}

.prolist {
  margin-top: 0.75rem;
  .list-show {
    height: 96vh;
    overflow: scroll;
    ul {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin: 0 0 0.2rem;
      li {
        flex: 1;
        flex: 3.73rem 0 0;
        background: #fff;
        padding: 0.24rem 0 0.3rem;
        margin-bottom: 0.05rem;
        img {
          display: block;
          margin: 0 auto;
          width: 3rem;
          height: 3.5rem;
        }
        h2 {
          font-size: 0.28rem;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          padding: 0.2rem 0.28rem;
        }
      }
      .prices {
        padding: 0 0.2rem;
      }
      .price {
        font-size: 0.3rem;
        font-weight: 500;
        color: rgba(255, 70, 70, 1);
        span {
          font-size: 0.2rem;
          font-weight: 300;
          padding: 0 0 0 0.1rem;
          text-decoration: line-through;
          color: rgba(102, 102, 102, 1);
        }
      }
      .num {
        width: 0.78rem;
        height: 0.26rem;
        line-height: 0.26rem;
        text-align: center;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(255, 70, 70, 1);
        border-radius: 0.05rem;
        font-size: 0.2rem;
        font-weight: 400;
        color: rgba(255, 70, 70, 1);
        margin-top: 0.05rem;
        &::after {
          content: " ";
          display: inline-block;
          width: 0;
          height: 100%;
          vertical-align: middle;
          margin-top: 1px;
        }
      }
    }
  }
}
</style>
