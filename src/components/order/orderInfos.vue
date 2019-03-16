<template>
  <div>
    <div class="orderproduct">
      <div class="product-top clear">
        <img class="fl" src alt>
        <div class="baseInfo fl">
          <h2>iPhone XS</h2>
          <div class="tuanNum">2人拼团价
            <span>¥2134</span>
          </div>
          <p class="singleprice">单买价 ¥3000</p>
        </div>
      </div>
    </div>
    <div class="share mt20">
      <h2>还差1人拼购成功，快来一起拼团吧</h2>
      <div class="time-down mt">剩余结束</div>
      <div class="avatar mt">
        <img src="../../assets/img/user@2x.png" alt>
        <img src="../../assets/img/default.png" alt>
      </div>
      <div class="shareOut mt">分享出去</div>
    </div>
    <div class="gamedetail mt20">
      <div class="top">
        拼购玩法
        <span class="more" @click="moreGroup">玩法详情</span>
      </div>
      <div class="des">
        <div class="div">①拼团/参团</div>
        <div class="div"><img src="../../assets/img/jian.png" alt=""></div>
        <div class="div">②分享好友</div>
        <div class="div"><img src="../../assets/img/jian.png" alt=""></div>
        <div class="div">③满员发货 <p>人数不满自动退款</p></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "orderinfos",
  data() {
    return {};
  },
  methods:{
    moreGroup(){
      this.$router.push('/game');
    }
  }
};
</script>
<style lang="less" scoped>
.mt {
  margin-top: 0.3rem;
}
.mt20{
  margin-top: 0.2rem;
}
.orderproduct {
  background: #fff;
  padding: 0.28rem;
}
.product-top {
  img {
    height: 1.5rem;
    width: 1.5rem;
    border: 1px solid #f0f0f0;
  }
  .baseInfo {
    margin-left: 0.3rem;
    line-height: 0.4rem;
    h2 {
      font-size: 0.28rem;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 3.4rem;
    }
    .tuanNum {
      font-size: 0.2rem;
      font-weight: 400;
      color: rgba(255, 55, 55, 1);
      margin-top: 0.3rem;
      span {
        font-size: 0.28rem;
        font-weight: 500;
        padding-left: 0.2rem;
      }
    }
    .singleprice {
      font-size: 0.2rem;
      font-weight: 400;
      text-decoration: line-through;
      color: rgba(102, 102, 102, 1);
    }
  }
}
.top {
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
.share {
  background: #fff;
  text-align: center;
  padding: 0.3rem;
  h2 {
    font-size: 0.26rem;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 0.5rem;
  }
  .time-down {
    font-size: 0.24rem;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
  }
  .avatar {
    img {
      display: inline;
      height: 0.82rem;
      width: 0.82rem;
      padding: 0 0.1rem;
    }
  }
  .shareOut {
    height: .8rem;
    text-align: center;
    line-height:.8rem;
    background: #FF3737;
    color: #fff;
    font-size: .28rem;
    width: 65%;
    margin: .3rem auto;
    border-radius: 4px;
  }
}
.gamedetail{
  background: #fff;
}
.des{
  display: flex;
  font-size:.24rem;
  font-weight:400;
  color:rgba(51,51,51,1);
  padding: .4rem 0;
  text-align: center;
  img{
    transform: scale(.5);
  }
  div:nth-child(1){
    flex: 2;
  }
  div:nth-child(2){
    flex:1;
  }
  div:nth-child(3){
    flex:2;
  }
  div:nth-child(4){
    flex:1;
  }
  div:nth-child(5){
    flex:2.5;
    p{
      font-size: .2rem;
      color: #666;
    }
  }
}
</style>


