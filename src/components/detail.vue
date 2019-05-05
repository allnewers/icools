<template>
  <div>
    <div class="wrapper" :style="{overflow:isScroll,height:limitH,position:pos,width:widths,zIndex:1000}">
      <div class="content" v-if="allshow" >
        <div class="banner">
          <swiper :options="swiperOption1" ref="mySwiper">
            <swiper-slide v-for="(item,index) in detailBanner" :key="item.id">
              <span class="img-banner" @click="preview(index)">
                <img :src="'http://eicools.oss-cn-beijing.aliyuncs.com/'+item.large" alt>
              </span>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
        <div class="titles">{{detailAllData.fullName}}</div>
        <!-- 拼团中的列表 -->
        <div class="grouping" v-if="groupingList">
          <div class="top">
            以下小伙伴正在发起拼团，可直接参与
            <span class="more" @click="moreGroup">查看更多</span>
          </div>
          <div class="groupList">
            <ul>
              <li class="clear" v-for="item in groupingTwoNum" :key="item.id">
                <div class="user">
                  <img v-lazy="item.avatar" alt>
                  <p>{{item.name}}</p>
                </div>
                <div class="jindu">
                  <p>
                    还差
                    <span>{{item.needNum}}</span>人成团
                  </p>
                  <div class="countDown">
                    <i>剩余</i>
                    <count-down
                      :currentTime="item.nowTimestamp"
                      :startTime="item.nowTimestamp"
                      :endTime="item.endTimestamp"
                      :tipText="'距离开始文字1'"
                      :tipTextEnd="'距离结束文字1'"
                      :endText="'结束自定义文字2'"
                      :dayTxt="'天'"
                      :hourTxt="':'"
                      :minutesTxt="':'"
                      :secondsTxt="''"
                      v-on:end_callback="countDownE_cb()"
                    ></count-down>
                  </div>
                </div>
                <div
                  class="btn"
                  :class="{btnDisabled:groupEnd}"
                  @click="goBuyList(item.groupPrice)"
                >{{!groupEnd?"去凑团":"已结束"}}</div>
              </li>
            </ul>
          </div>
        </div>
        <!-- 拼团活动详情 -->
        <div class="wanfa">
          支付开团邀请一人参团，人数不足自动退款
          <span class="more" @click="jumpUrl('game')">玩法详情</span>
        </div>
        <!-- 商品评价 -->
        <div class="comments" v-if="comments.length>=1">
          <div class="top" @click="goComments()">
            商品评价
            <span>查看更多</span>
          </div>
          <div class="lu">
            <swiper :options="swiperOption" ref="mySwiper">
              <!-- slides -->
              <swiper-slide v-for="item in comments" :key="item.id">
                <div class="item clear" @click="goComments">
                  <div class="txt fl">
                    <div class="userInfo">
                      <img v-lazy="item.userImage" alt>
                      <span>{{item.username}}</span>
                    </div>
                    <p>{{item.content}}</p>
                  </div>
                  <img class="fr prod" v-lazy="imgBaseUrl+item.imgurlArr[0]" alt>
                </div>
              </swiper-slide>
              <!-- Optional controls -->
              <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
          </div>
        </div>
        <!-- 参数信息 -->
        <div class="proInfos">
          <div class="tips">参数信息</div>
          <div class="phone-infos" v-for="item in infoList" :key="item.id">
            <p v-for="itemc in item.items" :key="itemc.pid">{{itemc.pname}} : {{itemc.pval}}</p>
          </div>
          <div class="collapse" @click="moreInfos(slideMore)">{{slidetxt}}</div>
        </div>
        <!-- 标题 -->
        <Top :types="showType1"/>
        <!-- 图文详情 -->
        <div class="detail-imgs">
          <div class="item" v-for="(item,index) in imgDetail" :key="index">
            <img v-lazy="item" alt>
          </div>
        </div>
        <!-- 底部导航 -->
        <div class="blank"></div>
        <div class="nav-bottom">
          <ul>
            <li @click="jumpUrl('')">
              <img src="../assets/img/home@2x.png" alt>
              <p>首页</p>
            </li>
            <li @click="collect()">
              <img v-if="!isCollect" src="../assets/img/like@2x.png" alt>
              <img v-if="isCollect" src="../assets/img/like1@2x.png" alt>
              <p>收藏</p>
            </li>
            <li @click="goBuy(detailAllData.price,'single')">
              <p>¥{{detailAllData.price | returnFloat}}</p>
              <div>单买</div>
            </li>
            <li @click="goBuy(detailAllData.groupPrice,'group')">
              <p>¥{{detailAllData.groupPrice | returnFloat}}</p>
              <div>一键开团</div>
            </li>
          </ul>
        </div>
      </div>
      <div class="preload" v-if="!allshow"></div>
      <!-- 选择商品弹框 -->
      <transition name="slideUp">
        <div class="selectC" v-show="dialog">
          <Selects @closeD="closeDialog">
            <div class="wrap" >
              <div class="product-top clear">
                <img class="fl" :src="'http://eicools.oss-cn-beijing.aliyuncs.com/'+ thumbnail" alt>
                <div class="baseInfo fl">
                  <h2>{{detailAllData.name}}</h2>
                  <!-- <div class="balance">库存100件</div> -->
                  <p class="price" v-if="parseFloat(price)">¥{{price | returnFloat}}</p>
                  <p class="price" v-else>{{price}}</p>
                </div>
              </div>
              <div class="rules wrapper" ref="wrapper">
                <ul>
                  <li v-for="(selectItem ,index) in SpecificationList" :key="selectItem.id">
                    <h3>{{selectItem.name}}</h3>
                    <div class="choices">
                      <!-- <span class="pink">金色</span> -->
                      <span
                        @click="specificationBtn(value.name,value.image,index,n)"
                        :class="[subIndex[index] == n ? 'selectActive' :'']"
                        v-for="(value,n) in selectItem.specificationValues"
                        :key="value.id"
                      >{{value.name}}</span>
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
                <button
                  @click="toBuy"
                  :class="confirmSelect?'':'noBuy'"
                  :disabled="!confirmSelect"
                >确定</button>
              </div>
            </div>
          </Selects>
        </div>
      </transition>
      <!-- 正在拼团 展开列表 -->
      <transition name="slideUp">
        <div class="selectC" v-show="tuanShow" @touchmove.prevent>
          <Selects @closeD="closeDialog">
            <div class="groupList1">
              <div class="g-top">正在拼团</div>

              <div class="groupList">
                <ul>
                  <li class="clear" v-for="item in groupingNum" :key="item.id">
                    <div class="user">
                      <img v-lazy="item.avatar" alt>
                      <p>{{item.name}}</p>
                    </div>
                    <div class="jindu">
                      <p>
                        还差
                        <span>{{item.needNum}}</span>人成团
                      </p>
                      <div class="countDown">
                        <i>剩余</i>
                        <count-down
                          :currentTime="item.nowTimestamp"
                          :startTime="item.nowTimestamp"
                          :endTime="item.endTimestamp"
                          :tipText="'距离开始文字1'"
                          :tipTextEnd="'距离结束文字1'"
                          :endText="'结束自定义文字2'"
                          :dayTxt="'天'"
                          :hourTxt="':'"
                          :minutesTxt="':'"
                          :secondsTxt="''"
                        ></count-down>
                      </div>
                    </div>
                    <div
                      class="btn"
                      :class="{btnDisabled:groupEnd}"
                      @click="goBuyList(item.groupPrice)"
                    >{{!groupEnd?"去凑团":"已结束"}}</div>
                  </li>
                </ul>
              </div>
              <div class="g-top ziti">最多仅显示5个正在凑团的人</div>
            </div>
          </Selects>
        </div>
      </transition>
    </div>
    <div class="norender" v-if="noRendered"></div>
  </div>
