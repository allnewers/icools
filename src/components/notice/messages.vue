<template>
  <div>
    <div class="list">
      <ul
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="isMoreLoading"
        infinite-scroll-distance="10"
        :infinite-scroll-immediate-check="false"
      >
        <li v-for="item in lists" :key="item.id">
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
        <mt-spinner :size="20" type="triple-bounce" class="loading-more"></mt-spinner>
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
      i: 0,
      token:'',
      type:''
    };
  },
  created() {
    let token = getCookie("token");
    let type = this.$route.params.type;
    this.token = token;
    this.type = type;
  },
  methods: {
    loadMore() {
      this.isLoading = true;
      this.noMore = false;

      if (!this.isMoreLoading) {
        this.i++;
        //alert(this.i);
        setTimeout(() => {
          getNoticeDetail({
            token: this.token,
            type: this.type,
            pageNum:this.i
          })
            .then(res => {
              if (res.result === true) {
                this.moreList = res.data.list;
                //alert(this.moreList.length)
                if (this.moreList.length < 10) {
                  this.noMore = true;
                  this.isLoading = false;
                  this.isMoreLoading = true;
                } else {
                  this.isLoading = true;
                  this.noMore = false;
                }
                this.moreList.forEach(item => {
                  this.lists.push(item);
                });
              } else {
                this.$toast(res.msg);
              }
            })
            .catch(err => {});
          // this.noMore = false;
          // this.isMoreLoading = false;
        }, 1000);
      }
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
    max-height: 80vh;
    overflow-y: scroll;
    -webkit-overflow-scrolling:touch;
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
.loading-box {
  text-align: center;
  position: relative;
  height: 0.6rem;

  .loading-more {
    position: absolute;
    left: 35%;
    top: 0.1rem;
  }
  .loading-more-txt {
    font-size: 0.26rem;
    color: #666;
    line-height: 0.6rem;
  }
}
.no-more {
  text-align: center;
  line-height: 0.6rem;
  color: #666;
  font-size: 0.26rem;
}
</style>
