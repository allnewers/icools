<template>
  <div>
    <div class="from">
      <ul>
        <li>
          <label for>用户名</label>
          <input type="text" v-model="username"  maxlength="30" :disabled="isUpdate === 'true'">
        </li>
        <li>
          <label for>昵<span></span>称</label>
          <input type="text" v-model="nickname"  maxlength="30">
        </li>
        <li @click="popupVisible = true">
          <label for>性<span></span>别</label>
          <input type="text" :value="gender"  unselectable="on" onfocus="this.blur()" readonly>
        </li>
        
      </ul>
      
    </div>
    <div class="submit" @click="submit">保存</div>
    <mt-popup v-model="popupVisible" position="bottom">
        <mt-picker :slots="genderslots" ref="picker1" :show-toolbar="true">
          <p class="mint-picker-top">请选择性别</p>
        </mt-picker>
        <button class="confirm userEdit" @click="setgenderVal">确定</button>
    </mt-popup>
  </div>
</template>
<script>
import { getCookie,setCookie } from "../../util";
import { updateUserInfo } from '../../api'
import { Indicator } from "mint-ui";
import { setTimeout } from 'timers';
export default {
  name:"updateUserInfo",
  data(){
    return {
      popupVisible:false,
      genderslots:[
        {
          flex: 1,
          values: ["男","女","保密"],
          textAlign: 'center'
        }, 
      ],
      token:'',
      username:'',
      nickname:'',
      gender:'',
      isUpdate:''
    }
  },
  mounted(){
    this.fillData();
  },
  methods:{
    fillData(){
      let obj = {0:'男',1:'女',2:'保密'};
      let token = getCookie("token");
      let username = getCookie("username");
      let nickname = getCookie("nickname");
      let isUpdate = getCookie("isUpdate");//用户名 是否改过，只能改一次
      let gender = getCookie("gender");
      this.token = token;
      this.gender = gender;
      this.isUpdate = isUpdate;
      this.username = username;
      this.nickname = nickname;
      this.gender = obj[gender];
    },
    setgenderVal(){
      this.gender = this.$refs.picker1.getValues();
      this.popupVisible = false;
    },
    submit(){
      let arr = {'男':0,'女':1,'保密':2};
      let genderVal = arr[this.gender];
      let params = {
        token:this.token,
        username:this.username,
        nickname:this.nickname,
        gender:genderVal
      }
      ///console.log(this.isUpdate );
      if(this.isUpdate === 'true'){
        delete params.username;
      } 
      Indicator.open();
      updateUserInfo(params).then(res=>{
        Indicator.close();
        //console.log(res);
        if(res.result){
          setCookie('username',this.username,7);
          setCookie('nickname',this.nickname,7);
          setCookie('gender',genderVal,7);
          setCookie('isUpdate','true',7);
          this.$toast({
            message:'修改成功',
            duration:1000
          });
          setTimeout(()=>{
            this.$router.go(-1);
          },1000);
        }else{
          this.$toast(res.msg);
        }
      }).catch(err=>{

      });
    }
  }
}
</script>
<style lang="less" scoped>
.userEdit{
  margin: .5rem auto 0;
}
input:disabled{
  -webkit-text-fill-color: #999;
  opacity: 1;
}
.mint-popup{
  width: 100%;
  height: 50vh;
}
.mint-picker-top{
  text-align: center;
  line-height: 1rem;
  border-bottom: 1px solid #f0f0f0;
}
.from {
  background: #fff;
  margin-top: .2rem;
 
  li {
    height: 1rem;
    line-height: 1rem;
    border-bottom: 1px solid #f0f0f0;
    font-size: 0.28rem;
    color: #333;
    text-indent: .3rem;
    &:last-child {
      border: none;
    }
    span{
      padding: 0 .15rem;
    }
    input {
      padding-left: 0.6rem;
      width: 60%;
      color: #333;
      &::placeholder {
        color: #d1d1d1;
      }
      &.code {
        width: 2rem;
      }
      font-size: 0.28rem;
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
