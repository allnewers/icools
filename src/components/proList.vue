<template>
  <div class="wrap">
    <div class="header">
      <div class="tabar">
        <ul>
          <li
            v-for="(item,index) in tabBar"
            :class="{active:isActive == index}"
            @click="subTab(index,item.items,item.id,'subNav')"
            :key="item.id"
          >
            <span>{{item.name}}</span>
          </li>
        </ul>
      </div>
      <div class="subNav">
        <ul>
          <li
            v-for="(item ,index) in thirdNavList"
            :class="{selected:isSelected == index}"
            @click="thirdNavTab(item.id,index,'thirdNav')"
            :key="item.id"
          >{{item.name}}</li>
          <li @click="moreThirdNav">...</li>
        </ul>
      </div>
    </div>
    <div class="prolist">
      <!-- 标题 -->
      <!-- <Top :types="showType1"/> -->
      <!-- 商品列表（新品） -->
      <div class="list-show" :style="{'-webkit-overflow-scrolling': scrollMode}">
        <mt-loadmore
          v-if="!showNoData"
          :bottom-method="loadBottom"
          :bottom-all-loaded="allLoaded"
          :auto-fill="false"
          :bottom-distance="40"
          @bottom-status-change="handleBottomChange"
          ref="loadmore"
        >
          <ul>
            <li v-show="NavProductList.length>=1" v-for="item in NavProductList" :key="item.id">
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
        <div class="noData" v-show="showNoData">
          <img src="../assets/img/noData.png" alt="">
          <span>暂无数据</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Top from "./common/top";
