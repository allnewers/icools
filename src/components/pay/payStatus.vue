<template>
  <div>
    <mt-popup v-model="popupVisible" position="center" :closeOnClickModal="false">
      <div class="status-guide">
        <h3>请确认微信支付是否完成</h3>
        <p @click="getPayStatus">已完成支付</p>
        <p @click="againPay">支付遇到问题，重新支付</p>
      </div>
    </mt-popup>
  </div>
</template>
<script>
import {checkOrderPayStatus} from "../../api";
import { getCookie,delCookie } from '../../util'
export default {
  name:"payStatus",
  data(){
    return {
      popupVisible:true,
      token:'',
      sn:''
    }
  },
  mounted(){
    let token = getCookie("token");
    let sn = getCookie("orderSn");
    this.token = token;
    this.sn = sn;
  },
  methods:{
    async getPayStatus() {//浏览器h5 微信支付完成 引导客户端 点击查询支付状态
      let res = await checkOrderPayStatus({
        token: this.token,
        os: "h5",
        sn: this.sn
      });
      //alert(JSON.stringify(res));
      if (res.result === true) {
        //delCookie("isPay");
        this.$router.replace("/payOver");
      } else {
        //delCookie("isPay");
        this.$toast("您尚未完成支付！");
      }
    },
    againPay() {//浏览器h5 微信支付遇到问题 重新支付按钮
      //this.popupVisible = false;
      //delCookie("isPay");
      this.$router.replace('/payType');
    },
  }
}
</script>
<style lang="less" scoped>

.mint-popup {
  border-radius: 4px;
  width: 80%;
  z-index: 999!important;
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
<style>
.v-modal{
  z-index: 998!important;
}
</style>

