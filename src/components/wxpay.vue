<template>
  <div>
    
  </div>
</template>
<script>
import { GetRequest } from '../util'
export default {
  name:"wxpay",
  data(){
    return {
    }
  },
  mounted(){
    this.getPayCode();
  },
  methods:{
    getPayCode(){
       let urlStr = window.location.href;
        alert(urlStr);
      let querys = GetRequest();
      //let query = this.$route.query;
      alert(JSON.stringify(querys));
      if(querys.code){
        this.paycode = query.code;
        this.$router.replace({path:'payType',query:{paycode:querys.code}});
        return;
      } else{
        this.$router.replace('/home');
      }
    }
  },
  watch:{
    '$route':'getPayCode'
  }
}
</script>
<style lang="less" scoped>
</style>
