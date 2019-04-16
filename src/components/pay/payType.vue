<template>
  <div>
    <div class="money clear">
      <div class="img fl"><img src="../../assets/img/piao@2x.png" alt=""></div>
      <div class="amount fl">¥{{price | returnFloat}}</div>
    </div>
    <div class="bg-img"><img src="../../assets/img/bgimg@2x.png" alt=""></div>
    <div class="paytype">
      <h3>支付方式</h3>
      <ul>
        <li><input type="radio" value="weixin" v-model="values"><label for=""><img src="../../assets/img/weixinpay.png" alt=""> 微信支付</label></li>
        <li><input type="radio" value="ali" v-model="values"><label for=""><img src="../../assets/img/alipay.png" alt=""> 支付宝支付</label></li>
      </ul>
    </div>
    <div class="pay" @click="pay">确认支付 ¥{{price | returnFloat}}</div>
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
import { baseURL,payOrder,getOrderPrice,checkOrderPayStatus } from '../../api'
import { getCookie,setCookie,delCookie } from "../../util";
import { Indicator } from "mint-ui";
export default {
  name:'payType',
  data(){
    return {
      values:'',
      price:0,
      sn:'',
      token:'',
      typeId:'',
      popupVisible:false
    }
  },
  mounted(){
    // let params = this.$route.params;
    // this.price = params.price;
    // this.sn = params.sn;
    
    let isPay = getCookie('isPay');
    let token = getCookie('token');
    let sn = getCookie('orderSn');
    this.sn = sn;
    this.token = token;
    if(isPay && isPay === 'true'){
      this.popupVisible = true;
    }
    Indicator.open();
    //alert(this.token);
    getOrderPrice({
      token:this.token,
      sn:this.sn
    }).then(res=>{
      console.log(res);
      if(res.result === true){
        Indicator.close();
        this.price = res.data;
      }else{
        this.$toast(res.msg);
      }
    }).catch();
  },
  methods:{
    pay(){
      if(this.values == '') {this.$toast('请选择支付方式'); return false;}
      if(this.values == 'ali'){
        
        this.typeId = 2;
        window.location.href = baseURL + 'order/payOrderForH5?token='+this.token+'&sn='+this.sn+'&paymentMethodId='+this.typeId;
      }else if(this.values == 'weixin'){
        this.typeId = 1;
        this.payApi();
      }
     
      //this.$router.push('/orderInfos');
    },
    async payApi(){
      Indicator.open();
      let data = {
        token:this.token,
        sn:this.sn,
        paymentMethodId:this.typeId//1-微信支付;2-支付宝支付
      };
      let res = await payOrder(data);
      console.log(res);
      if(res.result === true){
        window.location.href = res.data.mweb_url;
        Indicator.close();
        setCookie('isPay','true',7);
      }else{
        this.$toast(res.msg);
      }   
    },
    async getPayStatus(){
      let res =await checkOrderPayStatus({
        token:this.token,
        os:'h5',
        sn:this.sn
      });
      //alert(JSON.stringify(res));
      if(res.result === true){
        delCookie('isPay');
        this.$router.push('/payOver');
      }else{
        delCookie('isPay'); 
        this.$toast('您尚未完成支付！');
      }
    },
    againPay(){
      this.popupVisible = false;
      delCookie('isPay'); 
      location.reload();
    },
  },
  
}
</script>
<style lang="less" scoped>
.mint-popup{
  border-radius: 4px;
  width: 80%;
}
.money{
  background: #fff;
  padding: .28rem;
  .img{
    width: .86rem;
    height: .86rem;
    img{
      max-width: 100%;
    }
  }
  .amount{
    margin:.3rem 0 0 .3rem;
    font-size:.32rem;
    font-weight:400;
    color:rgba(51,51,51,1);
  }
}
.paytype{
  padding: 0 0 0 .28rem;
  background: #fff;
  margin-top: .2rem;
  border-top: 1px solid #f9f9f9;
  border-bottom: 1px solid #f9f9f9;
  h3{
    height: .8rem;
    line-height: .8rem;
    font-size: .26rem;
    color: #666;
    font-weight: 400;
  }
  ul{
    li{
      border-top: 1px solid #f0f0f0;
      height: 1rem;
      line-height: 1rem;
      font-size: .3rem;
      color: #333;
      position: relative;
      img{
        width: .46rem;
        display: inline;
        position: relative;
        top: .13rem;
        padding-right: .2rem;
      }
      label::after{
        content: ' ';
        width: .52rem;
        height: .52rem;
        border-radius: 50%;
        background: url('../../assets/img/radio.png') no-repeat;
        background-size: 100%;
        position:absolute;
        top: .23rem;
        right: .28rem;
      }
      input[type='radio']{
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: 100;  
        &:checked+label::after{
          content: ' ';
          background: url('../../assets/img/dui.png') no-repeat;
          background-size: 100%;
        }
      }
    }
  }
}
.pay{
  height: .9rem;
  line-height: .9rem;
  width: 90%;
  margin: .6rem auto;
  text-align: center;
  font-size:.3rem;
  font-weight:400;
  background: #333;
  color:#fff;
  border-radius: 4px;
}
.status-guide{
  border-radius: 4px;
  text-align: center;
  h3{
    font-size: .26rem;
    font-weight: 400;
    line-height: 1rem;
    border-bottom: 1px solid #f0f0f0;
    padding: 0 .4rem;
    color: #333;
  }
  p{
    padding: 0 .4rem;
    font-size: .26rem;
    line-height: .8rem;
    border-bottom: 1px solid #f0f0f0;
    color: #f24848;
    cursor: pointer;
    &:last-child{
      border: none;
      color: #999;
    }
  }
}
</style>


