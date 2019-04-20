<template>
  <div>
    <div class="titleType clear">
      <span class="fl">抬头类型</span>
      <ul class="fl">
        <li>
          <input type="radio" value="danwei" v-model="types">
          <label for>单位</label>
        </li>
        <li>
          <input type="radio" value="geren" v-model="types">
          <label for>个人</label>
        </li>
      </ul>
    </div>
    <div class="form">
      <ul>
        <li v-for="(item,index) in switchData" :key="index">
          <label for>{{item.name}}</label>
          <input type="text" :maxlength="index==1?'18':''" :placeholder="item.value" v-model="dataArr[index]">
        </li>
      </ul>
    </div>
    <div class="submit" @click="submit">保存</div>
  </div>
</template>
<script>
import { getCookie ,validIdNum, checkEmail,validCreditCode } from "../../util";
import { addInvoiceTitle } from "../../api";
import { Indicator } from "mint-ui";
import { setTimeout } from 'timers';
export default {
  name: "invoiceTitle",
  data() {
    return {
      types: "danwei",
      switchData: [],
      dataArr:[],
      token:'',
      type:''
    };
  },
  mounted() {
    this.tabs();
    let token = getCookie("token");
    this.token = token;
  },
  methods: {
    submit(){
      if(!this.dataArr[0] || !this.dataArr[1] || !this.dataArr[2]  ){
        this.$toast('请填写必填项');
        return;
      } 
      if(this.types == 'geren' && !validIdNum(this.dataArr[1]) ){
        this.$toast('身份证填写不正确');
        return;
      }
      if(this.types == 'danwei' && !validCreditCode(this.dataArr[1]) ){
        this.$toast('税号填写不正确');
        return;
      }
      if(!checkEmail(this.dataArr[2])){
        this.$toast('邮箱格式不正确');
        return;
      } 
      Indicator.open();
      addInvoiceTitle({
        token:this.token,
        type:this.type,
        title:this.dataArr[0],
        identifyNumber:this.dataArr[1],
        email:this.dataArr[2]
      }).then(res=>{
        console.log(res);
        Indicator.close();
        if(res.result === true){ 
          this.$toast({message:'添加成功',duration:1000});
          setTimeout(()=>{
            this.$router.push({name:'invoiceList',params:{origin:'order'}});
          },1000);
        }else{
           this.$toast(res.msg);
        }
        
      }).catch();
    },
    tabs() {
      if (this.types == "geren") {
        this.type = 1;
        this.switchData = [
          { name: "姓名", value: "请输入姓名(必填)" },
          { name: "身份证号", value: "请输入身份证号(必填)" },
          { name: "邮箱", value: "请输入正确邮箱(必填)" }
        ];
      } else if (this.types == "danwei") {
        this.type = 2;
        this.switchData = [
          { name: "名称", value: "请输入准确的抬头名称(必填)" },
          { name: "税号", value: "请输入税号或者社会信用代码(必填)" },
          { name: "邮箱", value: "请输入正确邮箱(必填)" }
        ];
      }
    },
    
  },
  watch: {
    types: {
      handler(val) {
        if (val == "geren") {
          this.type = 1;
          this.switchData = [
            { name: "姓名", value: "请输入姓名(必填)" },
            { name: "身份证号", value: "请输入身份证号(必填)" },
            { name: "邮箱", value: "请输入正确邮箱(必填)" }
          ];
        } else {
          this.type = 2;
          this.switchData = [
            { name: "名称", value: "请输入准确的抬头名称(必填)" },
            { name: "税号", value: "请输入税号或者社会信用代码(必填)" },
            { name: "邮箱", value: "请输入正确邮箱(必填)" }
          ];
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
.titleType {
  line-height: 0.9rem;
  padding: 0 0.28rem;
  background: #fff;
  color: #333;
  span {
    font-size: 0.28rem;
  }
  ul {
    li {
      border-top: 1px solid #f0f0f0;
      font-size: 0.28rem;
      color: #333;
      position: relative;
      float: left;
      padding-left: 0.4rem;
      margin-left: 0.8rem;
      label::after {
        content: " ";
        width: 0.3rem;
        height: 0.3rem;
        border-radius: 50%;
        background: url("../../assets/img/radio.png") no-repeat;
        background-size: 100%;
        position: absolute;
        top: 0.3rem;
        left: 0;
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
.form{
  margin-top: .2rem;
  ul{
    background: #fff;
    li{
      line-height: .9rem;
      padding: 0 .28rem;
      height: .9rem;
      font-size: .28rem;
      border-bottom: 1px solid #f0f0f0;
      label{
        color: #333;
        float: left;
        width: 20%;
      }
      input{
        width: 80%;
        font-size: .28rem;
      }
    }
  }
}
.submit {
      width: 90%;
      height: 0.8rem;
      line-height: 0.8rem;
      color: #fff;
      font-size: 0.3rem;
      text-align: center;
      background: #333;
      border-radius: 4px;
      margin: 0.88rem auto;
      &.bgactive {
        background: #333;
      }
    }
</style>
