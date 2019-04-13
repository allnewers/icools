<template>
  <div>
    <div class="wrap" v-if="showContent">
      <div class="brief">
        <ul>
          <li
            v-for="(item,index) in tabBar"
            :class="{active:isActive == index}"
            @click="tab(index)"
            :key="index"
          >{{item + '('+ subNum[index]['len'] + ')'}}</li>
        </ul>
      </div>
      <div class="comments-list" :style="{'-webkit-overflow-scrolling': scrollMode}">
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
          <li v-for="(item,index) in commentsList" :key="item.id">
            <div class="user">
              <img v-lazy="item.userImage" alt>
              <p>{{item.username}}</p>
            </div>
            <p class="content">{{item.content}}</p>
            <div class="timeType">
              <span>{{item.createDate | time}}</span>
              <span>{{item.sku}}</span>
            </div>
            <div class="uploadImg">
              <div class="img-item">
                <img src="../assets/img/prod@2x.png" alt>
              </div>
              <div class="img-item">
                <img src="../assets/img/prod@2x.png" alt>
              </div>
              <div class="img-item">
                <img src="../assets/img/prod@2x.png" alt>
              </div>
              <div class="img-item">
                <img src="../assets/img/prod@2x.png" alt>
              </div>
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
    </div>
    <div class="noData" v-if="showNoData">
          <img src="../assets/img/noData.png" alt="">
          <span>暂无数据</span>
        </div>
  </div>
</template>
<script>
import { getCommentList } from "../api";
import { Indicator } from "mint-ui";
export default {
  name: "comments",
  data() {
    return {
      tabBar: ["全部", "好评", "中评", "差评", "晒图"],
      isActive: "0",
      currentPage: 1,
      goodsId: "",
      showContent: false,
      commentsList:[],
      showNoData:false,
      allLoaded: false, //商品 是否全部加载。 true时，表示禁止 调用loadBottom
      subNum:[{len:0},{len:1},{len:3},{len:0},{len:0}],
      type:1,
      scrollMode:"touch",
      bottomStatus: "",
    };
  },
  mounted() {
    this.goodsId = this.$route.params.goodsId;
    this.initComments(); //默认展示全部评论 第一页 1-全部；2-好评；3-中评；4-差评；5-晒图
  },
  methods: {
    tab(index) {
      let arr = [1,2,3,4,5];
      if(this.isActive == index) return;
      this.isActive = index;
      this.commentsList = [];
      this.type = arr[index];
      this.initComments();
    },
    initComments() {
      Indicator.open();
      getCommentList({
        id: this.goodsId,
        type: this.type,
        pageNum: this.currentPage
      })
        .then(res => {
          Indicator.close();
          console.log(res);
          if (res.result === true) {
            this.showContent = true;
            let data = res.data.list 
            this.commentsList = data;
            this.subNum[0]['len'] = data.length;
            if(data.length == 0){
              this.showNoData = true;
            }
          }else{
            this.$toast(res.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
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
    nextPage(){
      ++this.currentPage;
      getCommentList({
        id: this.goodsId,
        type:this.type,
        pageNum: this.currentPage
      })
        .then(res => {
          Indicator.close();
          console.log(res);
          if (res.result === true) {
            this.showContent = true;
            let data = res.data.list ;
            let lastPage = res.data.lastPage;
            this.subNum[0]['len'] = data.length;

            data.forEach(element => {
              this.commentsList.push(element);
            });
            if(data.length == 0){
              this.showNoData = true;
            }
            if (lastPage <= this.currentPage) { 
              this.allLoaded = true; //禁止上拉
            } else{
              this.allLoaded = false;
            }
          }else{
            this.$toast(res.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  filters:{
    time(val){
      return val.substr(0,10);
    }
  }
};
</script>
<style lang="less" scoped>
.brief {
  padding: 0.3rem 0.28rem 0;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  ul {
    overflow: hidden;
    li {
      float: left;
      height: 0.6rem;
      border-radius: 0.3rem;
      padding: 0 0.23rem;
      border: 1px solid #f0f0f0;
      color: #666;
      text-align: center;
      line-height: 0.6rem;
      margin: 0 0.5rem 0.2rem 0;
      font-size: 0.26rem;
      &.active {
        background: #333;
        color: #fff;
      }
    }
  }
}
.comments-list {
  background: #fff;
  padding: 0 0.28rem 0.3rem;
  height: 72vh;
  overflow: scroll;
  li {
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 0.2rem;
  }
  .user {
    line-height: 0.9rem;
    display: flex;
    padding: 0.3rem 0;
    img {
      height: 0.9rem;
      width: 0.9rem;
      border-radius: 50%;
    }
    p {
      padding-left: 0.2rem;
      font-size: 0.3rem;
      font-weight: 400;
      width: 2rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  p.content {
    font-size: 0.3rem;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 0.5rem;
  }
  .timeType {
    span {
      font-size: 0.24rem;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
    }
  }
  .uploadImg {
    overflow: hidden;
    margin-top: 0.2rem;
    .img-item {
      height: 2.2rem;
      width: 2.2rem;
      float: left;
      margin-right: 0.1rem;
      margin-bottom: 0.1rem;
    }
  }
}
</style>


