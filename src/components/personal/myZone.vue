<template>
  <div class="wrap">
    <div class="content" v-if="isLogin">
      <div class="header">
        <div class="user clear">
          <img class="fl" :src="imgUrl || userImg || defaultUserImg" alt>
          <input type="file" accept="image/*" @change="uploadImg()">
          <p class="fl">{{username+'，'+hoursTip}}</p>
        </div>

        <div class="settings" @click="jumpUrl('settings')">
          <img src="../../assets/img/set@2x.png" alt>
        </div>
        <div class="settings home" @click="jumpUrl('home')">
          <img src="../../assets/img/home1@2x.png" alt>
        </div>
      </div>
      <div class="orderRel cn">
        <div class="ma">
          <div class="top">
            我的订单
            <span class="more" @click="jumpUrl('completeList')">查看全部</span>
          </div>
        </div>
        <ul>
          <li @click="jumpUrl('awaitPay')">
            <img src="../../assets/img/topay@2x.png" alt>
            <p>待付款</p>
            <i v-if="awaitPayNum>0">{{awaitPayNum}}</i>
          </li>
          <li @click="jumpUrl('awaitshare')">
            <img src="../../assets/img/share@2x.png" alt>
            <p>待分享</p>
            <i v-if="awaitShareNum>0">{{awaitShareNum}}</i>
          </li>
          <li @click="jumpUrl('awaitReceive')">
            <img src="../../assets/img/shouhuo@2x.png" alt>
            <p>待收货</p>
            <i v-if="awaitReceiveNum>0">{{awaitReceiveNum}}</i>
          </li>
          <li @click="jumpUrl('awaitComment')">
            <img src="../../assets/img/comment@2x.png" alt>
            <p>待评价</p>
            <i v-if="waitReview>0">{{waitReview}}</i>
          </li>
        </ul>
      </div>
      <div class="myNotice cn">
        <div class="ma">
          <div class="top">我的消息</div>
        </div>
        <ul>
          <li @click="jumpUrl('notice')">
            <img src="../../assets/img/notice@2x.png" alt>
            <p>消息中心</p>
          </li>
          <li @click="goList()">
            <img src="../../assets/img/fapiao@2x.png" alt>
            <p>发票管理</p>
          </li>
          <li @click="jumpUrl('addressList')">
            <img src="../../assets/img/address@2x.png" alt>
            <p>收货地址</p>
          </li>
          <li @click="jumpUrl('updateUserInfo')">
            <img src="../../assets/img/infos@2x.png" alt>
            <p>信息管理</p>
          </li>
          <!-- <li>
            <img src="../../assets/img/reset@2x.png" alt>
            <p>重置密码</p>
          </li> -->
          <!-- <li @click="jumpUrl('couponList')">
            <img src="../../assets/img/discount@2x.png" alt>
            <p>优惠券</p>
          </li> -->
          <li @click="jumpUrl('collectList')">
            <img src="../../assets/img/collect@2x.png" alt>
            <p>商品收藏</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { getCookie } from "../../util";
