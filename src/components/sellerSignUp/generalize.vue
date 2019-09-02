<template>
  <div>
    <img src="../../assets/img/generalize.png" alt="">
  </div>
</template>
<script>
import { sendWxCode } from "../../api";
import { weixinAuth,isWeixin } from '../../util'
export default {
  name:"generalize",
  data(){
    return {
    }
  },
  mounted() {
    //this.changeBg();
    let isweixin = isWeixin();
    let weixinCode = this.$route.query.code;
    if(isweixin && weixinCode === undefined){//微信浏览器 并且拼团id存在,微信未授权获取code之前（分享出去，朋友点进来助力）
      //console.log('coming...');
      weixinAuth();//微信授权，获取code
      return false;
    }
    if(weixinCode !== undefined){//微信授权完成，调回此页面获取到code码，发送给后台保存
      //alert(weixinCode);
      sendWxCode({
        code:weixinCode
      }).then(res=>{
        //this.sellerNum = res;
        if(res !== null && res !== '' && res !== undefined){ 
          this.$router.replace({path:'/sellerSignUp',query:{sellerNum:res}});
        }
        //alert(res);
      }).catch(err=>{

      });
    }
    //alert(this.urlCode)
  },
}
</script>
<style lang="less" scoped>
</style>
