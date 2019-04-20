<template>
  <div class="wrap">
    <div class="total clear">
      <div class="img fl">
        <img :src="imgBaseUrl + thumbnail" alt>
      </div>
      <div class="selects fl">
        <ul>
          <li
            :class="activeTotal == index?'onLight':''"
            @click="switches(index,item.value)"
            v-for="(item,index) in total"
            :key="item.id"
          >
            <p>{{item.title}}</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="commentTxts">
      <textarea v-model="word" maxlength="300" placeholder="商品物美价廉，购买体验很好~"></textarea>
      <div class="wordFlog">{{wordnum}} / 300</div>
    </div>
    <div class="upload">
      <div class="thumnails">
        <ul class="clear">
          <li v-for="(item ,index) in imgPath" :key="index"><img :src="item" alt=""><i @click="deleteImg(index)">x</i></li>
        </ul>
      </div>
      <div class="upload-btn">
        <img src="../../assets/img/camera.png" alt="">
        <p>{{imgPath.length}} / 4 </p>
        <input :type="inputType" accept="image/*" multiple="multiple" @change="commentsUpload(that)">
      </div>
    </div>
    <div class="serviceScore">
      <h3>服务评价</h3>
      <ul>
        <li>
          <p>商品评价</p>
          <Star class="stars" @getStarNum="commentLevel"/>
        </li>
        <li>
          <p>店家评价</p>
          <Star class="stars" @getStarNum="commentLevel1"/>
        </li>
        <li>
          <p>物流服务</p>
          <Star class="stars" @getStarNum="commentLevel2"/>
        </li>
      </ul>
    </div>

    <div class="submit" @click="submitComments([commentsCan,that])">提交</div>
  </div>
</template>
<script>
import Star from "../common/star";
import { imgBaseUrl, getCookie } from "../../util";
import { parse } from "querystring";
import { mapActions,mapState } from 'vuex'
import { Indicator } from 'mint-ui'
export default {
  name: "commentEdit",
  data() {
    return {
      that:this,
      imgBaseUrl,
      thumbnail: "",
      productStar: 5,
      shopStar: 5,
      shipStar: 5,
      total: [
        { id: "_01", isLight: true, value: 5, title: "好评" }, //好评度：1-差评；3-中评；5-好评
        { id: "_02", isLight: false, value: 3, title: "中评" },
        { id: "_03", isLight: false, value: 1, title: "差评" }
      ],
      activeTotal: 0,
      score: 5,
      word: "",
      token:'',
      orderSn:'',
      isAnonymous:false,//是否匿名
    };
  },
  components: {
    Star
  },
  computed: {
    ...mapState(['imgPath','inputType']),
    wordnum() {
      return this.word.length;
    },
    commentsCan(){
      return {
        token:this.token,
        sn:this.orderSn,
        productId:this.productId,
        score:this.score,
        depictScore:this.productStar,
        sellerScore:this.shopStar,
        shippingScore:this.shipStar,
        content:this.word,
        isAnonymous:this.isAnonymous
      }
    }
  },
  mounted() {
    let token = getCookie('token');
    let orderSn = this.$route.params.orderSn;
    let productId = this.$route.params.productId;
    let thumbnail = getCookie("thumbnail");
    this.token = token;
    this.thumbnail = thumbnail;
    this.productId = productId;
    this.orderSn = orderSn;
  },
  methods: {
    ...mapActions(['commentsUpload','submitComments','deleteImg']),
    switches(n, val) {
      this.activeTotal = n;
      this.score = val;
      console.log(this.score);
    },
    commentLevel(num) {
      this.productStar = parseInt(num) + 1;
    },
    commentLevel1(num) {
      this.shopStar = parseInt(num) + 1;
    },
    commentLevel2(num) {
      this.shipStar = parseInt(num) + 1;
    },
    submit() {
      console.log(this.productStar);
    }
    
  }
};
</script>
<style lang="less" scoped>
.wrap {
  height: 100vh;
  background: #f0f0f0;
}
.total {
  padding: 0.3rem 0 0.3rem 0.28rem;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
  .img {
    width: 1rem;
    height: 1rem;
    border: 1px solid #f0f0f0;
  }
  .selects {
    ul {
      overflow: hidden;
      padding-left: 1rem;
      li {
        float: left;
        width: 0.5rem;
        padding-top: 0.6rem;
        margin-right: 0.9rem;
        &:nth-child(1) {
          background: url("../../assets/img/grey1.png") no-repeat;
          background-size: 0.5rem;
        }
        &:nth-child(2) {
          background: url("../../assets/img/grey2.png") no-repeat;
          background-size: 0.5rem;
        }
        &:nth-child(3) {
          background: url("../../assets/img/grey3.png") no-repeat;
          background-size: 0.5rem;
        }
        &.onLight {
          p {
            color: #333;
          }
        }
        &.onLight:nth-child(1) {
          background: url("../../assets/img/light1.png") no-repeat;
          background-size: 0.5rem;
        }
        &.onLight:nth-child(2) {
          background: url("../../assets/img/light2.png") no-repeat;
          background-size: 0.5rem;
        }
        &.onLight:nth-child(3) {
          background: url("../../assets/img/light3.png") no-repeat;
          background-size: 0.5rem;
        }
        p {
          font-size: 0.22rem;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
        }
      }
    }
  }
}
.serviceScore {
  background: #fff;
  padding: 0.28rem;
  margin-top: 0.2rem;
  h3 {
    font-weight: 400;
    font-size: 0.3rem;
  }
  ul {
    margin-top: 0.2rem;
    li {
      overflow: hidden;
      padding: 0.3rem 0;
      p {
        font-size: 0.26rem;
        float: left;
        padding-right: 0.4rem;
      }
      .stars {
        float: left;
      }
    }
  }
}
.commentTxts {
  background: #fff;
  padding: 0.28rem 0 0 .28rem;
  textarea {
    width: 96%;
    min-height: 2rem;
    font-size: 0.3rem;
    color: #333;
    padding-right: .28rem;
    box-sizing: content-box;
    &::placeholder {
      color: #bdbdbd;
    }
  }
}
.submit {
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
.wordFlog{
  font-size: .24rem;
  color: #999;
  text-align: right;
  border-bottom: 1px solid #f0f0f0;
  padding: .1rem .28rem .1rem;
}
.upload{
  background: #fff;
  padding: .28rem;
  .thumnails{
    margin-bottom: 10px;
    ul{
      //height: 1.6rem;
      li{
        float: left;
        width: 1.6rem;
        height: 1.6rem;
        border: 1px solid #f0f0f0;
        margin-right: .12rem;
        position: relative;
        &:last-child{
          margin-right: 0;
        }
        i{
          width: 16px;
          height: 16px;
          background: #666;
          color: #fff;
          position: absolute;
          border-radius: 50%;
          top: -7px;
          right: -7px;
          font-size: .24rem;
          text-align: center;
          line-height: 15px;
        }
        img{
          max-width: 100%;
          height: 100%;
        }
      }
    }
  }
  .upload-btn{
    width: 1.6rem;
    height: 1.6rem;
    border: 1px dotted #f0f0f0;
    text-align: center;
    position: relative;
    img{
      width: .5rem;
      height: .44rem;
      padding: .43rem .55rem 0;
    }
    p{
      font-size:.2rem;
      font-weight:400;
      color:rgba(210,210,210,1);
    }
    input{
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
      z-index: 100;
      left: 0;
      top: 0;
    }
  }
}
</style>
