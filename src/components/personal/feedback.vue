<template>
  <div>
    <div class="tel mg20">
      <label>联系电话:</label>
      <input type="text" maxlength="11" v-model="tel" placeholder="(选填）以便我们给您回复">
    </div>

    <div class="content mg20">
      <textarea ref="text" cols="40" maxlength="200" rows="6" v-model="word" placeholder="反馈您的问题及意见，我们将为您不断改进..."></textarea>
      <div class="wordNum">( {{wordnum}} / 200)</div>
      <button class="submit" :class="{isactive:isForbid}" @click="submit" :disabled="!isForbid">提交</button>
    </div>
  </div>
</template>
<script>
import { getBrowser ,getCookie} from '../../util'
import { feedBacks } from '../../api'
import { setTimeout } from 'timers';
export default {
  name: "feedback",
  data() {
    return {
      tel: "",
      word: "",
      isForbid: true,
      token:''
    };
  },
  computed: {
    wordnum() {
      return this.word.length;
    }
  },
  mounted() {
    let token = getCookie('token');
    let browername = getBrowser();
    let self = this;   
    this.token = token;
    
    //alert(browername)
    // if (browername == 'safari') {
    //   this.$refs.text.addEventListener("blur", self.trigger, false);
    // } else{
    //   this.$refs.text.addEventListener("keyup", self.trigger, false);
    // }
  },
  methods: {
    // trigger() {
    //   if (this.word != "") {
    //     this.isForbid = true;
    //   } else {
    //     this.isForbid = false;
    //   }
    // },
    submit() {
      alert(this.token);
      feedBacks({
        token:this.token,
        title:'拼团意见反馈',
        content:this.word
      }).then(res=>{
        if(res.result === true){
          this.$toast({message:'反馈成功！',duration:1000});
          setTimeout(()=>{
            this.$router.go(-1);
          },1000);
        }else{
          this.$toast(res.msg);
        }
      }).catch(err=>{
        this.$toast(err);
      });
    },  
  }
};
</script>
<style lang="less" scoped>
.mg20 {
  margin-top: 0.2rem;
}
.tel {
  height: 1rem;
  line-height: 1rem;
  background: #fff;
  padding: 0 0.28rem;
  input {
    font-size: 0.3rem;
    width: 70%;
  }
}
.content {
  padding: 0.28rem;
  background: #fff;
  box-sizing: content-box;
  position: relative;
  textarea {
    width: 90%;
    font-size: 0.3rem;
    border: 1px solid #f0f0f0;
    line-height: 0.5rem;
    padding: 0.28rem;
    -webkit-appearance: none;
  }
  .wordNum {
    position: absolute;
    bottom: 2.8rem;
    right: 0.5rem;
    font-size: 0.28rem;
    color: #666;
  }
  .submit {
    margin: 1rem auto 0.5rem;
    width: 98%;
    height: 0.9rem;
    text-align: center;
    font-size: 0.3rem;
    color: #fff;
    line-height: 0.9rem;
    background: #d8d8d8;
    border-radius: 4px;
    &.isactive {
      background: #333;
    }
  }
}
</style>
