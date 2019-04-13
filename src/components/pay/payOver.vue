<template>
  <div>
    <div class="payState clear">
      <div class="gouIcon fl"><img src="../../assets/img/gou.png" alt=""></div>
      <div class="txts fl">
        <h2>支付成功!</h2>
        <p>感谢您的购买，祝您生活愉快！</p>
      </div>
    </div>
    <div class="share mt20">
      <h2>还差1人拼购成功，快来一起拼团吧</h2>
      <div class="time-down mt">剩余结束</div>
      <div class="avatar mt">
        <span class="tuanz">
          <img class="main" src="../../assets/img/user@2x.png" alt>
        </span>
        <span>
          <img src="../../assets/img/default.png" alt>
        </span>
        
      </div>
      <div class="shareOut mt">分享出去</div>
    </div>
    <div class="urlto">
      <button>查看订单</button>
      <button>返回首页</button>
    </div>
  </div>
</template>
<script>
export default {
  name:"payOver",
  data(){
    return {
    }
  }
}
</script>
<style lang="less" scoped>
.mt {
  margin-top: 0.3rem;
}
.mt20{
  margin-top: 0.2rem;
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
    .tuanz{
      position: relative;
      &::before{
      content: '团长';
        height: .3rem;
        width: .6rem;
        border-radius: .15rem;
        background: #FF3737;
        position: absolute;
        border-bottom: 0;
        left: .2rem;
        bottom: -.1rem;
        z-index: 100;
        font-size: .12rem;
        text-align: center;
        line-height: .32rem;
        color: #fff;
    }
    }
    
    img {
      display: inline;
      height: 0.82rem;
      width: 0.82rem;
      padding: 0 0.1rem;
      position: relative;
     
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
.payState{
  padding: .46rem  0 .46rem 1.86rem;
  background: #F9FAF9;
  .txts{
    margin-left: .1rem;
    h2{
      font-size: .3rem;
      color: #333;
      font-weight: bold;
    }
    p{
      font-size: .2rem;
      color: #333;
    }
  }
  .gouIcon{
    width: .6rem;
    height: .6rem;
    border-radius: 50%;
    background: #00BE12;
    text-align: center;
    margin-top: .05rem;
    img{
      width: .42rem;
      display: inline;
      padding-top: .16rem;
    }
  }
}
.urlto{
  display: flex;
  justify-content: space-around;
  margin-top: .4rem;
  button{
    width: 2.7rem;
    height: .77rem;
    border: 1px solid #666;
    text-align: center;
    line-height: .77rem;
    font-size: .3rem;
    color: #333;
    border-radius: 4px;
  }
}
</style>
