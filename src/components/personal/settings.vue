<template>
  <div>
    <ul>
      <li @click="jumpUrl('deal')">
        <div class="top">
          服务协议
          <span class="more"></span>
        </div>
      </li>
      <li @click="jumpUrl('help')">
        <div class="top" >
          使用帮助
          <span class="more"></span>
        </div>
      </li>
      <li @click="jumpUrl('feedback')">
        <div class="top">
          意见反馈
          <span class="more"></span>
        </div>
      </li>
      <li style="margin-top:.2rem;" @click="jumpUrl('aboutUs')">
        <div class="top">
          关于我们
          <span class="more"></span>
        </div>
      </li>
    </ul>
    <div class="loginout" @click="loginOut">退出登录</div>
  </div>
</template>
<script>
import { getCookie,delCookie } from "../../util";
import { loginout } from "../../api";
import { setTimeout } from 'timers';
export default {
  name: "settings",
  data() {
    return {
      token:''
    };
  },
  mounted(){
    let token = getCookie("token");
    this.token = token;
  },
  methods: {
    loginOut() {
      loginout({token:this.token}).then(res=>{
        if(res.result === true){
          delCookie('token');
          delCookie('username');
          this.$toast({message:'登出成功',duration:1000});
          this.$store.commit('changeNotice',false);
          setTimeout(()=>{
            this.$router.push('/');
          },1000)
        }
        
      }).catch();
    },
    jumpUrl(url){
      this.$router.push('/'+url);
    }
  }
};
</script>
<style lang="less" scoped>
.loginout{
  width: 90%;
    height: 0.8rem;
    line-height: 0.8rem;
    color: #fff;
    font-size: 0.3rem;
    text-align: center;
    background: #333;
    border-radius: 4px;
    margin: 0.88rem auto;
}   
ul{
  margin-top: .2rem;
}
li{
  height: .9rem;
  line-height: .9rem;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}
.top {
  height: 0.9rem;
  line-height: 0.9rem;
  font-size: 0.28rem;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  border-bottom: 1px solid #f0f0f0;
  padding: 0 0.28rem;
  span {
    float: right;
    position: relative;
    padding-right: 0.3rem;
    color: #666;
    &::after {
      content: "";
      height: 0.16rem;
      width: 0.16rem;
      display: block;
      transform: rotate(45deg);
      border-top: 1px solid #666;
      border-right: 1px solid #666;
      position: absolute;
      right: 0;
      top: 0.36rem;
    }
  }
}
</style>
