<template>
  <div>
    <div>
    <div class="awaitreceive" :style="{'-webkit-overflow-scrolling': scrollMode}">
      
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
              <div class="brief clear">
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
                <button class="cancel" @click="seeDetail(item.sn)">查看详情</button>
                <button class="toPay" @click="toConfirm(item.sn)">确认收货</button>
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
import { awaitXX } from "../../api";
import { getCookie, imgBaseUrl,isWeixin } from "../../util";
import { Indicator } from "mint-ui";
export default {
  name: "awaitReceive",
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
      copyUrl:''
    };
  },
  mounted() {
    // axios.get('http://192.168.0.103:9898/share/wx',{
    //   params: {
    //     url: 'http://24b39x8901.qicp.vip:10989/#/awaitshare'
    //   }
    // }).then(res=>{
    //   console.log(res);
    // }).catch(err=>{
    //   console.log(err);
    // });
    let token = getCookie("token");
    this.token = token;
    this.initData();
    //this.init();
  },
  methods: {
    cancelOrder() {},
    invite() {},
    async init() {
      let _this = this;
      let url = encodeURIComponent(window.location.href.split('#')[0]);
      // let data = await axios.get("http://192.168.0.103:9898/share/wx", {
      //   params: {
      //     url: url
      //   }
      // });
      //console.log(data, data.data.appId,data.data.noncestr);

      wx.config({
        debug: true,
        appId: data.data.appId, // 和获取Ticke的必须一样------必填，公众号的唯一标识
        timestamp: data.data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.data.noncestr, // 必填，生成签名的随机串
        signature: data.data.signature, // 必填，签名，见附录1
        //需要分享的列表项:发送给朋友，分享到朋友圈，分享到QQ，分享到QQ空间
        jsApiList: [
          "onMenuShareAppMessage",
          //"onMenuShareTimeline",
          //"onMenuShareQQ",
          //"onMenuShareQZone"
        ]
      });
      //处理验证失败的信息
      wx.error(function(res) {
        _this.$toast("验证失败返回的信息:", res);
      });
      wx.ready(function() {
        //分享给朋友
        wx.onMenuShareAppMessage({
          title: "_this.newDetailObj.title", // 分享标题
          desc: "_this.desc", // 分享描述
          link: window.location.href.split("#")[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: "", // 分享图标
          type: "", // 分享类型,music、video或link，不填默认为link
          dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
          success: function(res) {
            // 用户确认分享后执行的回调函数
            _this.$toast("分享给朋友成功返回的信息为:", res);
          },
          cancel: function(res) {
            // 用户取消分享后执行的回调函数
            _this.$toast("取消分享给朋友返回的信息为:", res);
          }
        });
        
      });
    },
    async initData() {
      Indicator.open();
      let res = await awaitXX({
        token: this.token,
        type: "2" ,//0-全部；1-待付款；2-待收货；3-待评价；4-交易完成；5-已关闭,6-待分享；
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
        type: "2", //0-全部；1-待付款；2-待收货；3-待评价；4-交易完成；5-已关闭；
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
    seeDetail(sn){
      this.$router.push({
        name: "receiveDetail",
        params: { origin: "receive", sn: sn }
      });
    },
    toConfirm(){
       MessageBox.confirm("确定已收货?", "温馨提示").then(res=>{
         
       }).catch(err=>{})
    }
   
  }
};
</script>
<style lang="less" scoped>
.nomore{
  margin-top: .2rem;
}
.awaitreceive {
  height: 90vh;
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