</template>
<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import Slide from "./common/slide";
import Top from "./common/top";
import Selects1 from "./common/select";
import detailIcon from "../assets/img/detaiIcon@2x.png";
import {
  getDetail,
  eachGoodsBuyList,
  collectProduct,
  updateGroupPrice,
  updateSinglePrice
} from "../api";
import { getCookie,toTop,setCookie,imgBaseUrl } from "../util";
import { mapState, mapGetters } from "vuex";
import CountDown from "vue2-countdown";
import { Indicator } from "mint-ui";
export default {
  name: "detail",
  data() {
    return {
      imgBaseUrl,
      swiperOption: {
        //autoplay:true,
        //spaceBetween: 20,
        freeMode: true,
        //slidesPerView: 0,
        freeModeMomentumBounce: true,
        freeModeMomentumBounceRatio: 1
      },
      swiperOption1: {
        //autoplay:true,
        pagination: {
          el: ".swiper-pagination",
          type: "fraction"
        }
      },
      showType1: detailIcon,
      snum: 1,
      dialog: false,
      tuanShow: false,
      token: "",
      noRendered: false,
      detailAllData: "",
      comments: [],
      goodsId: '',
      groupingNum: "", //正在拼团的 列表
      SpecificationInfo: [], //规格详情
      slideMore: false,
      slidetxt: "全部",
      imgDetail: [], //图文详情
      price: "", //切换 规格后 刷新的价格
      groupPrice: "",
      allshow: false, //预加载 背景
      groupEnd: false, //团购倒计时 结束
      groupingList: false, //正在拼团的列表
      isCollect: false, //是否收藏
      SpecificationList: [], //商品多规格选择 列表(要被渲染的字段)
      //isSelected:false,
      isForbidSelected: false,
      selectArr: [], //存放被选中的值
      shopItemInfo: {}, //存放要和选中的值进行匹配的数据
      subIndex: [], //是否选中 因为不确定是多规格还是但规格，所以这里定义数组来判断
      allSpecificationCombined: [], //所有 可能出现的 规格组合
      combinations: [], //所有选中的 方式
      productId: "", //选中 商品的id
      buyType: "", //购买方式 单买或拼团
      confirmSelect: true, //选中商品 是否可购买
      thumbnail: "", //手机缩略图
      title: "",
      sn:'',
      isScroll:'auto',
      limitH:'auto',
      pos:'initial',
      widths:'100%'
    };
  },
  components: {
    Slide,
    swiper,
    swiperSlide,
    Top,
    Selects1,
    CountDown
  },
  computed: {
    ...mapState(["detailBanner"]),
    ...mapGetters(["bannerImgList"]),
    infoList: {
      get() {
        if (!this.slideMore) {
          if (this.SpecificationInfo.length < 3) {
            return this.SpecificationInfo;
          }
          return this.SpecificationInfo.slice(0, 2);
        }
        return this.SpecificationInfo;
      },
      set(val) {
        this.infoList = val;
      }
    },
    groupingTwoNum() {
      return this.groupingNum.slice(0, 2);
    }
  },
  mounted() {
    toTop(); //进入详情页 到顶部显示
    let sn = this.$route.params.sn;
    let token = getCookie("token");
    this.sn = sn;
    this.token = token;
    //console.log(sn);
    Indicator.open();
    getDetail({ sn: sn, token: this.token })
      .then(res => {
        console.log(res);
        this.detailAllData = res.data;
        this.isCollect = res.data.isFavorite;
        this.comments = res.data.reviewList;
        this.SpecificationInfo = res.data.parameterList;
        this.imgDetail = res.data.contentImageList;
        this.SpecificationList = res.data.specificationList;
        this.defaultSpecification = res.data.productSpecifecationList;
        //alert(JSON.stringify(this.defaultSpecification));
        this.allSpecificationCombined = res.data.goodsSpecificationList;
        //this.moreSpecification = res.data.parameterList.slice(2);
        this.goodsId = res.data.id;
        this.$store.commit("changeDetailBanner", res.data.productImageVos);
        //console.log(this.detailBanner);
        this.thumbnail = this.detailBanner[0].listMedium; //初始化 规格选择 缩略图
        for (let i in this.allSpecificationCombined) {
          //修改数据结构格式，改成键值对的方式，以方便和选中之后的值进行匹配
          this.shopItemInfo[
            this.allSpecificationCombined[i].specValName
          ] = this.allSpecificationCombined[i];
          this.combinations = this.allSpecificationCombined[i].specValName;
        }
        //alert(JSON.stringify(this.shopItemInfo));
        eachGoodsBuyList({ product: this.goodsId }) //团购人数 列表
          .then(res => {
            //console.log(res);
            let groupList = res.data;
            if (groupList.length >= 1) {
              this.groupingList = true;
            }
            this.groupingNum = groupList;

            Indicator.close();
            this.allshow = true;
          })
          .catch(err => {});
        this.getNowchoice(); //默认选中的 规格 及商品id，title
        this.checkItem(); //初始化选中
        setCookie('productId',this.productId,7);//cookie 存储商品id

      })
      .catch(err => {});
    // this.$nextTick(() => {
    //   setTimeout(() => {
    //     this.initScroll();
    //   },20)

    // });
  },
  methods: {
    //initScroll(){
    //$refs绑定元素
    //if (!this.scroll) {
    //this.scroll = new BScroll(this.$refs.wrapper, {
    //开启点击事件 默认为false
    //click: true,
    // taps: true
    //});
    // console.log(this.scroll)
    //} else if (!this.$refs.wrapper) {
    //this.scroll.refresh();

    //}
    //},
    specificationBtn(itemValue, thumbnail, index, n) {
      this.setThumbnailColorValue(itemValue, thumbnail, index, n);//点击 重置 商品规格的 值，按钮高亮，缩略图
      this.checkItem();//点击 重置 规格值 及下标
      this.checkMoney();//点击 刷新 相应规格 的 价格
    },
    setThumbnailColorValue(val,img,index,n){
      if (img != "") {
        this.thumbnail = img;
      }
      if (this.selectArr[index] != val) {
        this.selectArr[index] = val; //选中的值
        this.subIndex[index] = n;
      } else {
        //this.selectArr[index] = "";
        this.subIndex[index] = -1; //去掉选中的颜色
        return;
      }
    },
    checkItem() {
      for (let i in this.SpecificationList) {
        let str = this.selectArr[i]; //选中的规格
        //alert(str);
        for (let k in this.SpecificationList[i].specificationValues) {
          if (this.SpecificationList[i].specificationValues[k].name == str) {
            //alert(k);
            this.subIndex[i] = k; //点击获取 选中的 规格下标
          }
        }
      }
      this.$forceUpdate(); //重绘
    },
    getNowchoice() {//默认选中的 规格 及商品id，title
      //console.log(this.defaultSpecification)
      for (let i in this.defaultSpecification) {
        this.selectArr[i] = this.defaultSpecification[i].name;
      }
      let choiceStr = this.selectArr.join("-");
      this.productId = this.shopItemInfo[choiceStr].productId;
      this.title = this.detailAllData.fullName;
    },
    checkMoney() {
      Indicator.open();
      let choiceStr = this.selectArr.join("-");
      //alert(choiceStr)
      this.productId = this.shopItemInfo[choiceStr].productId;
      //console.log(Object.keys(this.shopItemInfo)[0] === choiceStr)
      setCookie('productId',this.productId,7);//cookie 存储商品id
      this.refreshPrice();
    },
    moreGroup() {
      this.tuanShow = true;
    },
    goBuy(val, type) {
      //单独开团 或 单买 入口
      this.price = val;
      this.dialog = true;
      this.buyType = type;
      this.refreshPrice();
      setCookie('buyType',this.buyType,7);//cookie 存储 团购或单买
    },
    goBuyList(val) {
      //参与拼团列表 购买入口
      if (this.groupEnd) {
        this.$toast("此商品拼团已结束");
        return false;
      }
      this.price = val;
      this.dialog = true;
      this.tuanShow = false;
    },
    refreshPrice() {
      if (this.buyType == "single") {
        setCookie('sum',1,7);
        updateSinglePrice({ id: this.productId })
          .then(res => {
            if (res.result === true) {
              //console.log(res);
              this.price = res.data.price;
              this.title = res.data.fullName;
              this.confirmSelect = true;
            } else if (res.result === false) {
              this.price = "缺货";
              this.confirmSelect = false;
            }
            Indicator.close();
          })
          .catch();
      } else {
        setCookie('sum',1,7);
        updateGroupPrice({ id: this.productId })
          .then(res => {
            if (res.result === true) {
              this.price = res.data.groupPrice;
              this.title = res.data.fullName;
              this.confirmSelect = true;
            } else if (res.result === false) {
              this.price = "缺货";
              this.confirmSelect = false;
            }
            Indicator.close();
          })
          .catch();
      }
    },
    increase() {
      ++this.snum;
      setCookie('sum',this.snum,7);//cookie 存储 购买的 商品数量
    },
    decrease() {
      if (this.snum > 1) {
        --this.snum;
        setCookie('sum',this.snum,7);//cookie 存储 购买的 商品数量
      }
    },
    closeDialog(val) {
      this.dialog = val;
      this.tuanShow = val;
    },
    toBuy() {
      //alert(this.productId);
      if(this.price == '缺货'){//防修改 按钮disabled属性
        this.$toast('此商品无货');
        return false;
      }
      if(this.token === null){
        this.$router.push({name:'phonelogin',params:{urlCode:'detail/'+this.sn}});
        return;
      }
      this.$router.push('/order');
      this.$store.commit("toggleDialog", false);
      
    },
    moreInfos(slideMore) {
      if (slideMore) this.slidetxt = "全部";
      else this.slidetxt = "收起";
      this.slideMore = !this.slideMore;
    },
    jumpUrl(url) {
      this.$router.push("/" + url);
    },
    preview(index) {
      //图片放大 预览
      //console.log(this.bannerImgList);
      this.$imagePreview({
        images: this.bannerImgList,
        index: index
      });
    },
    goComments(){
      this.$router.push({name:'totalComments',params:{goodsId:this.goodsId}});
    },
    collect() {
      collectProduct({ token: this.token, productId: this.detailAllData.id })
        .then(res => {
          //console.log(res);
          this.isCollect = !this.isCollect;
        })
        .catch();
    },
    countDownE_cb() {
      //倒计时结束回调
      this.groupEnd = true;
    }
  },
  watch: {
    // dialog: {
    //   handler(val, oldVal) {
    //     this.initScroll();
    //     if (val === true) {
    //       //this.initScroll();
    //       this.noScroll();
    //     } else {
    //       this.canScroll();
    //     }
    //     document.body.scrollTop = this.pageScrollYoffset;
    //     window.scroll(0, this.pageScrollYoffset);
    //   },
    //   deep: false
    // }
    dialog(val){
      if(val){
        this.isScroll = 'hidden';
        this.limitH = '100vh';
        this.pos = 'fixed';
      }else{
        this.isScroll = 'auto';
        this.limitH = 'auto';
        this.pos = 'initial';
      }
    }
  }
};
</script>
<style lang="less" scoped>
.swiper-slide {
  width: 80% !important;
  margin-right: 0.1rem;
}
.preload {
  width: 100%;
  height: 100vh;
  background: url(../assets/img/detail-preload.png) no-repeat;
  background-size: cover;
}
.banner {
  min-height: 4rem;
  .swiper-slide {
    width: 100% !important;
    margin-right: 0;
  }
}
.img-banner {
  text-align: center;
  background: #fff;
  width: 7.5rem;
  img {
    display: inline;
    max-width: 100%;
  }
}
.swiper-pagination-fraction {
  left: 75%;
  width: 10%;
  background: rgba(51, 51, 51, 0.5);
  color: #fff;
  border-radius: 10px;
  font-size: 10px;
  padding: 4px 0;
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
      }
      .countDown {
        overflow: hidden;
        font-size: 0.26rem;
        color: #f24848;
        i {
          float: left;
          padding-right: 0.05rem;
          color: #666;
        }
        div {
          float: left;
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
      &.btnDisabled {
        background: #999;
      }
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
  .lu {
    padding-left: 0.28rem;
  }
}
.item {
  width: 5.3rem;
  border: 1px solid #f0f0f0;
  .txt {
    padding: 0 0.2rem 0.15rem;
    line-height: 0.5rem;
    width: 3rem;
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
  z-index: 99;
  ul {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    li {
      text-align: center;
      font-size: 0.22rem;
      img {
        padding-top: 0.15rem;
        width: 0.36rem;
        height: 0.36rem;
        display: inline-block;
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
      //white-space: nowrap;
      text-overflow: ellipsis;
      width: 3.8rem;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
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
  height: 4rem;
  width: 90%;
  // position: absolute;
  //overflow: hidden;
  overflow: scroll;
  -webkit-overflow-scrolling: auto;
  // left: .3rem;
  // top: 2.3rem;
  ul {
    //min-height: 4.4rem;
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
          padding: 0 0.3rem;
          min-width: 1rem;
          height: 0.72rem;
          text-align: center;
          line-height: 0.72rem;
          border: 1px solid #f0f0f0;
          border-radius: 0.08rem;
          margin-right: 0.2rem;
          margin-bottom: 0.2rem;
          &.selectActive {
            background: #fff2f2;
            border: 1px solid #f24848;
          }
          &.forbidSelected {
            background-color: #ccc;
            opacity: 0.4;
            color: #000;
            pointer-events: none;
          }
        }
      }
    }
  }
}
.sum {
  color: #333;
  margin-top: 0.2rem;
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
    width: 95%;
    &.noBuy {
      background: #d8d8d8;
    }
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
      display: inline-block;
    }
  }
}
</style>
<style>
.swiper-pagination-bullet-active {
  background-color: #fff;
}
.mint-indicator {
  position: relative;
  z-index: 2006!important;
}
</style>





