<template>
  <div>
    <div class="money clear">
      <div class="img fl">
        <img src="../../assets/img/piao@2x.png" alt>
      </div>
      <div class="amount fl">¥{{price | returnFloat}}</div>
    </div>
    <div class="bg-img">
      <img src="../../assets/img/bgimg@2x.png" alt>
    </div>
    <div class="paytype">
      <h3>支付方式</h3>
      <ul>
        <li>
          <input type="radio" value="weixin" v-model="values">
          <label for>
            <img src="../../assets/img/weixinpay.png" alt> 微信支付
          </label>
        </li>
        <li v-if="!weixin">
          <input type="radio" value="ali" v-model="values">
          <label for>
            <img src="../../assets/img/alipay.png" alt> 支付宝支付
          </label>
        </li>
        <li>
          <input type="radio" value="xianxia" v-model="values">
          <label for>
            <img src="../../assets/img/xianxia.png" alt> 到店支付
          </label>
        </li>
      </ul>
    </div>
    <div v-if="!xianxiaTxt" class="pay" @click="pay">确认支付 ¥{{price | returnFloat}}</div>
    <div v-else class="pay" @click="pay">确认到店支付</div>
    <!-- <mt-popup v-model="popupVisible" position="center" :closeOnClickModal="false">
      <div class="status-guide">
        <h3>请确认微信支付是否完成</h3>
        <p @click="getPayStatus">已完成支付</p>
        <p @click="againPay">支付遇到问题，重新支付</p>
      </div>
    </mt-popup>-->
  </div>
