<template>
  <div v-if="comeData">
    <div class="status await">
      <i v-if="paymentMethod!==2">!</i>
      <span v-if="paymentMethod!==2">{{allData.typeName}}</span>
      <span v-if="paymentMethod===2">助力完成，请前往店内支付</span>
    </div>
    <div class="address" v-if="paymentMethod!==2">
      <h3>收货地址</h3>
      <div class="nameTel">
        <span>{{allData.consignee}}</span>
        <span>{{allData.phone}}</span>
      </div>
      <p class="words">{{allData.areaName}}{{allData.address}}</p>
    </div>
    <div class="address" v-if="paymentMethod===2">
      <h3>门店地址</h3>
      <p class="words">湖北省 襄阳市 樊城区 定中街道 天元四季城 1楼 肯德基对面 爱酷士</p>
    </div>
    <div class="zhuli" v-if="paymentMethod===2">
      <h3>
        邀请
        <span>{{wrapData.shareNeedNum}}</span>人助力即可免拼
        <!-- <em v-if="needNums-hasTuanNum>0">，还差{{needNums-hasTuanNum}}人</em> -->
      </h3>
      <!-- <ul>
        <li :class="{hasOkNum:hasTuanNum > index}" v-for="(item,index) in needNums" :key="index">
          <div class="avatars" v-if="index < hasTuanNum">
            <img src="../../assets/img/zhuli.png" alt>
          </div>
          <div class="line" :class="{lastOk:index === hasTuanNum-1}"></div>
          <div class="circle"></div>
        </li>
      </ul> -->
      <div class="getZhuLi" :class="{gameOver:paymentMethod == 2}">助力已完成</div>
    </div>
    <div class="order-info">
      <div class="brief clear">
        <div class="thumbnail fl">
          <img :src="imgBaseUrl+info.thumbnail" alt>
        </div>
        <div class="txts fr">
          <h3>{{info.fullName}}</h3>
          <p>
            <span>¥{{info.price}}</span>
            <span>×{{info.quantity}}</span>
          </p>
        </div>
      </div>
      <ul>
        <li>
          <span>运费</span>
          <span>¥{{allData.freight}}</span>
        </li>
        <li>
          <span>优惠券</span>
          <span v-if="!allData.couponDiscount">无</span>
          <span v-if="allData.couponDiscount>=1">￥{{allData.couponDiscount}}</span>
          <span
            v-if="allData.couponDiscount<1&&allData.couponDiscount>0"
          >{{allData.couponDiscount*10}}折</span>
        </li>
        <li>
          <span>订单金额</span>
          <span>¥{{allData.totalAmount}}</span>
        </li>
      </ul>
    </div>
    <!-- <div class="paytype">
      <h3>支付方式</h3>
      <ul>
        <li>
          <input type="radio" value="weixin" v-model="values">
          <label for>
            <img src="../../assets/img/weixinpay.png" alt> 微信支付
          </label>
        </li>
        <li>
          <input type="radio" value="ali" v-model="values">
          <label for>
            <img src="../../assets/img/alipay.png" alt> 支付宝支付
          </label>
        </li>
      </ul>
    </div>-->
    <div class="orderNum">
      <h3>订单信息</h3>
      <ul>
        <li>
          <button
            class="btn-copy"
            @click="copy"
            data-clipboard-action="copy"
            data-clipboard-target="#copyTarget"
          >复制</button>
          <span>订单编号</span>
          <span id="copyTarget">{{allData.sn}}</span>
        </li>
        <li>
          <span>下单时间</span>
          <span>{{allData.createDate}}</span>
        </li>
      </ul>
    </div>
    <div class="blank" style="height:1.5rem;"></div>
    <div class="fun-btn" v-if="paymentMethod!==2">
      <button class="cancel" @click="cancelOrder">取消订单</button>
      <button class="toPay" @click="pay">付款</button>
    </div>
    <div class="contactUs" v-if="paymentMethod===2">
     
      <a href="tel:400-082-5588">联系客服</a>
      
    </div>
  </div>
