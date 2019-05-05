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
        <span class="sort-order" :class="{on:reverse}"></span>
        <ul>
          <li
            v-for="(item,index) in tabBar"
            :class="{active:isActive == index}"
            @click="tab(index)"
            :key="index"
          >
            {{item}}
            <i></i>
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
            <li v-for="item in searchList" :key="item.id" @click="goDetail(item.sn)">
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
        <img src="../../assets/img/noData.png" alt>
        <span>暂时没有数据哦~</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { search } from "../../api";
import { getCookie,imgBaseUrl } from "../../util";
import { Indicator } from "mint-ui";
import { setTimeout } from 'timers';
export default {
  name: "tuanList",
  data() {
    return {
      tips: "", //默认搜索的字段
      tabBar: ["综合", "销量", "价格"],
      isActive: "0",
      indexs: "0", //tab 默认显示下标
      noData: false, //搜索没数据
      allLoaded: false, //mint-ui loadmore组件 数据是否全部加载
      currentPage: 1, //默认加载第？页数据
      bottomStatus: "",
      scrollMode: "touch", //ios下loadmore和-webkit-overflow-scrolling：touch 属性冲突无法上拉问题
      reverse: false,
      imgBaseUrl:imgBaseUrl,
      searchList:[],
      params:{}
    };
  },
  mounted() {
    let key = this.$route.params.keyword;
    this.tips = key;
    let token = getCookie("token");
    this.token = token;
    this.params = {
      keyword: this.tips, token: this.token, pageNum: this.currentPage 
    };
    if (this.searchList.length == 0) {
      //解决vuex刷新，数据丢失
      Indicator.open();
      //console.log(this.params);
      this.firstPage(this.params);
    }
  },
  computed: {
    //...mapState(["searchList"])
  },
  methods: {
    tab(index) {
      // if(this.isActive == index){
      //   return;
      // }
      this.isActive = index;
      if(index == 0){
        this.initData('');//综合
        Indicator.open();
        this.firstPage(this.params);
      }
      if(index == 1){
        this.initData('salesDesc');//销量降序
        //console.log(this.params);
        Indicator.open();
        this.firstPage(this.params);
      }
      if (index == 2) {
        //this.reverse = !this.reverse;
        if(!this.reverse){
          this.isActive = '3';
          this.params.orderType = 'priceAsc';//价格升序
          Indicator.open();
          //console.log(this.params);
          this.firstPage(this.params);
          setTimeout(()=>{
            this.reverse = true;
          },0)
        }else{
          this.isActive = index;
          //this.initData('priceAsc');
          this.params.orderType = 'priceDesc';//价格降序
          Indicator.open();
          this.firstPage(this.params);
          setTimeout(()=>{
            this.reverse = false;
          },0)
        }

      }else{
        this.reverse = false;
      }
    },
    search() {
      this.$router.push("/search");
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
    initData(can){
      this.currentPage = 1;
      this.allLoaded = false;
      this.searchList = [];//清除缓存
      this.params.orderType = can;
    },
    goDetail(sn) {
      this.$router.push({ name: "detail", params: { sn: sn } });
    },
    firstPage(params) {
      search(params)
        .then(res => {
          console.info(res);
          Indicator.close();
          if (res.result === true) {
            let data = res.data.page.list;
            let lastPage = res.data.page.lastPage;//总共页数
            //alert(data.length)
            if (data.length == 0) {
              this.noData = true;
            }
            if (lastPage <= this.currentPage) { 
              this.allLoaded = true; //禁止上拉
            } else{
              this.allLoaded = false;
            }
            //this.$store.commit("changeSearchList", data);
            this.searchList = data;
          }else{
            console.log(res.msg);
          }
          
        })
        .catch(err => {
          console.info(err);
        });
    },
    nextPage() {
      ++this.currentPage;
      //alert(this.currentPage)
      let params = {
        keyword: this.tips, token: this.token, pageNum: this.currentPage 
      };
      search(params)
        .then(res => {
          Indicator.close(); //数据加载完成，关闭加载中
          if (res.result === true) {
            let data = res.data.page.list;
            let lastPage = res.data.page.lastPage;
            if (data.length == 0) {
              this.noData = true;
            }
            data.forEach(element => {
              this.searchList.push(element);
            });
            if (lastPage <= this.currentPage) { 
              this.allLoaded = true; //禁止上拉
            } else{
              this.allLoaded = false;
            }
            
          }else{
            console.log(res.msg);
          }

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
  position: relative;
  .sort-order {
    width: 0;
    height: 0;
    display: inline-block;
    border-width: 0 0.08rem 0.1rem;
    border-style: solid;
    border-color: transparent transparent #999; /*灰 透明 透明 */
    position: absolute;
    right: .89rem;
    top: .3rem;
    &.on{
      border-color: transparent transparent #333;
    }
    &.on + ul li:last-child{
      color: #333;
      font-weight: bold;
    }
  }
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
        i {
          border-color: transparent transparent #333;
        }
      }
      &:last-child {
        i {
          top: 0.05rem;
        }
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
        transform: rotate(180deg);
        
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
    height: 85vh;
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


