<template>
  <div class="wraps">
    <div class="content" v-if="allshow">
      <!-- 轮播图 -->
      <Slide pos="index" :data="banners"/>
      <div class="search" :class="{bgActive:isbgActive}" @click="goSearch">
        <div class="icon">
          <img src="../assets/img/search@2x.png" alt>
        </div>
        <input type="text" :placeholder="tips" maxlength="30" readonly>
      </div>
      <div class="notice" :class="{bgActive:isbgActive}" @click="checkLogin('notice')">
        <img src="../assets/img/qi@2x.png" alt>
        <div class="redcircle" v-if="isNotice"></div>
      </div>
      <!-- 首页导航 -->
      <div class="nav">
        <ul>
          <li @click="subNav(item.id)" v-for="item in navs" :key="item.id">
            <img :src="item.image" alt>
          </li>
        </ul>
      </div>
      <div class="content" v-if="faddish.length>=1">
        <!-- 标题 -->
        <Top :types="showType" :title="faddish"/>
        <!-- 商品列表（每周） -->
        <div class="indexItem">
          <ul>
            <li v-for="item in faddish" :key="item.id" @click="goDetail(item.content)">
              <img :src="item.path" alt>
              <h2 class="nowrap">{{item.title}}</h2>
              <div class="prices clear">
                <p class="price fl">
                  ￥{{item.groupPrice}}
                  <!-- <span>￥{{item.price}}</span> -->
                </p>
                <p class="num fr">{{item.number}}人拼</p>
              </div>
            </li>
          </ul>
        </div>
        <!-- 标题 -->
        <Top :types="showType1" :title="newProduct"/>
        <!-- 商品列表（新品） -->
        <div class="indexItem">
          <ul>
            <li v-for="item in newProduct" :key="item.id" @click="goDetail(item.content)">
              <img :src="item.path" alt>
              <h2 class="nowrap">{{item.title}}</h2>
              <div class="prices clear">
                <p class="price fl">
                  ￥{{item.groupPrice}}
                  <!-- <span>￥{{item.price}}</span> -->
                </p>
                <p class="num fr">{{item.number}}人拼</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- <div class="loading" v-if="load">
        <Load/>
      </div> -->
      <div class="noData" v-if="noData">暂无数据</div>
      <div class="myZone" @click="checkLogin('myZone')">
        <img src="../assets/img/avatar@2x.png" alt>
      </div>
    </div>
    <div class="preload" v-if="!allshow"></div>
    <div class="adv" v-show="tanchu" @touchmove.prevent>
      <div class="content">
        <h2>1000元新人礼</h2>
        <h3>内含5张优惠券</h3>
        <p>个人中心-优惠券 查看详情</p>
        <div class="btn" @click="getDiscount">{{got?'去逛逛':'立刻领取'}}</div>
        <div v-show="got" class="hadgot"></div>
        <div class="closeAdv" @click="closeAdv">
          <img src="../assets/img/ad-close.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import weekImg from "../assets/img/week@2x.png";
