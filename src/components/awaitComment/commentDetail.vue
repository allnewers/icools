<template>
  <div v-if="comeData">
    <div class="status await">
      <p>
        <em></em>
      </p>
      <span>{{allData.typeName}}</span>
    </div>
    <div class="wuliu">
      <h3>物流信息</h3>
      <div class="infoList">
        <ul>
          <li v-for="(item ,index) in shipInfos" :key="index">
            <div class="circle">
              <i></i>
            </div>
            <div class="line"></div>
            <div class="txts">
              <h4>{{item.content}}</h4>
              <p>{{item.createDate}}</p>
            </div>
          </li>
          <li v-if="isAction">
            <div class="circle">
              <i></i>
            </div>
            <div class="line"></div>
            <div class="txts">
              <h4>拼单已成功，商品等待发货。</h4>
              <!-- <p>{{item.createDate}}</p> -->
            </div>
          </li>
        </ul>
      </div>
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
    <div class="fun-btn">
      <!-- <button v-if="isAction" class="cancel" @click="cancelOrder">提醒发货</button> -->
      <button class="toPay"  @click="toComment">{{shipTxts}}</button>
    </div>
  </div>
</template>
<script>
import { MessageBox } from "mint-ui";
import { orderDetail,getShipInfo,goodsOrderConfirm } from "../../api";
import { getCookie, imgBaseUrl, toTop, setCookie, isWeixin } from "../../util";
import { Indicator } from "mint-ui";
export default {
  name: "commentDetail",
  data() {
    return {
      values: "",
      sn: "",
      token: "",
      allData: "",
      info: "",
      imgBaseUrl: imgBaseUrl,
      comeData: false,
      copyUrl: "",
      shipInfos:'',
      shipTxts:'立即评价',
      isAction:true
    };
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
      let shipRes = await getShipInfo({
        sn:this.sn
      });
      console.log(res);
      if (res.result === true) {
        this.allData = res.data.order;
        this.info = res.data.order.items[0];
        this.comeData = true;
      } else {
        console.log(res.msg);
      }
      console.log(shipRes);
      if(shipRes.result === true){
        this.shipInfos = shipRes.data;
        if(this.shipInfos.length > 0){
          this.isAction = false;
        }
      }else {
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
      this.$toast("已提醒发货！");
    },

    toComment() {
      
    },

  }
};
</script>
<style lang="less" scoped>
.status {
  height: 1.5rem;
  line-height: 1.5rem;
  position: relative;
  text-align: center;
  p {
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
    em {
      border-left: 1px solid #fff;
      border-bottom: 1px solid #fff;
      position: absolute;
      width: 0.08rem;
      height: 0.1rem;
      top: 0.05rem;
      left: 0.14rem;
    }
  }
  span {
    padding-left: 0.3rem;
  }
  &.await {
    background: #f9faf9;
    color: #666;
    p {
      background: #00be12;
    }
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
.wuliu{
  padding: .3rem;
  background: #fff;

  h3{
    font-size: .3rem;
    color: #333;
  }
  .infoList{
    padding: .3rem 0;
    li{
      position: relative;
      &:first-child{
        .circle{
          background: #333;
        }
        .txts{
          h4{
            color: #333;
          }
        }
      }
      &:last-child{
        .txts{padding-bottom: 0;}
        .line{
          display: none;
        }
      }
      .circle{
        width: 15px;
        height: 15px;
        left: 0;
        top: .1rem;
        position: absolute;
        border-radius: 50%;
        background: #BDBDBD;
        z-index: 2;
        i:after{
          content: '';
          display: inline-block;
          width: .08rem;
          height: .08rem;
          border-top: 1px solid #fff;
          border-right: 1px solid #fff;
          transform: rotate(-45deg);
          position: relative;
          top: -.1rem;
          left: 5px;

        }
      }
      .line{
        height: 1.6rem;
        width: 1px;
        position: absolute;
        background: #BDBDBD;
        top: .1rem;
        left: .14rem;
        z-index: 1;
      }
      .txts{
        padding:0 0 .8rem .45rem ;
        h4{
          font-size:.28rem;
          font-weight:500;
          color:rgba(189,189,189,1);
        }
        p{
          font-size:.2rem;
          font-weight:300;
          color:rgba(102,102,102,1);
        }
      }
    }
  }
}
</style>
