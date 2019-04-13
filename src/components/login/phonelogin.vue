<template>
  <div class="bg">
    <div class="login">
      <ul>
        <li class="clear">
          <label for>手机号</label>
          <input maxlength="11" @keyup="changeBg" v-model="formData.mobile" placeholder="请输入手机号" type="text" name id>
          <i></i>
        </li>
        <li>
          <label for>验证码</label>
          <input
            class="code"
            maxlength="4"
            v-model="loginData.code"
            placeholder="请输入验证码"
            type="text"
            @keyup="changeBg"
          >
          <button @click="sendCode" :disabled="isForbid">{{btnTxt}}</button>
        </li>
      </ul>
      <div class="submit" :class="{bgactive:islogin}" @click="submit">登录</div>
    </div>
  </div>
</template>
<script>
import md5 from "js-md5";
import { sendLoginCode, signIn } from "../../api";
import Qs from "qs";
import { setInterval, clearInterval, setTimeout } from "timers";
import { setCookie,CookieEnable,getCookie } from "../../util";
import { mapActions } from 'vuex'
export default {
  name: "phonelogin",
  data() {
    return {
      formData: {
        mobile: "",
        type: "2", //1.爱酷士会员注册 2.登录 3.爱酷士会员修改密码 4.工程师修改密码
        sign: ""
      },
      loginData: {
        mobile: "",
        code: ""
      },
      btnTxt: "获取验证码",
      isForbid: false,
      islogin:false,
      urlCode:'',//登录成功，回调地址
    };
  },
  mounted() {
    //this.changeBg();
    let code = this.$route.params.urlCode;
    this.urlCode = code;
  },
  computed: {
    signs() {
      return md5(
        this.formData.type +
          "-" +
          this.formData.mobile +
          "-" +
          this.formData.type
      );
    },

  },
  methods: {
    ...mapActions(['getUserImg']),
    changeBg(){
      if(this.formData.mobile != '' && this.loginData.code !=''){
        this.islogin = true;
      }else{
        this.islogin = false;
      }
    },
    sendCode() {
      if (!this.formData.mobile || !this.validPhoneNum(this.formData.mobile)) {
        this.$toast("请输入正确的手机号");
        return false;
      }
      this.formData.sign = this.signs;
      sendLoginCode(this.formData)
        .then(res => {
          let result = res.result;
          //console.log(res);
          if (result === true) {
            this.$toast("验证码发送成功");
            this.isForbid = true; //禁用btn按钮
            this.countDown(60, "秒后重新获取", "获取验证码");
          }else{
            this.$toast(res.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    submit() {
      if (!this.formData.mobile || !this.validPhoneNum(this.formData.mobile)) {
        this.$toast("请输入正确的手机号");
        return false;
      }
      if(!this.loginData.code){
        this.$toast("请输入验证码");
        return false;
      }
      this.loginData.mobile = this.formData.mobile;
      signIn(this.loginData)
        .then(res => {
          console.log(res);
          let result = res.result;
          let token;
          //设置cookie
          // document.cookie = `token=${escape(res.data.token)};`
          if(!CookieEnable()){
            this.$toast('对不起，您的浏览器cookie功能被禁用，请开启并重启浏览器');
            return;
          }  
          setCookie('token',res.data.token,7);
          setCookie('username',res.data.username,7);
          setCookie('nickname',res.data.name,7);
          setCookie('isUpdate',res.data.isUpdate,7);
          setCookie('gender',res.data.gender,7);
         // setCookie('userAvatar',res.data.imgUrl,7);
          this.alerts(res.msg,()=>{
            setTimeout(()=>{
              if(result===true){ 
                this.$store.commit('changeNotice',true); //更新首页 消息状态 
                this.$router.push('/'+this.urlCode);  
              }
            },2000)
            
          });   
        })
        .catch(err => {
          this.$toast(err);
        });
    },
    countDown(second, txt, orignTxt) {
      //倒计时
      let timer = setInterval(() => {
        this.btnTxt = second + txt;
        second--;
        if (second <= 0) {
          clearInterval(timer);
          this.isForbid = false;
          this.btnTxt = orignTxt;
        }
      }, 1000);
    },
    validPhoneNum(num) {
      //检验手机号
      let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      let telNo = num.replace(/\s/g, ""); //去掉空格
      let val = reg.test(telNo);
      if (val) {
        return true;
      } else {
        return false;
      }
    },
    alerts(str,cb){
      this.$toast({message:str,duration:2000});
      cb && cb();
    }
  }
};
</script>
<style lang="less" scoped>
.bg {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #fff;
}
.login {
  margin-top: 0.6rem;
  padding: 0 0.5rem;
  li {
    height: 1rem;
    line-height: 1rem;
    border-bottom: 1px solid #f0f0f0;
    font-size: 0.28rem;
    color: #333;
    
    input {
      padding-left: 0.6rem;
      &::placeholder {
        color: #d1d1d1;
      }
      &.code {
        width: 2rem;
      }
      font-size: .28rem;
    }
    button {
      font-size: 0.22rem;
      float: right;
      margin-top: 0.3rem;
    }
  }
  .submit {
    width: 100%;
    height: 0.8rem;
    line-height: 0.8rem;
    color: #fff;
    font-size: 0.3rem;
    text-align: center;
    background: #d8d8d8;
    border-radius: 4px;
    margin: 0.88rem auto;
    &.bgactive{
      background: #333;
    }
  }
}
</style>
