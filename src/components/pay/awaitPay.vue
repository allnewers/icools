<template>
  <div>
    <div class="payList" :style="{'-webkit-overflow-scrolling': scrollMode}">
      
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
            <li v-for="(item,index) in awaitList" :key="item.id">
              <div class="top clear">
                <p class="fl">订单编号：{{item.sn}}</p>
                <span v-if="item.paymentMethod != 2" class="fr">{{item.typeName}}</span>
                <span v-if="item.paymentMethod == 2" class="fr">助力完成</span>
              </div>
              <div class="brief clear" @click="pay(item.sn)">
                <div class="thumbnail fl">
                  <img :src="imgBaseUrl+item.thumbnail" alt>
                </div>
                <div class="txts fr">
                  <h3>{{item.fullName}}</h3>
                  <p>
                    <span>¥{{item.totalAmount}}</span>
                    <span>×{{item.quantify}}</span>
                  </p>
                </div>
              </div>
              <div class="fun-btn" v-if="item.paymentMethod !== 2">
                <button class="cancel" @click="cancelOrder">取消订单</button>
                <button class="toPay" @click="pay(item.sn)">去支付</button>
              </div>
              <div class="fun-btn" v-if="item.paymentMethod === 2">
                <button class="cancel"><a href="tel:400-082-5588">联系客服</a></button>
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
          <img src="../../assets/img/noData.png" alt>
          <span>暂无数据</span>
        </div>
      </div>
   
  </div>
</template>
<script>
import { MessageBox } from "mint-ui";
import { awaitXX } from "../../api";
import { getCookie, imgBaseUrl } from "../../util";
import { Indicator } from "mint-ui";
export default {
  name: "awaitPay",
  data() {
    return {
      token: "",
      awaitList: [],
      imgBaseUrl: imgBaseUrl,
      bottomStatus: "",
      allLoaded:false,
      showNoData:false,
      scrollMode:'touch',
      currentPage:1
    };
  },
  
  mounted() {
    let token = getCookie("token");
    this.token = token;
    this.initData();
  },
  methods: {
    async initData() {
      Indicator.open();
      let res = await awaitXX({
        token: this.token,
        type: "1" ,//0-全部；1-待付款；2-待收货；3-待评价；4-交易完成；5-已关闭；
        pageNum:this.currentPage
      });
      console.log(res);
      if (res.result === true) {
        let lastPage = res.data.lastPage;
        this.awaitList = res.data.list;
        if (this.awaitList.length == 0) {
              this.showNoData = true;
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
      
    },
    loadBottom() {
      if (!this.allLoaded) {
        Indicator.open();
        this.nextPage();
        this.$refs.loadmore.onBottomLoaded(); //通知loadmore组件从新渲染，计算
      }
    },
    async nextPage(){
      ++this.currentPage;
      Indicator.open();
      let res = await awaitXX({
        token: this.token,
        type: "1", //0-全部；1-待付款；2-待收货；3-待评价；4-交易完成；5-已关闭；
        pageNum:this.currentPage
      });

      console.log(res);
      if (res.result === true) {
        let lastPage = res.data.lastPage;
        let data = res.data.list;
        if (this.awaitList.length == 0) {
          this.showNoData = true;
        }
        data.forEach(element => {
          this.awaitList.push(element);
        });
        if (lastPage <= this.currentPage) { 
          this.allLoaded = true; //禁止上拉
        } else{
          this.allLoaded = false;
        }
        Indicator.close();
      } else {
        console.log(res.msg);
      }

    },
    handleBottomChange(status) {
      //alert(status);
      this.bottomStatus = status;
    },
    cancelOrder() {
      MessageBox.alert(
        "保存订单后，1小时之内未付款，将自动取消订单",
        "暂时无法取消订单"
      );
    },
    pay(sn) {
      this.$router.push({
        name: "payDetail",
        params: { origin: "awaitpay", sn: sn }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.nomore{
  margin-top: .2rem;
}
.payList {
  height: 100vh;
  overflow: scroll;
  li {
    background: #fff;
    margin-top: 0.2rem;
    .top {
      height: 0.9rem;
      line-height: 0.9rem;
      padding: 0 0.28rem;
      font-size: 0.28rem;
      border-bottom: 1px solid #f0f0f0;
      p {
        color: #666;
      }
      span {
        color: #ff3737;
      }
    }
    .brief {
      padding: 0.28rem 0.2rem;
      border-bottom: 1px solid #f0f0f0;
      .thumbnail {
        width: 1.5rem;
        height: 1.5rem;
        img {
          max-width: 100%;
          height: 100%;
          border: 1px solid #f0f0f0;
        }
      }
      .txts {
        width: 5.3rem;
        font-size: 0.28rem;

        h3 {
          font-weight: 400;
          color: #333;
          font-size: 0.28rem;
        }
        p {
          color: #666;
          margin-top: 0.4rem;
          overflow: hidden;
          text-align: justify;
          span {
            float: left;
            &:last-child {
              float: right;
            }
          }
        }
      }
    }
    .fun-btn {
      height: 0.9rem;
      line-height: 0.85rem;
      text-align: right;
      padding: 0 0.28rem;
      button {
        vertical-align: middle;
        padding: 0.1rem 0.15rem;
        border: 1px solid #f0f0f0;
        border-radius: 4px;
      }
      .cancel {
        color: #666;
      }
      .toPay {
        background: #ff3737;
        color: #fff;
        border-color: #fff;
        margin-left: 0.4rem;
      }
    }
  }
}
</style>
