<template>
  <div v-if="isShow">
    <div class="payState clear">
      <div class="gouIcon fl">
        <img src="../../assets/img/gou.png" alt>
      </div>
      <div class="txts fl">
        <h2>支付成功!</h2>
        <p>感谢您的购买，祝您生活愉快！</p>
      </div>
    </div>
    <div class="share mt20">
      <h2 v-if="defaultAvatars>0">还差{{defaultAvatars}}人拼购成功，快来一起拼团吧</h2>
      <h2 v-if="defaultAvatars==0">拼团成功！</h2>
      <div class="time-down mt"><span>剩余</span><count-down class="timeStamp"
                          :currentTime="nowTimestamp"
                          :startTime="nowTimestamp"
                          :endTime="endTimestamp"
                          :tipText="'距离开始文字1'"
                          :tipTextEnd="'距离结束文字1'"
                          :endText="'结束自定义文字2'"
                          :dayTxt="'天'"
                          :hourTxt="':'"
                          :minutesTxt="':'"
                          :secondsTxt="''"
                        ></count-down><span>结束</span></div>
      <div class="avatar mt">
        <span :class="{tuanz:v.isCreator}" v-for="(v,n) in avatarList" :key="n">
          <img class="main" :src="v.avatar || defaultImg" alt>
        </span>
        <span v-for="(val,index) in defaultAvatars" :key="val">
          <img class="main" src="../../assets/img/default.png" alt="">
        </span>
      </div>
      <div
        class="shareOut mt"
        @click="share"
        v-clipboard:copy="copyUrl"
        v-clipboard:error="onError"
        v-clipboard:success="onCopy"
      >分享出去</div>
    </div>
    <div class="urlto">
      <button @click="goShare">查看订单</button>
      <button @click="goHome">返回首页</button>
    </div>
  </div>
</template>
<script>
import { tuanAvatars } from "../../api";
import { getCookie, delCookie } from "../../util";
import CountDown from "vue2-countdown";
import defaultImg from '../../assets/img/user@2x.png'
export default {
  name: "payOver",
  data() {
    return {
      copyUrl: "",
      orderSn: "",
      isShow: false,
      avatarList: [],//参加拼团的人数
      productSn: "",
      pinNum:0,//后台设置的 拼团人数
      defaultAvatars:1,//还差几人拼团 成功
      nowTimestamp:0,
      endTimestamp:0,
      defaultImg
    };
  },
  components:{
    CountDown
  },
  mounted() {
    let sn = getCookie("orderSn");
    this.orderSn = sn;
    //this.orderSn = '2019042934441';
    //alert(this.orderSn);
    if(this.orderSn != null){
      this.isShow = true;
    }else{//直接进入付款完成页 重定向到首页
      this.$router.replace('/');
      return;
    }
    //获取拼团的 成员
    tuanAvatars({
      sn: this.orderSn
    })
      .then(res => {
        console.log(res);
        if (res.result === true) {
          this.productSn = res.data.prodcutSN;
          this.avatarList = res.data.groupInfoList;
          this.pinNum = res.data.totalNum;
          this.nowTimestamp = res.data.nowDate;
          this.endTimestamp = res.data.endDate;
          this.getDefaultNum();
          delCookie("orderSn"); //支付完成删除 订单sn cookie
        } else {
          this.$toast(res.msg);
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    goShare() {
      this.$router.replace("/awaitShare");
    },
    goHome() {
      this.$router.replace("/");
    },
    getDefaultNum(){
      this.defaultAvatars = parseInt(this.pinNum - this.avatarList.length);
    },
    share() {
      //let wx = isWeixin();
      let shareBaseUrl = window.location.host; //获取当前域名
      this.copyUrl = shareBaseUrl + "/detail/" + this.productSn;
    },
    onCopy() {
      this.$toast("链接已复制，发给好友一起拼团吧~");
    },
    onError() {
      this.$toast("复制链接失败");
    }
  }
};
</script>
<style lang="less" scoped>
.mt {
  margin-top: 0.3rem;
}
.mt20 {
  margin-top: 0.2rem;
}
.share {
  background: #fff;
  text-align: center;
  padding: 0.3rem;
  h2 {
    font-size: 0.26rem;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 0.5rem;
  }
  .time-down {
    font-size: 0.24rem;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    overflow: hidden;
    text-align: center;
    //padding-left: 2.3rem;
    .timeStamp{
      display: inline;
      padding: 0 .1rem;
      overflow: hidden;
    }
  }
  .avatar {
    .tuanz {
      position: relative;
      &::before {
        content: "团长";
        height: 0.3rem;
        width: 0.6rem;
        border-radius: 0.15rem;
        background: #ff3737;
        position: absolute;
        border-bottom: 0;
        left: 0.2rem;
        bottom: -0.1rem;
        z-index: 100;
        font-size: 0.12rem;
        text-align: center;
        line-height: 0.32rem;
        color: #fff;
      }
    }

    img {
      display: inline;
      height: 0.82rem;
      width: 0.82rem;
      padding: 0 0.1rem;
      position: relative;
      border-radius: 50%;
    }
  }
  .shareOut {
    height: 0.8rem;
    text-align: center;
    line-height: 0.8rem;
    background: #ff3737;
    color: #fff;
    font-size: 0.28rem;
    width: 65%;
    margin: 0.3rem auto;
    border-radius: 4px;
  }
}
.payState {
  padding: 0.46rem 0 0.46rem 1.86rem;
  background: #f9faf9;
  .txts {
    margin-left: 0.1rem;
    h2 {
      font-size: 0.3rem;
      color: #333;
      font-weight: bold;
    }
    p {
      font-size: 0.2rem;
      color: #333;
    }
  }
  .gouIcon {
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    background: #00be12;
    text-align: center;
    margin-top: 0.05rem;
    img {
      width: 0.42rem;
      display: inline;
      padding-top: 0.16rem;
    }
  }
}
.urlto {
  display: flex;
  justify-content: space-around;
  margin-top: 0.4rem;
  button {
    width: 2.7rem;
    height: 0.77rem;
    border: 1px solid #666;
    text-align: center;
    line-height: 0.77rem;
    font-size: 0.3rem;
    color: #333;
    border-radius: 4px;
  }
}
</style>
<style lang="less">
.timeStamp{
      display: inline;
      padding: 0 .1rem;
      overflow: hidden;
      p{
        display: inline;
        span,i{
          color: #ff3737;
        }   
      }
    }
</style>

