<template>
  <div class="wrap">
    <div class="bg">
      <div class="search">
        <div class="icon">
          <img src="../../assets/img/search1@2x.png" alt>
        </div>
        <input type="text" @click="search" readonly :placeholder="tips" maxlength="30">
      </div>
      <div class="tabar">
        <ul>
          <li
            v-for="(item,index) in tabBar"
            :class="{active:isActive == index}"
            @click="tab(index)"
            :key="index+Math.random()"
          >
            {{item}}
            <i :class="{active:isActive == index}"></i>
          </li>
        </ul>
      </div>
    </div>
    <!-- <button class="btn">搜索</button> -->
    <div class="prolist">
      <div class="list-show" v-if="!noData" :style="{'-webkit-overflow-scrolling': scrollMode}">
        <mt-loadmore
          :bottom-method="loadBottom"
          :bottom-all-loaded="allLoaded"
          :auto-fill="false"
          :bottom-distance="50"
          @bottom-status-change="handleBottomChange"
          ref="loadmore"
        >
          <ul>
            <li v-for="item in searchList" :key="item.id">
              <img v-lazy="'http://eicools.oss-cn-beijing.aliyuncs.com/'+item.imag" alt>
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
        <img src="../../assets/img/noData.png" alt>
        <span>暂时没有数据哦~</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { search } from "../../api";
import { getCookie } from "../../util";
import { Indicator } from "mint-ui";
export default {
  name: "tuanList",
  data() {
    return {
      tips: "",//默认搜索的字段
      tabBar: ["综合", "销量", "价格"],
      isActive: "0",
      indexs: "0",//tab 默认显示下标
      noData: false,//搜索没数据
      allLoaded: false,//mint-ui loadmore组件 数据是否全部加载
      currentPage: 1,//默认加载第？页数据
      bottomStatus: "",
      scrollMode: "touch",//ios下loadmore和-webkit-overflow-scrolling：touch 属性冲突无法上拉问题
    };
  },
  mounted() {
    let key = this.$route.params.keyword;
    this.tips = key;
    let token = getCookie("token");
    this.token = token;
    if (this.searchList.length == 0) {
      //解决vuex刷新，数据丢失
      Indicator.open();
      this.firstPage({ keyword: key, token: token, pageNum: this.currentPage });
    }
  },
  computed: {
    ...mapState(["searchList"])
  },
  methods: {
    tab(index) {
      this.isActive = index;
    },
    search() {
      this.$router.push("/search");
    },
    handleBottomChange(status) {
      //alert(status);
      this.bottomStatus = status;
    },
    loadBottom() {
      if(!this.allLoaded){
        Indicator.open();
        this.nextPage();
        this.$refs.loadmore.onBottomLoaded(); //通知loadmore组件从新渲染，计算
      }
    },
    firstPage(params) {
      search(params)
        .then(res => {
          //console.info(res);
          let data = res.data.page.list;
          //alert(data.length)
          if (data.length == 0) {
            this.noData = true;
          }
          this.$store.commit("changeSearchList", data);
          Indicator.close();
        })
        .catch(err => {
          console.info(err);
        });
    },
    nextPage() {
      ++this.currentPage;
      //alert(this.currentPage)
      search({
        keyword: this.tips,
        token: this.token,//记录 标签
        pageNum: this.currentPage
      })
        .then(res => {
          let data = res.data.page.list;
          data.forEach(element => {
            this.searchList.push(element);
          });
          if (data.length < 10) {
            this.allLoaded = true;
          } else if (data.length >= 10) {
            this.allLoaded = false;
          }
          Indicator.close(); //数据加载完成，关闭加载中
        })
        .catch(err => {
          this.$toast(err);
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
.wrap {
  overflow: hidden;
}
.bg {
  background: #fff;
  height: 1.46rem;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
}
.search {
  margin-top: 0.24rem;
  margin-left: 0.28rem;
  position: relative;
  width: 6.9rem;
  height: 0.6rem;
  background: #f1f1f1;
  z-index: 1000;
  border-radius: 0.3rem;
  line-height: 0.6rem;
  .icon {
    position: absolute;
    height: 0.26rem;
    width: 0.27rem;
    top: 0.2rem;
    left: 0.2rem;
  }
  input {
    padding-left: 0.6rem;
    width: 80%;
    &::placeholder {
      color: #666;
    }
    color: #666;
  }
}
.btn {
  position: absolute;
  top: 0.24rem;
  right: 0.28rem;
  font-size: 0.28rem;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 0.6rem;
}
.tabar {
  ul {
    display: flex;
    justify-content: space-around;
    background: #fff;
    height: 0.86rem;
    line-height: 0.86rem;
    font-weight: 400;
    li {
      flex: 1;
      text-align: center;
      font-size: 0.26rem;
      color: rgba(153, 153, 153, 1);
      &.active {
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
      }
      i {
        width: 0;
        height: 0;
        display: inline-block;
        border-width: 0 0.08rem 0.1rem;
        border-style: solid;
        border-color: transparent transparent #999; /*灰 透明 透明 */
        position: relative;
        top: -0.05rem;
        &.active {
          //animation: rotates .3s ease-in both;
          transform: rotate(180deg);
          border-color: transparent transparent #333;
        }
      }
    }
  }
}
// .mint-loadmore{
//   height: 100vh;
//   overflow: scroll;
// }
.prolist {
  .list-show {
    margin-top: 1.8rem;
    height: 76vh;
    overflow: scroll;
    ul {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin: 0.05rem 0 0.1rem;
      li {
        flex: 3.71rem 0 0;
        background: #fff;
        padding: 0.24rem 0 0.3rem;
        margin-bottom: 0.1rem;
        img {
          display: block;
          margin: 0 auto;
          width: 3.11rem;
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


