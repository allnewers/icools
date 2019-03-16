<template>
  <div>
    <div class="tel mg20">
      <label>联系电话:</label>
      <input type="text" maxlength="11" v-model="tel" placeholder="(选填）以便我们给您回复">
    </div>

    <div class="content mg20">
      <textarea ref="text" cols="40" maxlength="1000" rows="6" v-model="word" placeholder="反馈您的问题及意见，我们将为您不断改进..."></textarea>
      <div class="wordNum">( {{wordnum}} / 1000)</div>
      <button class="submit" :class="{isactive:isForbid}" @click="submit" :disabled="!isForbid">提交</button>
    </div>
  </div>
</template>
<script>
export default {
  name: "feedback",
  data() {
    return {
      tel: "",
      word: "",
      isForbid: false
    };
  },
  computed: {
    wordnum() {
      return this.word.length;
    }
  },
  mounted() {
    let browername = this.getBrowser();
    let self = this;   
    if (browername == 'safari') {
      this.$refs.text.addEventListener("blur", self.trigger, false);
    } else{
      this.$refs.text.addEventListener("keyup", self.trigger, false);
    }
  },
  methods: {
    trigger() {
      if (this.word != "") {
        this.isForbid = true;
      } else {
        this.isForbid = false;
      }
    },
    submit() {
      alert(1111);
    },

    getBrowser(getVersion) {//判断浏览器类型
      //注意关键字大小写
      var ua_str = navigator.userAgent.toLowerCase(),
        ie_Tridents,
        trident,
        match_str,
        ie_aer_rv,
        browser_chi_Type;
      //判断IE 浏览器,
      //blog: http://blog.csdn.net/aerchi/article/details/51697592
      if ("ActiveXObject" in self) {
        // ie_aer_rv:  指示IE 的版本.
        // It can be affected by the current document mode of IE.
        ie_aer_rv = (match_str = ua_str.match(/msie ([\d.]+)/))
          ? match_str[1]
          : (match_str = ua_str.match(/rv:([\d.]+)/))
          ? match_str[1]
          : 0;

        // ie: Indicate the really version of current IE browser.
        ie_Tridents = {
          "trident/7.0": 11,
          "trident/6.0": 10,
          "trident/5.0": 9,
          "trident/4.0": 8
        };
        //匹配 ie8, ie11, edge
        trident = (match_str = ua_str.match(/(trident\/[\d.]+|edge\/[\d.]+)/))
          ? match_str[1]
          : undefined;
        browser_chi_Type =
          (ie_Tridents[trident] || ie_aer_rv) > 0 ? "ie" : undefined;
      } else {
        //判断 windows edge 浏览器
        // match_str[1]: 返回浏览器及版本号,如: "edge/13.10586"
        // match_str[1]: 返回版本号,如: "edge"

        //若要返回 "edge" 请把下行的 "ie" 换成 "edge"。 注意引号及冒号是英文状态下输入的
        browser_chi_Type = (match_str = ua_str.match(/edge\/([\d.]+)/))
          ? "ie"
          : //判断firefox 浏览器
          (match_str = ua_str.match(/firefox\/([\d.]+)/))
          ? "firefox"
          : //判断chrome 浏览器
          (match_str = ua_str.match(/chrome\/([\d.]+)/))
          ? "chrome"
          : //判断opera 浏览器
          (match_str = ua_str.match(/opera.([\d.]+)/))
          ? "opera"
          : //判断safari 浏览器
          (match_str = ua_str.match(/version\/([\d.]+).*safari/))
          ? "safari"
          : undefined;
      }

     // console.log("author: aerchi, blog: http://blog.csdn.net/aerchi");

      //返回浏览器类型和版本号
      var verNum, verStr;
      verNum =
        trident && ie_Tridents[trident] ? ie_Tridents[trident] : match_str[1];

      verStr =
        getVersion != undefined
          ? browser_chi_Type + "/" + verNum
          : browser_chi_Type;
      return verStr;
    }
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