</template>
<script>
import { MessageBox } from "mint-ui";
import { orderDetail } from "../../api";
import { getCookie, imgBaseUrl, toTop, setCookie } from "../../util";
import { Indicator } from "mint-ui";
export default {
  name: "payDetail",
  data() {
    return {
      needNums: 5, //需要的助力人数
      hasTuanNum: 5, //已经助力的人数
      values: "",
      sn: "",
      token: "",
      allData: "",
      info: "",
      imgBaseUrl: imgBaseUrl,
      comeData: false,
      wrapData:{}
    };
  },
  computed: {
    paymentMethod() {
      return this.allData.paymentMethod;
    }
  },
  mounted() {
    toTop(); //到顶部
    let token = getCookie("token");
    this.token = token;
    this.sn = this.$route.params.sn;
    this.initData();
  },
  methods: {
    async initData() {
      Indicator.open();
      let res = await orderDetail({
        token: this.token,
        sn: this.sn
      });
      console.log(res);
      if (res.result === true) {
        this.allData = res.data.order;
        this.info = res.data.order.items[0];
        this.wrapData = res.data;
        this.comeData = true;
      } else {
        console.log(res.msg);
      }
      Indicator.close();
    },
    copy() {
      let clipboard = new this.clipboard(".btn-copy");
      clipboard.on("success", () => {
        this.$toast("复制成功");
      });
      clipboard.on("error", () => {
        this.$toast("复制失败");
      });
    },
    cancelOrder() {
      MessageBox.alert(
        "保存订单后，1小时之内未付款，将自动取消订单",
        "暂时无法取消订单"
      );
    },
    pay() {
      // if(this.values == ''){
      //   this.$toast('请选择支付方式');
      // }
      // if(this.values === 'weixin'){
      //   this.$toast('weixin');
      // }else if(this.values === 'ali'){
      //   this.$toast('ali');
      // }
      setCookie("orderSn", this.sn);
      this.$router.push("/payType");
    }
  }
};
</script>
<style lang="less" scoped>
.status {
  height: 1.5rem;
  line-height: 1.5rem;
  position: relative;
  text-align: center;
  i {
    position: absolute;
    height: 0.3rem;
    width: 0.3rem;
    border-radius: 50%;
    color: #fff;
    font-size: 0.2rem;
    text-align: center;
    line-height: 0.3rem;
    left: 40%;
    top: 0.6rem;
  }
  span {
    padding-left: 0.3rem;
  }
  &.await {
    background: #fff4ea;
    color: #ff7f01;
    i {
      background: #ff7f01;
    }
  }
}
.address {
  padding: 0.28rem;
  background: #fff;
  h3 {
    font-size: 0.3rem;
    color: #333;
  }
  .nameTel {
    margin-top: 0.2rem;
    font-size: 0.3rem;
    color: #666;
    span {
      padding-right: 0.6rem;
    }
  }
  .words {
    margin-top: 0.2rem;
    font-size: 0.26rem;
    color: #666;
  }
}
.order-info {
  margin-top: 0.2rem;
  background: #fff;
  padding: 0.28rem;
  .brief {
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
      width: 5.2rem;
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
  ul {
    margin-top: 0.2rem;
  }
  li {
    height: 0.7rem;
    line-height: 0.7rem;
    font-size: 0.24rem;
    color: #666;
    &:last-child {
      font-size: 0.28rem;
      font-weight: bold;
      span:last-child {
        color: #f24848;
      }
    }
    span {
      float: left;
      &:last-child {
        float: right;
      }
    }
  }
}
.paytype {
  padding: 0 0 0 0.28rem;
  background: #fff;
  margin-top: 0.2rem;
  border-top: 1px solid #f9f9f9;
  border-bottom: 1px solid #f9f9f9;
  h3 {
    height: 0.8rem;
    line-height: 0.8rem;
    font-size: 0.26rem;
    color: #666;
    font-weight: 400;
  }
  ul {
    li {
      border-top: 1px solid #f0f0f0;
      height: 1rem;
      line-height: 1rem;
      font-size: 0.3rem;
      color: #333;
      position: relative;
      img {
        width: 0.46rem;
        display: inline;
        position: relative;
        top: 0.13rem;
        padding-right: 0.2rem;
      }
      label::after {
        content: " ";
        width: 0.52rem;
        height: 0.52rem;
        border-radius: 50%;
        background: url("../../assets/img/radio.png") no-repeat;
        background-size: 100%;
        position: absolute;
        top: 0.23rem;
        right: 0.28rem;
      }
      input[type="radio"] {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: 100;
        &:checked + label::after {
          content: " ";
          background: url("../../assets/img/dui.png") no-repeat;
          background-size: 100%;
        }
      }
    }
  }
}
.orderNum {
  padding: 0.28rem;
  background: #fff;
  margin-top: 0.2rem;
  h3 {
    font-size: 0.3rem;
    color: #333;
  }
  ul {
    margin-top: 0.2rem;
  }
  li {
    height: 0.6rem;
    line-height: 0.6rem;
    font-size: 0.24rem;
    color: #666;
    position: relative;
    span {
      float: left;
      &:last-child {
        float: right;
      }
    }
    .btn-copy {
      position: absolute;
      right: 2rem;
      top: 0.1rem;
      color: #666;
      font-size: 0.2rem;
    }
  }
}
.fun-btn {
  height: 1.39rem;
  line-height: 1.39rem;
  text-align: right;
  background: #fff;
  width: 100%;
  box-sizing: content-box;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  button {
    width: 2rem;
    height: 100%;
    color: #fff;
    font-size: 0.28rem;
    position: absolute;
    text-align: center;
  }
  .cancel {
    background: #333;
    right: 2.6rem;
  }
  .toPay {
    width: 2.6rem;
    background: #ff3737;
    right: 0;
  }
}
.contactUs {
  background: #fff;
  line-height: 0.88rem;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0.88rem;
  border-top: 1px solid #f0f0f0;
  a {
    position: absolute;
    right: .3rem;
    width: 1.3rem;
    height: .5rem;
    border: 1px solid rgba(69, 69, 69, 1);
    font-size: .22rem;
    line-height: .5rem;
    text-align: center;
    border-radius: 4px;
    top: .2rem;
  }
}
.zhuli {
  padding: 0.3rem;
  background: #fff;
  margin-top: 0.2rem;
  h3 {
    font-size: 0.3rem;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    text-align: center;
    span {
      color: #f24848;
    }
  }
  ul {
    display: flex;
    margin-top: 0.7rem;
    li {
      flex: 1;
      height: 15px;
      position: relative;
      &:last-child {
        flex: 14px 0 0;
        .line {
          width: 0;
        }
      }
      &.hasOkNum {
        .line {
          background: #f24848;
          &.lastOk {
            background: #eee;
          }
        }
        .circle {
          border-color: #f24848;
          background: #fff;
        }
      }
      .line {
        height: 2px;
        width: 100%;
        background: #eee;
        margin-top: 7px;
      }
      .circle {
        border: 2px solid #eee;
        width: 10px;
        height: 10px;
        background: #ffa9a9;
        border-radius: 50%;
        position: absolute;
        left: 0;
        top: 1px;
      }
      .avatars {
        position: absolute;
        width: 0.53rem;
        height: 0.53rem;
        top: -0.55rem;
        left: -0.1rem;
        img {
          max-width: 100%;
        }
      }
    }
  }
  .getZhuLi {
    width: 70%;
    height: 0.8rem;
    text-align: center;
    line-height: 0.8rem;
    border-radius: 4px;
    font-size: 0.28rem;
    color: #fff;
    font-weight: bold;
    background: #f24848;
    margin: 0.5rem auto 0;
    &.gameOver {
      background: #eee;
      color: #333;
    }
  }
}
</style>
