<template>
  <div class="wrap">
    <div class="title">
      <span>普票-{{invoiceInfo.typeName}}</span><span @click="edit(isEdit)" :class="{active:!isEdit}">{{isEdit?'编辑':'完成'}}</span>
    </div>
    <div class="detail">
      <div class="black"></div>
      <div class="jiao j-left"><img src="../../assets/img/dot.png" alt=""></div>
      <div class="jiao j-right"><img src="../../assets/img/dot.png" alt=""></div>
      <div class="piao">
        <div class="fa"><img src="../../assets/img/piao.png" alt=""></div>
        <div class="top"><img src="../../assets/img/logo.png" alt=""></div>
        <div class="txts">
          <ul>
            <li v-for="(item, index) in datas" :key="index"><label for="">{{item.name}}</label><input type="text" ref="inputVal" maxlength="18" :value="item.value" :disabled="isEdit"></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { updateInvoice,getInvoiceDetailById } from '../../api'
import { getCookie ,validIdNum, checkEmail ,validCreditCode  } from "../../util";
import { Indicator } from "mint-ui";
export default {
  name:"invoiceDetail",
  data(){
    return {
      isEdit:true,
      invoiceInfo:{},
      token:''
    }
  },
  mounted(){
    //let info = this.$route.params.info;
    let token = getCookie('token');
    let id = this.$route.params.id;
    this.token = token;
    //this.invoiceInfo = JSON.parse(info) ;
    //:onfocus="isEdit?'this.blur()':null"
    Indicator.open();
    getInvoiceDetailById({
      id:id,
      token:this.token
    }).then(res=>{
      Indicator.close();
      //console.log(res);
      if(res.result === true){
        this.invoiceInfo = res.data;
      }else{
        this.$toast(res.msg);
      }
    }).catch(err=>{

    });
    
  },
  computed:{
    datas(){
      let title ,num ,data;
      if(this.invoiceInfo.type == 1){
        title = '姓名';
        num = '身份证号';
      }else{
        title = '公司';
        num = '税号';
      }
     data = [
        {
          name:title,
          value:this.invoiceInfo.title
        },
        {
          name:num,
          value:this.invoiceInfo.identifyNumber
        },
        {
          name:'邮箱',
          value:this.invoiceInfo.email
        }
      ];
      
      return data;
    }
  },
  methods:{
    edit(now){
      if(now){
        this.isEdit = false;
      }else{     
        this.submit();
      }
    },
    submit(){
      let title = this.$refs.inputVal[0].value;
      let num = this.$refs.inputVal[1].value;
      let email = this.$refs.inputVal[2].value;
      if(title == this.invoiceInfo.title && num == this.invoiceInfo.identifyNumber && email == this.invoiceInfo.email){
        this.isEdit = true;
        return;
      }
      if(this.invoiceInfo.type == 1){
        if(!validIdNum(num)){
          this.$toast('身份证号不正确');
          return;
        }
      }else{
        if(!validCreditCode(num)){
          this.$toast('税号不正确');
          return;
        }
      }
      if(!checkEmail(email)){
        this.$toast('邮箱格式不正确');
        return;
      }
     
      //console.log(title,num,email)
      Indicator.open();
      updateInvoice({
        token:this.token,
        type:this.invoiceInfo.type,
        title:title,
        identifyNumber:num,
        email:email,
        id:this.invoiceInfo.id
      }).then(res=>{
        Indicator.close();
        if(res.result === true){
          this.invoiceInfo = res.data;
          this.$toast('修改成功')
        }else{
          this.$toast(res.msg);
          return;
      }
      }).catch(err=>{

      });
      this.isEdit = true;
    }
  },
  
}
</script>
<style lang="less" scoped>
.wrap{
  background: #fff;
  height: 100vh;
  overflow: hidden;
  width: 100%;
}
.title{
  padding:.2rem .6rem;
  height: .6rem;
  line-height: .6rem;
  font-size: .26rem;
  span{
    float: left;
    color: #666;
    &:last-child{
      float: right;
      color: #333;
      padding-left: .35rem;
      background: url('../../assets/img/pen@2x.png') no-repeat 0 center;
      background-size: .28rem .26rem;
      &.active{
        background: none;
        color: #3481f4;
      }
    }
  }
}
.detail{
  padding:0 .28rem;
  position: relative;
  box-sizing: content-box;
  .black{
    height: .5rem;
    width: 100%;
    background: #333;
    border-radius: .25rem;
  }
  .piao{
    width: 88%;
    border: 1px solid #f0f0f0;
    margin: 0 auto;
    position: relative;
    top: -.25rem;
    background: #fff;
    padding: .2rem;
    &::before{
      content: '';
      width: 100%;
      height: 10px;
      position: absolute;
      bottom:-5px;
      left: 0;
      background: url('../../assets/img/ju.png') no-repeat;
      background-size: cover;
    }
    
  }
  .fa{
    width: 1.8rem;
    position: absolute;
    right: .4rem;
    top: .3rem;
    img{
      max-width: 100%;
    }
  }
  .jiao{
      width: .16rem;
      height: .24rem;
      position: absolute;
      z-index: 100;
      top: 1.25rem;
      img{
        width: .16rem;
        background: #fff;
      }
      &.j-left{
        left: .45rem;   
      }
      &.j-right{
        right: .45rem;
        transform: rotate(180deg);
      }
    }
  .top{
      height: .9rem;
      border-bottom: 1px dotted #f0f0f0;
      img{
        width: 1.89rem;
        padding: .2rem 0 0 .2rem;
      }
  }
  .txts{
    ul{
      padding: .3rem 0;
      li{
        height: .9rem;
        line-height: .9rem;
        padding: 0 .2rem;
        font-size: .3rem;
        label{
          display: inline-block;
          width: 25%;
          color: #999;
        }
        input{
          font-size: .3rem;
          color: #333;
          //-webkit-user-select :none;
        }
      }
    }
    
  }
}
input:disabled{
  -webkit-text-fill-color: #999;
  opacity: 1;
}
</style>
