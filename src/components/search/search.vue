<template>
  <div class="wrap">
    <div class="search">
      <div class="icon">
        <img src="../../assets/img/search1@2x.png" alt>
      </div>
      <input type="text" v-model.trim="keys" :placeholder="tips" maxlength="30">
    </div>
    <button class="btn" @click="searchList(keys)">搜索</button>
    <div class="labels">
      <div class="history">
        <h3>{{historyTag.name}}</h3>
        <ul class="clear">
          <li @click="searchList(item)" v-for="(item,index) in historyTag.infoList" :key="index">{{item}}</li>
        </ul>
      </div>
      <div class="hotSearch">
        <h3>{{hotTag.name}}</h3>
        <ul class="clear">
          <li @click="searchList(item)" v-for="(item,index) in hotTag.infoList" :key="index">{{item}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { search, searchTag } from "../../api";
import { getCookie } from "../../util";
import { Indicator } from 'mint-ui';
export default {
  name: "search",
  data() {
    return {
      tips: "苹果XS Max",
      keys: "",
      token:null,
      historyTag:'',//历史标签
      hotTag:''//热门标签
    };
  },
  mounted() {
    let token = getCookie("token");
    this.token = token;
    //初始化搜索标签
    Indicator.open();//加载中....
    //alert(token);
    searchTag({token:token})
      .then(res => {
        this.historyTag = res.data.history;
        this.hotTag = res.data.hot;
        Indicator.close();//数据加载完成，关闭加载中
        //设定 placeholder 展示的标签
        this.tips = this.hotTag.infoList[0];
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    goList() {
      this.$router.push("/tuanList");
    },
    searchList(keywords) {//查询相关商品 列表
      this.$store.commit("changeSearchList", ""); //初始化数据
      if (keywords == "") {
        keywords = this.tips;
      }
      this.$router.push({
        name: "tuanList",
        params: { keyword: keywords }
      });
      // Indicator.open();//加载中....
      // search({ keyword: keywords,token:this.token,pageNum:1})
      //   .then(res => {
      //     let data = res.data.page.list;
      //     this.$store.commit("changeSearchList", data);
      //     Indicator.close();//数据加载完成，关闭加载中
      //     this.$router.push({
      //       name: "tuanList",
      //       params: { keyword: keywords }
      //     });
      //   })
      //   .catch(err => {
      //     this.$toast('系统出错了哦~');
      //   });
    }
  }
};
</script>
<style lang="less" scoped>
.wrap {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: #fff;
}
.search {
  position: absolute;
  top: 0.24rem;
  left: 0.28rem;
  width: 6rem;
  height: 0.6rem;
  background: #f1f1f1;
  z-index: 1000;
  border-radius: 0.3rem;
  line-height: 0.6rem;
  .icon {
    position: absolute;
    height: 0.26rem;
    width: 0.27rem;
    top: 0.2rem;
    left: 0.2rem;
  }
  input {
    padding-left: 0.6rem;
    width: 80%;
    &::placeholder {
      color: #666;
    }
    color: #666;
  }
}
.btn {
  position: absolute;
  top: 0.24rem;
  right: 0.28rem;
  font-size: 0.28rem;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 0.6rem;
}
.labels {
  margin-top: 1.2rem;
  padding: 0 0.28rem;
  h3 {
    font-size: 0.28rem;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    line-height: 0.6rem;
  }
  ul {
    margin-top: 0.2rem;
  }
  li {
    float: left;
    background: rgba(238, 238, 238, 1);
    border-radius: 0.3rem;
    padding: 0 0.3rem;
    height: 0.6rem;
    line-height: 0.6rem;
    text-align: center;
    font-size: 0.24rem;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    margin: 0 0.2rem 0.3rem 0;
    min-width: .45rem;
  }
}
</style>