</template>
<script>
import {
  baseURL,
  payOrder,
  getOrderPrice,
  checkOrderPayStatus,
  wxOpenId,
  wxPayment
} from "../../api";
import { getCookie, setCookie, delCookie, isWeixin } from "../../util";
import { Indicator } from "mint-ui";
import { stringify } from "querystring";
export default {
  name: "payType",
  data() {
    return {
      values: "",
      price: 0,
      sn: "",
      token: "",
      typeId: "",
      popupVisible: false,
      weixin: false,
      openId: "",
      params: {},
      code: "", //后台 拿openid 的code
      payFail:false,//支付失败
      xianxiaTxt:false,
    };
  },
  mounted() {
    this.weixin = isWeixin();
    let isPay = getCookie("isPay");
    let token = getCookie("token");
    let sn = getCookie("orderSn");
    let query = this.$route.query;
    this.code = query.code;
    this.sn = sn;
    this.token = token;
    // if (isPay && isPay === "true") {
    //   this.popupVisible = true;
    // }
    if (this.weixin) {
      this.values = "weixin";
    }
    Indicator.open();
    //alert(this.token);
    getOrderPrice({
      //获取订单商品 的价格
      token: this.token,
      sn: this.sn
    })
      .then(res => {
        console.log(res);
        if (res.result === true) {
          Indicator.close();
          this.price = res.data;
        } else {
          this.$toast(res.msg);
        }
      })
      .catch();
    //alert(JSON.stringify(query)) ;
    //alert(this.code) ;
    if (this.code) {
      //如果 是微信浏览器调起微信支付 微信授权页 redirect_uri返回后会携带code
      wxOpenId({
        code: this.code//发送code 给后台获取openid，返回给 前端调微信支付api（WeixinJSBridge）的参数；
      })
        .then(res => {
          if (res.result === true) {
            this.openId = res.data.openid;
            this.wxPayCan();//拿到参数，直接调起微信支付 弹框
          } else {
            this.$toast(res.msg);
          }
        })
        .catch(err => {
          this.$toast(err);
        });
    }
  },
  methods: {
    pay() {
      if (this.values == "") {
        this.$toast("请选择支付方式");
        return false;
      }
      if (this.values == "ali") {
        this.typeId = 2;
        window.location.href =
          baseURL +
          "order/payOrderForH5?token=" +
          this.token +
          "&sn=" +
          this.sn +
          "&paymentMethodId=" +
          this.typeId;
      } else if (this.values == "weixin") {
        this.typeId = 1;
        if (this.weixin) {
          //微信内部打开 支付
          this.wxPay();
        } else {
          //浏览器打开 微信h5支付
          this.payApi();
        }
      }else if(this.values == "xianxia"){
        this.typeId = 3;
        payOrder({
          token: this.token,
          sn: this.sn,
          paymentMethodId: this.typeId //1-微信支付;
        }).then(res=>{
          console.log(res);
          if(res.result === true){
            this.$router.replace('/awaitshare');
          }else{
            this.$toast(res.msg);
          }
        }).catch(err=>{})
      }
    },
    wxPay() {
      //微信内置浏览器打开 h5微信支付 跳转微信授权页
      //setCookie('comeInNum',2,7);
      //alert("second pay...");
      if(this.payFail){//取消支付或者支付失败 中断第二次微信网页授权，直接调起微信支付；
        this.wxPayCan();
        return;
      }
      let APPID = "wx2154ea226f52f94c";//微信公众号的 唯一标识
      let url = window.location.href;
      //let url = 'http://tuan.eicools.com'
      let REDIRECT_URI = encodeURIComponent(url);
      let SCOPE = "snsapi_base"; //snsapi_base 静默授权 ；若为 snsapi_userinfo 则弹出授权页
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}&state=STATE#wechat_redirect`;
    },
    async wxPayCan() {
      //微信内置浏览器 h5微信支付  获取微信支付接口 参数
      Indicator.open();
      let canRes = await wxPayment({//统一下单接口
        token: this.token,
        sn: this.sn,
        openid: this.openId
      });
      Indicator.close();
      if (canRes.result === true) {
        this.params = canRes.data;
        //alert(JSON.stringify(this.params));
        this.wxJSBridgeError();
      } else {
        this.$toast(canRes.msg);
      }  
    },
    async payApi() {
      //浏览器h5 调起微信支付
      Indicator.open();
      let data = {
        token: this.token,
        sn: this.sn,
        paymentMethodId: this.typeId //1-微信支付;
      };
      let res = await payOrder(data);
      //console.log(res);
      if (res.result === true) {
        window.location.href = res.data.mweb_url; //返回 调起微信支付 url
        Indicator.close();
        //setCookie("isPay", "true", 7);
      } else {
        this.$toast(res.msg);
      }
    },
    onBridgeReady() {
      //微信内置浏览器 h5调起微信支付 jsApi
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: this.params.appId, //公众号名称，由商户传入
          timeStamp: this.params.timeStamp, //时间戳，自1970年以来的秒数
          nonceStr: this.params.nonceStr, //随机串
          package: this.params.package,
          signType: this.params.signType, //微信签名方式：
          paySign: this.params.paySign //微信签名
        },
        res => {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            this.$router.replace("/payOver");
          } else {
            this.payFail = true;
            //alert(this.payFail);
            //location.reload(); //支付失败，强制刷新
          }
        }
      );
      // wx.chooseWXPay({
      //   timestamp: params.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      //   nonceStr: params., // 支付签名随机串，不长于 32 位
      //   package: '', // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
      //   signType: '', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      //   paySign: '', // 支付签名
      //   success: function (res) {
      //   // 支付成功后的回调函数
      //     this.$router.push('/payOver');
      //   }
      // });
    },
    wxJSBridgeError() {
      if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
          document.addEventListener(
            "WeixinJSBridgeReady",
            this.onBridgeReady,
            false
          );
        } else if (document.attachEvent) {
          document.attachEvent("WeixinJSBridgeReady", this.onBridgeReady);
          document.attachEvent("onWeixinJSBridgeReady", this.onBridgeReady);
        }
      } else {
        this.onBridgeReady();
      }
    }
    // async getPayStatus() {//浏览器h5 微信支付完成 引导客户端 点击查询支付状态
    //   let res = await checkOrderPayStatus({
    //     token: this.token,
    //     os: "h5",
    //     sn: this.sn
    //   });
    //   //alert(JSON.stringify(res));
    //   if (res.result === true) {
    //     //delCookie("isPay");
    //     this.$router.replace("/payOver");
    //   } else {
    //     //delCookie("isPay");
    //     this.$toast("您尚未完成支付！");
    //   }
    // },
    // againPay() {//浏览器h5 微信支付遇到问题 重新支付按钮
    //   this.popupVisible = false;
    //   delCookie("isPay");
    //   location.reload();
    // },
  },
  watch:{
    values(val){
      if(val == 'xianxia'){
        this.xianxiaTxt = true;
      }else{
        this.xianxiaTxt = false;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.mint-popup {
  border-radius: 4px;
  width: 80%;
}
.money {
  background: #fff;
  padding: 0.28rem;
  .img {
    width: 0.86rem;
    height: 0.86rem;
    img {
      max-width: 100%;
    }
  }
  .amount {
    margin: 0.3rem 0 0 0.3rem;
    font-size: 0.32rem;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
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
.pay {
  height: 0.9rem;
  line-height: 0.9rem;
  width: 90%;
  margin: 0.6rem auto;
  text-align: center;
  font-size: 0.3rem;
  font-weight: 400;
  background: #333;
  color: #fff;
  border-radius: 4px;
}
.status-guide {
  border-radius: 4px;
  text-align: center;
  h3 {
    font-size: 0.26rem;
    font-weight: 400;
    line-height: 1rem;
    border-bottom: 1px solid #f0f0f0;
    padding: 0 0.4rem;
    color: #333;
  }
  p {
    padding: 0 0.4rem;
    font-size: 0.26rem;
    line-height: 0.8rem;
    border-bottom: 1px solid #f0f0f0;
    color: #f24848;
    cursor: pointer;
    &:last-child {
      border: none;
      color: #999;
    }
  }
}
</style>


