<template>
  <div>
    <div>
    <div class="awaitshare" :style="{'-webkit-overflow-scrolling': scrollMode}">
      
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
                <span class="fr">{{item.typeName}}</span>
              </div>
              <div class="brief clear" @click="seeDetail(item.sn)">
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
              <div class="fun-btn"> 
                <p v-if="item.paymentMethod===2" class="xianxia">到店付，分享{{item.shareNeedNum}}人免拼，还差{{item.shareNeedNum - item.shareOkNum}}人</p>
                <button v-if="item.paymentMethod!=2" class="cancel" @click="cancelOrder">取消订单</button>
                <button class="toPay" v-clipboard:copy="copyUrl" v-clipboard:error="onError" v-clipboard:success="onCopy" @click="share(item.productSn,item.groupbuyingReocrdsId)">复制链接去分享</button>
                <!-- <button v-else class="toPay" @click="getWxConfig(item.thumbnail,item.fullName,item.productSn)">去分享</button> -->
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
  </div>
</template>
<script>
import wx from "weixin-js-sdk";
import axios from "axios";
import { MessageBox } from "mint-ui";
import { awaitXX,wxShareConfig } from "../../api";
import { getCookie, imgBaseUrl,isWeixin } from "../../util";
import { Indicator } from "mint-ui";
import { wxConfig,shareMessage,shareTimeline } from '../../wx'
export default {
  name: "awaitshare",
  data() {
    return {
      token: "",
      awaitList: [],
      imgBaseUrl: imgBaseUrl,
      bottomStatus: "",
      allLoaded:false,
      showNoData:false,
      scrollMode:'touch',
      currentPage:1,
      copyUrl:'',
      isWx:false,
      groupId:'',//拼团id
    };
  },
  mounted() {
    let token = getCookie("token");
    this.token = token;
    this.isWx = isWeixin();
    this.initData();
    //this.getWxConfig();
  },
  methods: {
    getWxConfig(imgUrl,title,sn) {
      let _this = this;
      let url = encodeURIComponent(window.location.href.split('#')[0]);
      //alert(window.location.href.split('#')[0]);
      let links = window.location.href.split('#')[0] + '#/detail/' + sn;
      //let links = window.location.href.split('#')[0];
      //let link = encodeURIComponent(links);
      let link = links;
      wxShareConfig({
        url:url
      }).then(res=>{
        if(res.result = true){
          let data = res.data;
          alert(JSON.stringify(data));
          wxConfig(data.appId,data.timestamp,data.noncestr,data.signature);
          
          wx.ready(()=>{
            shareMessage(title,'desc',link,imgUrl);
            shareTimeline(title,link,imgUrl);
          });
        }else{
          this.$toast(res.msg);
        }
        
      }).catch(err=>{
        this.$toast(err);
      });
    },
    async initData() {
      Indicator.open();
      let res = await awaitXX({
        token: this.token,
        type: "6" ,//0-全部；1-待付款；2-待收货；3-待评价；4-交易完成；5-已关闭,6-待分享；
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
        type: "6", //0-全部；1-待付款；2-待收货；3-待评价；4-交易完成；5-已关闭；
        pageNum:this.currentPage
      });

      console.log(res);
      if (res.result === true) {
        let lastPage = res.data.lastPage;
        let data = [];
        if(res.data.list.length>=1){
          data = res.data.list;
        } 
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
    seeDetail(sn) {
      this.$router.push({
        name: "shareDetail",
        params: { origin: "awaitpay", sn: sn }
      });
    },
    share(sn,groupId) {
      let wx = isWeixin();
      let shareBaseUrl = window.location.host;//获取当前域名
      this.copyUrl = shareBaseUrl + "/detail/" + sn + '/' + groupId;
    },
    cancelOrder() {
      MessageBox.alert(
        "发起拼单24小时后，若拼单未成功将自动取消 并退款哦",
        "暂时无法取消订单"
      );
    },
    onCopy(){
      this.$toast('链接已复制，发给好友一起拼团吧~');
    },
    onError(){
       console.log('复制链接失败');
    }
  }
};
</script>
<style lang="less" scoped>
.nomore{
  margin-top: .2rem;
}
.awaitshare {
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
      p{
        float: left;
        font-size: .24rem;
        color: #333;
      }
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
