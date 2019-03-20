<template>
  <div>
    <div class="invoiceList" v-if="list.length>0">
      <ul>
        <li v-for="(item,index) in list" :key="item.id" @click="selectInvoice(index)">
          <h3>{{item.title}}</h3>
          <p><i v-if="item.type === 1">身份证号</i><i v-if="item.type === 2">税号</i> <span></span>{{item.identifyNumber}}</p>
        </li>
        <div class="add" @click="goAdd">+添加</div>
      </ul>
    </div>
    <div class="noData" v-show="showNoData">
      <img src="../../assets/img/noData.png" alt="">
      <span>您还没有发票抬头</span>
      <div class="add" @click="goAdd">+添加</div>
    </div>
    
  </div>
</template>
<script>
import { getCookie } from "../../util";
import { InvoiceTitleList } from "../../api";
import { Indicator } from "mint-ui";
export default {
  name:"invoiceList",
  data(){
    return {
      list:[],
      showNoData:false
    }
  },
  mounted(){
    let token = getCookie("token");
    this.token = token;
    Indicator.open();
    InvoiceTitleList({
      token:this.token
    }).then(res=>{
      console.log(res);
      Indicator.close();
      if(res.result === true){
        this.list = res.data;
        if(res.data.length == 0){
          this.showNoData = true;
        }
      }else{
        console.log(res.msg);
      }
    }).catch();
  },
  methods:{
    selectInvoice(index){
      this.$store.commit('changeInvoiceTitle',index);
      this.$router.go(-1);
    },
    goAdd(){
      this.$router.push('/invoiceTitle');
    }
  }
}
</script>
<style lang="less" scoped>
  .invoiceList{
    padding: .28rem;
    ul{
      li{
        height: 1.8rem;
        background: url('../../assets/img/invoice-bg.png') no-repeat;
        background-size: cover;
        line-height: .9rem;
        text-indent: .3rem;
        color: #333;
        margin-bottom: .2rem;
        h3{
          font-size: .3rem;
          font-weight: 400;
        }
        p{
          font-size: .26rem;
          color: #999;
          span{
            padding: 0 .2rem;
          }
        }
      }
    }
  }
  .add{
    height: .9rem;
    line-height: .9rem;
    color: #fff;
    font-size: .3rem;
    text-align: center;
    background: #333;
    width: 80%;  
    margin: .3rem auto;
  }
</style>
