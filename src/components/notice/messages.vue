<template>
  <div>
    <div class="list">
      <ul
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="isMoreLoading"
        infinite-scroll-distance="10"
        :infinite-scroll-immediate-check="true"
      >
        <li v-for="(item,index) in lists" :key="item.id">
          <div class="time clear">
            <div class="img fl">
              <img src="../../assets/img/oclock@2x.png" alt>
            </div>
            <p>{{item.modifyDate | time}}</p>
          </div>
          <div class="content">
            <h3>{{item.title}}</h3>
            <p>{{item.content}}</p>
          </div>
        </li>
      </ul>
      <div class="loading-box tc" v-if="isLoading">
        <mt-spinner size="20" type="triple-bounce" class="loading-more"></mt-spinner>
        <span class="loading-more-txt">加载中...</span>
      </div>
      <div class="no-more" v-if="noMore">没有更多了~</div>
    </div>
  </div>
</template>
<script>
import { getNoticeDetail } from "../../api";
import { getCookie } from "../../util";
import { setTimeout } from "timers";
export default {
  name: "messages",
  data() {
    return {
      lists: [],
      moreList: [],
      isLoading: false,
      isMoreLoading: false,
      noMore: false,
      i: 0
    };
  },
  mounted() {
    let token = getCookie("token");
    let type = this.$route.params.type;
    let i = 0;
    //初始化 加载数据前5条
    getNoticeDetail({
      token: token,
      type: type
    })
      .then(res => {
        if (res.result === true) {
          this.lists = res.data.list.slice(i * 5, (i + 1) * 5);
        } else {
          this.$toast(res.msg);
        }
      })
      .catch(err => {
        console.info(err);
      });
  },
  methods: {
    loadMore() {
      let token = getCookie("token");
      let type = this.$route.params.type;
      this.isMoreLoading = true;
      this.isLoading = true;
      this.noMore = false;
      setTimeout(() => {
        getNoticeDetail({
          token: token,
          type: type
        })
          .then(res => {
            this.i++;
            if (res.result === true) {
              this.moreList = res.data.list.slice(this.i * 5, (this.i + 1) * 5);
              //alert(this.moreList.length)
              if(this.moreList.length == 0){
                this.noMore = true;
                this.isLoading =false;
              }else{
                this.isLoading = false;
                this.moreList.forEach((item)=>{
                  this.lists.push(item);
                });
              }
            } else {
              this.$toast(res.msg);
            }
          })
          .catch(err => {});
          this.noMore = false;
          this.isMoreLoading = false;
      }, 1000);
    }
  },
  filters: {
    time(val) {
      return val.slice(0, 10);
    }
  }
};
</script>
<style lang="less" scoped>
.list {
  padding: 0.28rem;
  ul {
    max-height: 100vh;
    overflow-y: auto;
    li {
      margin-top: 0.3rem;
      .time {
        .img {
          width: 0.3rem;
          height: 0.3rem;
          margin-right: 0.3rem;
          img {
            max-width: 100%;
          }
        }
        p {
          float: left;
          font-size: 0.22rem;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
        }
      }
      .content {
        background: #fff;
        padding: 0.28rem;
        margin-top: 0.2rem;
        h3 {
          font-size: 0.3rem;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
        }
        p {
          font-size: 0.26rem;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          margin-top: 0.1rem;
          line-height: 0.45rem;
        }
      }
    }
  }
}
.loading-box{
  text-align: center;
  position: relative;
  height: .6rem;
 
  
  .loading-more{
    position: absolute;
    left: 35%;
    top: .1rem;
  }
  .loading-more-txt{
    font-size: .26rem;
    color: #666;
    line-height:.6rem;
  }
}
.no-more{
  text-align: center;
  line-height: .6rem;
  color: #666;
  font-size: .26rem;
}

</style>