import { updateAvatar ,getAvatar,initOrderNums } from '../../api'
import { mapActions,mapState } from 'vuex'
import defaultUserImg from '../../assets/img/avatar@2x.png'
import { Indicator } from "mint-ui";
export default {
  name: "myZone",
  data() {
    return {
      isLogin: false,
      username: "ttt",
      hoursTip: " ",
      token:'',
      defaultUserImg:defaultUserImg,
      userImg:'',
      awaitPayNum:0,//待付款的总数
      awaitShareNum:0,//待分享
      awaitReceiveNum:0,//待收货
      waitReview:0,//待评价
    };
  },
  computed:{
    ...mapState(['imgUrl'])
  },
  mounted() {
    let token = getCookie("token");
    let username = getCookie("username");
    let imgUrl = getCookie('userAvatar');
    this.token = token;
    this.username = username;
    this.userImg = imgUrl;
    
    if (token === null) {
      this.$toast({ message: "您尚未登录，请登录", duration: 1500 });
      setTimeout(() => {
        this.$router.push({
          name: "phonelogin",
          params: { urlCode: "myZone" }
        });
      }, 1500);
    } else {
      this.isLogin = true;
      if(this.imgUrl == ''){//刷新 vuex 'imgUrl'丢失，重新获取头像
        this.getUserImg([this.token,this]);
      }
      this.preshowNum();
    }
    this.getMycount();
  },
  methods: {
    ...mapActions(['uploadImg','getUserImg']),
    jumpUrl(url) {
      this.$router.push("/" + url);
    },
    async preshowNum(){
      let numRes = await initOrderNums({
        token:this.token
      });
      console.log(numRes);
      Indicator.close();
      if(numRes.result === true){
        this.awaitPayNum = numRes.data.waitPay;
        this.awaitShareNum = numRes.data.share;
        this.awaitReceiveNum = numRes.data.waitReceive;
        this.waitReview = numRes.data.waitReview;
      }else{
        this.$toast(numRes.msg);
      }
    },
    goList(){
      this.$router.push({name:'invoiceList',params:{origin:'myZone'}});
    },
    getMycount: function() {
      let self = this;
      let date = new Date();
      if (date.getHours() >= 0 && date.getHours() < 12) {
        self.hoursTip = "上午好！";
      } else if (date.getHours() >= 12 && date.getHours() < 18) {
        self.hoursTip = "下午好！";
      } else {
        self.hoursTip = "晚上好！";
      }
    }
  }
};
</script>
<style lang="less" scoped>
.header {
  height: 2.64rem;
  background: url(../../assets/img/bg@2x.png) no-repeat;
  background-size: cover;
  position: relative;
  .user {
    padding: 0.71rem 0.84rem;
    position: relative;
    img {
      width: 1.2rem;
      height: 1.2rem;
      border-radius: 50%;
    }
    p {
      color: #fff;
      line-height: 1.2rem;
      padding-left: 0.2rem;
      font-size: 0.28rem;
      width: 65%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    input{
      position: absolute;
      width: 1.2rem;
      height: 1.2rem;
      left: .84rem;
      top: .71rem;
      z-index: 100;
      opacity: 0;
    }
  }
  .settings {
    position: absolute;
    top: 0.38rem;
    right: 1.18rem;
    width: 0.41rem;
    img {
      width: 100%;
    }
  }
  .home {
    right: 0.38rem;
  }
}
.orderRel{
  li{
    position: relative;
    i{
      position: absolute;
      width: 14px;
      height: 14px;
      border:1px solid #F24848;
      top: -8.4px;
      border-radius: 50%;
      left: 1rem;
      font-size: .18rem;
      color: #F24848;
      line-height: 14px;
      text-align: center;
      background: #fff;
    }
  }
}
.orderRel,
.myNotice {
  ul {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    padding: 0.3rem 0;
    li {
      flex: 25% 0 0;
      text-align: center;
      img {
        width: 0.44rem;
        height: 0.44rem;
        display: inline-block;
      }
      p {
        line-height: 0.5rem;
        font-size: 0.24rem;
        color: #333;
      }
    }
  }
}
.myNotice {
  ul {
    padding: 0.3rem 0 0;
    li {
      margin-bottom: 0.3rem;
    }
  }
}
.cn {
  margin: 0.2rem auto 0;
  background: #fff;
  //border-radius: 4px;
}
.ma {
  padding-left: 0.28rem;
}
.top {
  height: 0.9rem;
  line-height: 0.9rem;
  font-size: 0.26rem;
  font-weight: 400;
  color: #666;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 0.28rem 0 0;
  span {
    float: right;
    position: relative;
    padding-right: 0.3rem;
    color: #666;
    &::after {
      content: "";
      height: 0.16rem;
      width: 0.16rem;
      display: block;
      transform: rotate(45deg);
      border-top: 1px solid #666;
      border-right: 1px solid #666;
      position: absolute;
      right: 0;
      top: 0.36rem;
    }
  }
}
</style>