import hotImg from "../assets/img/newPro@2x.png";
import navImg1 from "../assets/img/nav1@2x.png";
import navImg2 from "../assets/img/nav2@2x.png";
import navImg3 from "../assets/img/nav3@2x.png";
import Slide from "./common/slide";
import Top from "./common/top";
import { getIndexData, getNoticeNum } from "../api";
import { getCookie } from "../util";
import { setTimeout } from "timers";
import Load from "./common/loading";
import { mapState } from "vuex";
import { Indicator } from "mint-ui";
export default {
  name: "GBindex",
  data() {
    return {
      tips: "苹果XS Max",
      showType: weekImg, //标题类型
      showType1: hotImg,
      banners: "", //首页banner数据
      faddish: "", //爆款商品
      newProduct: [], //新商品
      token: "",
      //load: true,
      noData: false,
      isbgActive: false,
      allshow:false,
      navs: [
        {
          id: 1,
          image: navImg1
        },
        {
          id: 3,
          image: navImg2
        },
        {
          id: 2,
          image: navImg3
        }
      ],
      got:false,
      tanchu:true
    };
  },
  computed: {
    ...mapState(["isNotice"])
  },
  components: {
    Slide,
    Top,
    Load
  },
  mounted() {
    this.navBgChange();
    this.$store.commit("changeNotice", false);
    Indicator.open();
    getIndexData()
      .then(res => {
        let data = res.data;
        //console.log(res);
        this.banners = data.ad; //banner图数据
        //this.load = false;
        this.faddish = data.faddish;
        this.newProduct = data.newProduct;
        setTimeout(()=>{
          this.tanchu = true;
        },2000);
        
        Indicator.close();
        this.allshow =true;
        if (this.faddish.length === 0) {
          this.noData = true;
        }
      })
      .catch(err => {
        alert(err);
      });
    let token = getCookie("token");
    if (token != null) {
      //初始化 消息状态
      getNoticeNum({ token: token })
        .then(res => {
          console.log(res);
          if (res.result === true && res.data >= 1) {
            this.$store.commit("changeNotice", true);
          } else {
            //this.$toast(res.msg);
          }
        })
        .catch(err => {});
    } else {
      this.$store.commit("changeNotice", false);
    }
  },
  methods: {
    goSearch() {
      this.$router.push("/search");
    },
    subNav(id) {
      this.$router.push({ name: "proList", params: { id: id } });
    },
    goDetail(sn) {
      this.$router.push({ name: "detail", params: { sn: sn } });
    },
    checkLogin(urlCode) {
      let token = getCookie("token");
      if (token === null) {
        this.$toast({
          message: "您尚未登录，请登录",
          duration: 1000
        });
        setTimeout(() => {
          this.$router.push({ name: "phonelogin", params: { urlCode: urlCode } });
        }, 1000);
      } else {
        this.$router.push("/" + urlCode);
      }
    },
    closeAdv(){
      this.tanchu = false;
    },
    getDiscount(){
      if(this.token != null){

      }else{
        this.$router.push()
      }
    },
    navBgChange() {
      window.addEventListener("scroll", () => {
        let top =
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          window.pageYOffset; //要做兼容 在模拟器能正常获取scrolltop在微信h5页面和手机的浏览器页面一直为0
        if (top >= 100) {
          this.isbgActive = true;
        } else {
          this.isbgActive = false;
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.adv{
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0,0,0,.4);
  z-index: 1000;
  .content{
    width: 80%;
    height: 70vh;
    margin: 1rem auto;
    background: url('../assets/img/adv.png') no-repeat 0 center;
    background-size: 100%;
    overflow: hidden;
    text-align: center;
    text-indent: .3rem;
    position: relative;
    h2{
      margin-top: 3.6rem;
      color: #fff;
      font-size: .48rem;
      font-weight: bold;
    }
    h3{
      color: orange;
      font-weight: 500;
      line-height: .8rem;
    }
    p{
      font-size: .22rem;
      color:#fff;
      font-weight: 300;
    }
    .btn{
      color: #f0304a;
      width: 60%;
      height: .9rem;
      text-align: center;
      line-height: .8rem;
      text-indent: 0;
      background: url('../assets/img/btn-bg.png') no-repeat center;
      margin: .6rem 0 0 1.4rem;
      background-size: 100%;
      position: relative;
      z-index: 1002;
    }
    .hadgot{
      width: 1.26rem;
      height: 1.26rem;
      position: absolute;
      background: url('../assets/img/lingqu.png') no-repeat 6px center;
      background-size: 100%;
      left: 4rem;
      bottom: 2.4rem;
      z-index: 1001;
    }
    .closeAdv{
      width: .6rem;
      height: 1.3rem;
      position: relative;
      float: right;
      left: -1rem;
      top: .4rem;
      img{
        width: 100%;
        position: relative;
        z-index: -1;
      }
    }
  }
}
.wraps .bgActive {
  background: rgba(0, 0, 0, 0.5);
}
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
}
.preload{
  width: 100%;
  height: 100vh;
  background: url(../assets/img/index_bg.png) no-repeat;
  background-size: cover;
}
.search {
  position: fixed;
  top: 0.24rem;
  left: 0.28rem;
  width: 6.04rem;
  height: 0.6rem;
  background: rgba(255, 255, 255, 0.5);
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
      color: #fff;
    }
    color: #fff;
  }
}
.notice {
  position: fixed;
  top: 0.24rem;
  right: 0.28rem;
  height: 0.6rem;
  width: 0.6rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  img {
    width: 0.28rem;
    padding-top: 0.06rem;
  }
  .redcircle {
    position: absolute;
    width: 0.1rem;
    height: 0.1rem;
    background: #f0304a;
    border-radius: 50%;
    top: 0.14rem;
    right: 0.14rem;
  }
}
.nav {
  width: 100%;
  margin-bottom: 0.21rem;
  ul {
    display: flex;
    li {
      flex: 1;
      height: 2rem;
    }
  }
}
.indexItem {
  ul {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.2rem;
    flex-wrap: wrap;
    li {
      flex: 3.71rem 0 0;
      background: #fff;
      padding: 0.1rem 0 0.3rem;
      margin-bottom: 0.08rem;
      img {
        display: block;
        margin: 0 auto;
        width: 3.11rem;
        height: 3.5rem;
      }
      h2 {
        font-size: 0.26rem;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        padding: 0.2rem 0.28rem;
        height: 0.26rem;
        width: 3.1rem;
      }
    }
    .prices {
      padding: 0 0.2rem;
    }
    .price {
      font-size: 0.3rem;
      font-weight: 500;
      color: rgba(255, 70, 70, 1);
      span {
        font-size: 0.2rem;
        font-weight: 300;
        padding: 0 0 0 0.1rem;
        text-decoration: line-through;
        color: rgba(102, 102, 102, 1);
      }
    }
    .num {
      width: 0.78rem;
      height: 0.26rem;
      line-height: 0.26rem;
      text-align: center;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(255, 70, 70, 1);
      border-radius: 0.05rem;
      font-size: 0.2rem;
      font-weight: 400;
      color: rgba(255, 70, 70, 1);
      margin-top: 0.05rem;
      &::after {
        content: " ";
        display: inline-block;
        width: 0;
        height: 100%;
        vertical-align: middle;
        margin-top: 1px;
      }
    }
  }
}
.noData {
  text-align: center;
  padding: 0.4rem 0;
  color: #666;
}
.myZone {
  width: 1.13rem;
  height: 0.92rem;
  position: fixed;
  bottom: 1.48rem;
  background: rgba(0, 0, 0, 0.15);
  right: 0;
  border-radius: 0.7rem 0 0 0.7rem;
  img {
    width: 0.84rem;
    position: relative;
    left: 0.04rem;
    top: 0.04rem;
  }
}
</style>

