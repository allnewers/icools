<template>
  <div class="wrap">
    <div class="header">
      <div class="user">
        <img src="../assets/img/avatar@2x.png" alt>
      </div>
      <div class="settings">
        <img src="../assets/img/set@2x.png" alt>
      </div>
    </div>
    <div class="orderRel cn">
      <div class="ma">
        <div class="top">
          我的订单
          <span class="more">查看全部</span>
        </div>
      </div>

      <ul>
        <li>
          <img src="../assets/img/topay@2x.png" alt>
          <p>待付款</p>
        </li>
        <li>
          <img src="../assets/img/share@2x.png" alt>
          <p>待分享</p>
        </li>
        <li>
          <img src="../assets/img/shouhuo@2x.png" alt>
          <p>待收货</p>
        </li>
        <li>
          <img src="../assets/img/comment@2x.png" alt>
          <p>待评价</p>
        </li>
      </ul>
    </div>
    <div class="myNotice cn">
      <div class="ma">
        <div class="top">我的消息</div>
      </div>
      <ul>
        <li>
          <img src="../assets/img/notice@2x.png" alt>
          <p>消息中心</p>
        </li>
        <li>
          <img src="../assets/img/fapiao@2x.png" alt>
          <p>发票管理</p>
        </li>
        <li>
          <img src="../assets/img/address@2x.png" alt>
          <p>收货地址</p>
        </li>
        <li>
          <img src="../assets/img/infos@2x.png" alt>
          <p>信息管理</p>
        </li>
        <li>
          <img src="../assets/img/reset@2x.png" alt>
          <p>重置密码</p>
        </li>
        <li>
          <img src="../assets/img/discount@2x.png" alt>
          <p>优惠券</p>
        </li>
        <li>
          <img src="../assets/img/collect@2x.png" alt>
          <p>商品收藏</p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: "myZone",
  data() {
    return {};
  }
};
</script>
<style lang="less" scoped>
.header {
  height: 2.64rem;
  background: url(../assets/img/bg@2x.png) no-repeat;
  background-size: cover;
  position: relative;
  .user {
    padding: 0.71rem 0.84rem;
    img {
      width: 1.2rem;
    }
  }
  .settings {
    position: absolute;
    top: 0.38rem;
    right: 0.38rem;
    width: 0.41rem;
    img {
      width: 100%;
    }
  }
}
.orderRel,
.myNotice {
  ul {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    padding: 0.3rem 0;
    li {
      flex: 25% 0 0;
      text-align: center;
      img {
        width: 0.44rem;
        height: 0.44rem;
        display: inline;
      }
      p {
        line-height: 0.5rem;
        font-size: 0.24rem;
        color: #333;
      }
    }
  }
}
.myNotice {
  ul {
    padding: 0.3rem 0 0;
    li {
      margin-bottom: 0.3rem;
    }
  }
}
.cn {
  margin: 0.2rem auto 0;
  background: #fff;
  //border-radius: 4px;
}
.ma {
  padding-left: 0.28rem;
}
.top {
  height: 0.9rem;
  line-height: 0.9rem;
  font-size: 0.26rem;
  font-weight: 400;
  color: #666;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 0.28rem 0 0;
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
</style>
