<template>
  <div>
    <Slide pos="detail" :data="banners"/>
    <div class="titles">Apple 苹果 iPhone X 全面屏手机 深空灰色 全网通 64GB</div>
    <!-- 拼团中的列表 -->
    <div class="grouping">
      <div class="top">
        以下小伙伴正在发起拼团，可直接参与
        <span class="more" @click="moreGroup">查看更多</span>
      </div>
      <div class="groupList">
        <ul>
          <li class="clear">
            <div class="user">
              <img src="../assets/img/user@2x.png" alt>
              <p>邻家小妹</p>
            </div>
            <div class="jindu">
              <div>
                <p>
                  还差
                  <span>1</span>人成团
                </p>
                <p>
                  剩余
                  <span>23:11:31</span>结束
                </p>
              </div>
            </div>
            <div class="btn">去凑团</div>
          </li>
          <li class="clear">
            <div class="user">
              <img src="../assets/img/user@2x.png" alt>
              <p>邻家小妹</p>
            </div>
            <div class="jindu">
              <div>
                <p>
                  还差
                  <span>1</span>人成团
                </p>
                <p>
                  剩余
                  <span>23:11:31</span>结束
                </p>
              </div>
            </div>
            <div class="btn">去凑团</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="wanfa">
      支付开团邀请一人参团，人数不足自动退款
      <span class="more" @click="gameIntro">玩法详情</span>
    </div>
    <!-- 商品评价 -->
    <div class="comments">
      <div class="top" @click="moreComments">
        商品评价(999)
        <span></span>
      </div>
      <swiper :options="swiperOption" ref="mySwiper">
        <!-- slides -->
        <swiper-slide>
          <div class="item clear">
            <div class="txt fl">
              <div class="userInfo">
                <img src="../assets/img/user@2x.png" alt>
                <span>邻家小妹</span>
              </div>
              <p>第一次在爱酷士上买东西 真是超值，喝点酒撒谎喝点酒撒谎喝点酒撒谎</p>
            </div>
            <img class="fr prod" src="../assets/img/prod@2x.png" alt>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="item clear">
            <div class="txt fl">
              <div class="userInfo">
                <img src="../assets/img/user@2x.png" alt>
                <span>邻家小妹</span>
              </div>
              <p>第一次在爱酷士上买东西 真是超值，喝点酒撒谎喝点酒撒谎喝点酒撒谎</p>
            </div>
            <img class="fr prod" src="../assets/img/prod@2x.png" alt>
          </div>
        </swiper-slide>
        <!-- Optional controls -->
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
    <!-- 参数信息 -->
    <div class="proInfos">
      <div class="tips">参数信息</div>
      <div class="phone-infos">
        <p v-for="(item,index) in proList" :key="index">{{item.name}} : {{item.title}}</p>
      </div>
      <div class="collapse">全部</div>
    </div>
    <!-- 标题 -->
    <Top :types="showType1"/>
    <div class="detail-imgs">
      <div class="item">
        <img src="../assets/img/big1@2x.png" alt>
      </div>
    </div>
    <!-- 底部导航 -->
    <div class="blank"></div>
    <div class="nav-bottom">
      <ul>
        <li>
          <img src="../assets/img/home@2x.png" alt>
          <p>首页</p>
        </li>
        <li>
          <img src="../assets/img/like@2x.png" alt>
          <p>收藏</p>
        </li>
        <li @click="goBuy('single')">
          <p>¥6188</p>
          <div>单买</div>
        </li>
        <li @click="goBuy('tuanBuy')">
          <p>¥3188</p>
          <div>一键开团</div>
        </li>
      </ul>
    </div>

    <!-- 选择商品弹框 -->
    <transition name="slideUp">
      <div class="selectC" v-show="dialog">
        <Selects @closeD="closeDialog">
          <div class="wrap">
            <div class="product-top clear">
              <img class="fl" src alt>
              <div class="baseInfo fl">
                <h2>iPhone XS</h2>
                <div class="balance">库存100件</div>
                <p class="price">¥290</p>
              </div>
            </div>
            <div class="rules wrapper" ref="wrapper">
              <ul>
                <li>
                  <h3>颜色</h3>
                  <div class="choices">
                    <span class="pink">金色</span>
                    <span>银色</span>
                  </div>
                </li>
                <li>
                  <h3>容量</h3>
                  <div class="choices">
                    <span>64G</span>
                    <span>256G</span>
                  </div>
                </li>
                <li>
                  <h3>容量</h3>
                  <div class="choices">
                    <span>64G</span>
                    <span>256G</span>
                  </div>
                </li>
              </ul>
            </div>
            <div class="sum clear">
              <div class="tit fl">购买数量</div>
              <div class="compute fr">
                <button class="fl" @click="decrease">-</button>
                <input class="fl" type="text" v-model="snum" readonly onfocus="this.blur();">
                <button class="fl" @click="increase">+</button>
              </div>
            </div>
            <div class="selected">
              <button @click="toBuy">确定</button>
            </div>
          </div>
        </Selects>
      </div>
    </transition>

    <transition name="slideUp">
      <div class="selectC" v-show="tuanShow" @touchmove.prevent>
        <Selects @closeD="closeDialog">
          <div class="groupList">
            <div class="g-top">正在拼团</div>
            <div class="groupList">
              <ul>
                <li class="clear">
                  <div class="user">
                    <img src="../assets/img/user@2x.png" alt>
                    <p>邻家小妹</p>
                  </div>
                  <div class="jindu">
                    <div>
                      <p>
                        还差
                        <span>1</span>人成团
                      </p>
                      <p>
                        剩余
                        <span>23:11:31</span>结束
                      </p>
                    </div>
                  </div>
                  <div class="btn">去凑团</div>
                </li>
                <li class="clear">
                  <div class="user">
                    <img src="../assets/img/user@2x.png" alt>
                    <p>邻家小妹</p>
                  </div>
                  <div class="jindu">
                    <div>
                      <p>
                        还差
                        <span>1</span>人成团
                      </p>
                      <p>
                        剩余
                        <span>23:11:31</span>结束
                      </p>
                    </div>
                  </div>
                  <div class="btn">去凑团</div>
                </li>
              </ul>
            </div>
            <div class="g-top ziti">仅显示5个正在凑团的人</div>
          </div>
        </Selects>
      </div>
    </transition>
  </div>