import hotImg from "../assets/img/newPro@2x.png";
import { getNavList, search } from "../api";
import { imgBaseUrl } from "../util";
import { Indicator } from "mint-ui";
export default {
  name: "proList",
  data() {
    return {
      tips: "苹果XS Max",
      tabBar: [], //二三级导航数据
      isActive: "0",
      showType1: hotImg,
      thirdNavList: [], //三级导航列表
      id1: "",
      id2: "",
      id3: "",
      isSelected: null,
      whichGrageNav: "subNav",
      NavProductList: [], //商品列表
      allThirdNavList: [],
      params: {},
      bottomStatus: "",
      noData: false,
      scrollMode: "touch",
      allLoaded: false, //商品 是否全部加载。 true时，表示禁止 调用loadBottom
      currentPage: 1,
      showNoData: false,
      imgBaseUrl:imgBaseUrl
    };
  },
  components: {
    Top
  },
  mounted() {
    let id = this.$route.params.id;
    this.id1 = id;
    Indicator.open();
    getNavList({ id: id })
      .then(res => {
        //console.log(res.data);
        this.tabBar = res.data; //二三级导航 数据;
        this.id2 = ""; //清空缓存;
        this.id2 = res.data[0].id; //默认展示商品 查询 所需的二级导航id
        this.allThirdNavList = res.data[0].items;
        this.thirdNavList = res.data[0].items.slice(0, 4); //初始化三级导航列表；
        this.initSubNavProduct(); //初始化 二级导航的 商品列表
      })
      .catch();
  },
  methods: {
    initSubNavProduct() {
      //查询 初始化的 二级导航 商品列表
      search({ id1: this.id1, id2: this.id2 })
        .then(res => {
          //console.log(res);
          if (res.result === true) {
            this.NavProductList = res.data.page.list;
            if (this.NavProductList.length == 0) {
              this.showNoData = true;
            }
            Indicator.close();
          }else{
            console.log(res.msg);
          }
          
        })
        .catch(err => {
          console.log(err);
        });
    },
    subTab(index, thirdNavList, subNavId, navGrade) {
      //alert(JSON.stringify(thirdNavList));
      if(this.isActive == index) return;
      this.allLoaded = false;
      this.thirdNavList = []; //清空缓存
      this.NavProductList = []; //清空缓存
      this.whichGrageNav = ""; //清空缓存
      this.isSelected = null; //清空缓存
      this.showNoData = false;
      this.isActive = index;
      this.currentPage = 1;
      this.whichGrageNav = navGrade;
      this.id2 = subNavId; //给三级导航 查询商品列表 提供二级导航id
      this.allThirdNavList = thirdNavList;
      this.thirdNavList = thirdNavList.slice(0, 4); //切换 三级导航 列表
      Indicator.open();
      this.firstPage();
    },
    thirdNavTab(id3, index, navGrade) {
      if(this.isSelected == index) return;
      this.allLoaded = false;
      this.NavProductList = []; //清空缓存
      this.whichGrageNav = "";
      this.whichGrageNav = navGrade;
      this.id3 = id3;
      this.currentPage = 1;
      this.showNoData = false;
      this.isSelected = index;
      Indicator.open();
      this.firstPage();
    },
    firstPage() {
      this.judgeNavGrade();
      //alert(JSON.stringify(params));
      search(this.params)
        .then(res => {
          //切换 导航商品 列表
          //console.log(res);
          if (res.result === true) {
            let data = res.data.page.list;
            let lastPage = res.data.page.lastPage;//总共页数
            this.NavProductList = res.data.page.list;
            if (this.NavProductList.length == 0) {
              this.showNoData = true;
            }
            if (lastPage <= this.currentPage) { 
              this.allLoaded = true; //禁止上拉
            } else{
              this.allLoaded = false;
            }
            Indicator.close();
          }else{
            console.log(res.msg);
          }
          
        })
        .catch(err => {
          console.log(err);
        });
    },
    moreThirdNav() {
      let data = JSON.stringify(this.allThirdNavList);
      this.$router.push({
        path: "/brandList",
        query: { id1: this.id1, id2: this.id2, thirdNavList: data }
      });
    },
    judgeNavGrade() {
      //判断 哪一级导航
      let whichGrageNav = this.whichGrageNav;
      if (whichGrageNav === "subNav") {
        this.params = {
          id1: this.id1,
          id2: this.id2,
          pageNum: this.currentPage
        };
      } else if (whichGrageNav === "thirdNav") {
        this.params = {
          id1: this.id1,
          id2: this.id2,
          id3: this.id3,
          pageNum: this.currentPage
        };
      } else {
        console.log("不清楚查询哪级导航的商品列表");
      }
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
    nextPage() {
      ++this.currentPage;
      this.judgeNavGrade();
      //console.log(this.params) ;
      search(this.params)
        .then(res => {
          //切换 导航商品 列表
          console.log(res);
          if (res.result === true) {
            let data = res.data.page.list;
            let lastPage = res.data.page.lastPage;
            if (this.NavProductList.length == 0) {
              this.showNoData = true;
            }
            data.forEach(element => {
              this.NavProductList.push(element);
            });
            if (lastPage <= this.currentPage) { 
              this.allLoaded = true; //禁止上拉
            } else{
              this.allLoaded = false;
            }
            Indicator.close();
          }else{
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
  border-bottom: 1px solid #f0f0f0;
}
.subNav {
  background: #fff;
  ul {
    // display: flex;
    // flex-wrap: wrap;
    // justify-content: space-between;
    overflow: hidden;
    padding: 0.28rem 0.28rem 0;
    position: relative;
    //border-bottom: 1px solid #f0f0f0;
    li {
      float: left;
      padding: 0 0.2rem;
      height: 0.5rem;
      min-width: 0.65rem;
      background: rgba(244, 244, 244, 1);
      border-radius: 0.25rem;
      line-height: 0.5rem;
      text-align: center;
      font-size: 0.24rem;
      color: #666;
      margin-bottom: 0.3rem;
      margin-right: 0.2rem;
      border: 1px solid #f0f0f0;
      &.selected {
        background: #fff2f2;
        border-color: #f24848;
        color: #f24848;
      }
      &:last-child {
        width: 0.6rem;
        font-weight: 600;
        font-size: 0.32rem;
        line-height: 0;
        letter-spacing: 4px;
        position: absolute;
        margin: 0;
        right: 0.28rem;
      }
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
.tabar {
  border-bottom: 1px solid #f0f0f0;
  ul {
    display: flex;
    justify-content: space-around;
    background: #fff;
    height: 0.86rem;
    line-height: 0.86rem;
    font-weight: 400;
    margin-bottom: 0.05rem;
    li {
      flex: 1;
      text-align: center;
      font-size: 0.28rem;
      color: rgba(153, 153, 153, 1);
      position: relative;
      &.active {
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        span {
          border-bottom: 1px solid #333;
          padding: 0.1rem;
        }
      }
    }
  }
}
.prolist {
  margin-top: 2.05rem;
  .list-show {
    height: 72vh;
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