</template>
<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import Slide from "./common/slide";
import Top from "./common/top";
import Selects1 from "./common/select";
import detailIcon from "../assets/img/detaiIcon@2x.png";
import BScroll from "better-scroll";
export default {
  name: "detail",
  data() {
    return {
      swiperOption: {
        //autoplay:true,
        spaceBetween: 30,
        freeMode: true,
        freeModeMomentumBounceRatio: 5
      },
      showType1: detailIcon,
      snum: 1,
      dialog: false,
      tuanShow: false,
      banners:''
    };
  },
  components: {
    Slide,
    swiper,
    swiperSlide,
    Top,
    Selects1
  },
  computed: {
    proList() {
      let detailList = [];
      let items = [
        "商品名称",
        "品牌",
        "指纹识别",
        "网络制式",
        "产品特点",
        "cpu",
        "电量"
      ];
      let lists = [
        "小米5X 全网通版",
        "小米(MI)",
        "支持背部指纹识别",
        "4G全网通（双卡）",
        "1080P全高清屏幕",
        "晓龙845",
        "4000毫安"
      ];
      for (var i = 0; i < items.length; i++) {
        let item = { title: lists[i], name: items[i] };
        detailList.push(item);
      }
      return detailList;
    }
  },
  mounted() {
    this.$nextTick(() => {
      //$refs绑定元素
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.wrapper, {
          //开启点击事件 默认为false
          click: true
        });
        // console.log(this.scroll)
      } else if (!this.$refs.wrapper) {
        return;
      } else {
        this.scroll.refresh();
      }
    });
  },
  methods: {
    moreGroup() {
      this.tuanShow = true;
    },
    goBuy() {
      this.dialog = true;
    },
    increase() {
      ++this.snum;
    },
    decrease() {
      if (this.snum > 1) {
        --this.snum;
      }
    },
    closeDialog(val) {
      this.dialog = val;
      this.tuanShow = val;
    },
    gameIntro() {
      this.$router.push("/game");
    },
    moreComments() {
      this.$router.push("/comments");
    },
    toBuy() {
      this.$router.push("/order");
      this.$store.commit("toggleDialog", false);
    }
  },
  watch: {
    dialog: {
      handler(val, oldVal) {
        if (val === true) {
          this.noScroll();
        } else {
          this.canScroll();
        }
        document.body.scrollTop = this.pageScrollYoffset;
        window.scroll(0, this.pageScrollYoffset);
      },
      deep: false
    }
  }
};
</script>
<style lang="less" scoped>
.swiper-slide {
  width: 65% !important;
  margin-right: 0.1rem;
}
.swiper-container {
  margin-left: 0.28rem;
}
.titles {
  padding: 0.3rem 0.28rem;
  background: #fff;
  font-size: 0.32rem;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  margin-bottom: 0.2rem;
}
.wanfa {
  background: #fff;
  padding: 0.33rem 0.28rem;
  margin-top: 0.1rem;
}
.top,
.wanfa {
  height: 0.9rem;
  line-height: 0.9rem;
  font-size: 0.26rem;
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
.grouping {
  background: #fff;
}
.groupList {
  li {
    display: flex;
    justify-content: space-between;
    padding: 0.15rem 0;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
    .user {
      line-height: 0.9rem;
      display: flex;
      img {
        height: 0.9rem;
        width: 0.9rem;
        border-radius: 50%;
      }
      p {
        padding-left: 0.2rem;
        font-size: 0.28rem;
        font-weight: 400;
        width: 1.2rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .jindu {
      margin-left: 0.6rem;
      margin-right: -0.2rem;
      p {
        font-size: 0.26rem;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        padding: 0.05rem 0;
        text-align: right;
        span {
          color: #f24848;
          padding: 0 0.1rem;
        }
        &:last-child {
          color: #666;
        }
      }
    }
    .btn {
      flex: 1.36rem 0 0;
      height: 0.58rem;
      background: rgba(242, 72, 72, 1);
      border-radius: 5px;
      line-height: 0.58rem;
      text-align: center;
      font-weight: 400;
      color: #fff;
      font-size: 0.28rem;
    }
  }
}
.g-top {
  height: 1rem;
  line-height: 1rem;
  text-align: center;
  font-size: 0.34rem;
  color: #666;
  border-bottom: 1px solid #f0f0f0;
}
.ziti {
  font-size: 0.24rem;
}
.comments {
  background: #fff;
  margin-top: 0.1rem;
  padding-bottom: 0.3rem;
  .top {
    color: #666;
    border: none;
  }
}
.item {
  width: 5rem;
  border: 1px solid #f0f0f0;
  .txt {
    padding: 0 0.2rem 0.15rem;
    line-height: 0.5rem;
    width: 2.7rem;
    font-size: 0.26rem;
    img {
      border-radius: 50%;
      width: 0.5rem;
      height: 0.5rem;
      display: inline-block;
      position: relative;
      top: 0.15rem;
    }
    span {
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      padding-left: 0.1rem;
    }
    p {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
  }
  .prod {
    height: 1.8rem;
    width: 1.8rem;
  }
}
.proInfos {
  padding: 0 0.28rem;
  background: #fff;
  font-weight: 400;
  margin-top: 0.1rem;
  margin-bottom: 0.2rem;
  .tips {
    height: 0.97rem;
    line-height: 0.97rem;
    font-size: 0.26rem;
    color: rgba(102, 102, 102, 1);
  }
  p {
    font-size: 0.26rem;
    color: rgba(51, 51, 51, 1);
    line-height: 0.5rem;
  }
  .collapse {
    text-align: center;
    font-size: 0.26rem;
    color: rgba(106, 150, 217, 1);
    padding: 0.2rem 0;
    width: 30%;
    margin: 0 auto;
  }
}
.detail-imgs {
  overflow: hidden;
  .item {
    width: 100%;
    text-align: center;
    img {
      max-width: 100%;
    }
  }
}
.blank {
  height: 1rem;
  margin-top: 0.2rem;
}
.nav-bottom {
  height: 1rem;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  background: #fff;
  z-index: 1000;
  ul {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    li {
      text-align: center;
      font-size: 0.22rem;
      img {
        width: 0.36rem;
        height: 0.36rem;
        display: inline;
        padding-top: 0.15rem;
      }
    }
    li:nth-child(1) {
      flex: 1.6;
      border-right: 1px solid #f0f0f0;
    }
    li:nth-child(2) {
      flex: 1.6;
    }
    li:nth-child(3) {
      flex: 2.4;
      background: #333;
      color: #fff;
      font-size: 0.28rem;
      p {
        font-size: 0.26rem;
        padding-top: 0.1rem;
      }
    }
    li:nth-child(4) {
      flex: 3;
      background: #f24848;
      color: #fff;
      font-size: 0.3rem;
      p {
        font-size: 0.26rem;
        padding-top: 0.1rem;
      }
    }
  }
}
//弹框 slot样式
.wrap {
  padding: 0.28rem;
}
.product-top {
  img {
    height: 2rem;
    width: 2rem;
    border: 1px solid #f0f0f0;
  }
  .baseInfo {
    margin-left: 0.6rem;
    line-height: 0.6rem;
    h2 {
      font-size: 0.28rem;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 3.4rem;
    }
    .balance {
      font-size: 0.24rem;
      font-weight: 300;
      color: rgba(102, 102, 102, 1);
    }
    .price {
      font-size: 0.32rem;
      font-weight: 500;
      color: rgba(242, 72, 72, 1);
    }
  }
}
.rules {
  margin-top: 0.3rem;
  height: 3.6rem;
  position: absolute;
  overflow: hidden;
  ul {
    li {
      color: rgba(51, 51, 51, 1);
      font-size: 0.28rem;
      font-weight: 500;
      margin-bottom: 0.2rem;
      h3 {
        line-height: 0.6rem;
        font-weight: 500;
        font-size: 0.28rem;
      }
      .choices {
        overflow: hidden;
        span {
          float: left;
          width: 1.6rem;
          height: 0.72rem;
          text-align: center;
          line-height: 0.72rem;
          border: 1px solid #f0f0f0;
          border-radius: 0.08rem;
          margin-right: 0.2rem;
          &.pink {
            background: #fff2f2;
            border: 1px solid #f24848;
          }
        }
      }
    }
  }
}
.sum {
  color: #333;
  margin-top: 4.2rem;
  .tit {
    font-size: 0.3rem;
  }
  .compute {
    button {
      width: 0.6rem;
      height: 0.6rem;
      border: 1px solid #f0f0f0;
      font-size: 0.4rem;
      line-height: 0.4rem;
      text-align: center;
      padding: 0;
      font-weight: 300;
    }
    input {
      width: 0.8rem;
      border: 1px solid #f0f0f0;
      border-radius: 0;
      height: 0.56rem;
      text-align: center;
      font-size: 0.3rem;
      color: #333;
      font-weight: 400;
    }
  }
}
.selected {
  margin: 0.5rem 0 0;
  text-align: center;
  button {
    text-align: center;
    height: 0.9rem;
    line-height: 0.9rem;
    color: #fff;
    font-size: 0.3rem;
    font-weight: 400;
    background: #333;
    width: 90%;
  }
}
.moreGroup {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
  background: rgba(0, 0, 0, 0.5);
}
.bg {
  background: #fff;
  width: 100%;
  height: 70%;
  position: absolute;
  bottom: 0;
  left: 0;
  .close-dialog {
    position: absolute;
    top: 0.3rem;
    right: 0.3rem;
    height: 0.6rem;
    width: 0.6rem;
    text-align: center;
    img {
      max-width: 100%;
      width: 0.48rem;
      display: inline;
    }
  }
}

</style>




