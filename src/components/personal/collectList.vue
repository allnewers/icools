<template>
  <div>
    <div class="collectList">
      <ul>
        <li>
          <div class="img fl">
            <img src="../../assets/img/collect.jpg" alt>
          </div>
          <div class="txts fr">
            <h3>iPhone 7 Plus (A1661)[银色 256G 全网通4G]</h3>
            <p>
              ¥6000
              <span>已拼88件</span>
            </p>
            <div class="collect-btn" @click.native="collect">
              <img src="../../assets/img/like1@2x.png" alt>
            </div>
          </div>
        </li>
        <li>
          <div class="img fl">
            <img src="../../assets/img/collect.jpg" alt>
          </div>
          <div class="txts fr">
            <h3>iPhone 7 Plus (A1661)[银色 256G 全网通4G]</h3>
            <p>
              ¥6000
              <span>已拼88件</span>
            </p>
            <div class="collect-btn">
              <img src="../../assets/img/like1@2x.png" alt>
            </div>
          </div>
        </li>
        <li>
          <div class="img fl">
            <img src="../../assets/img/collect.jpg" alt>
          </div>
          <div class="txts fr">
            <h3>iPhone 7 Plus (A1661)[银色 256G 全网通4G]</h3>
            <p>
              ¥6000
              <span>已拼88件</span>
            </p>
            <div class="collect-btn">
              <img src="../../assets/img/like1@2x.png" alt>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: "collectList",
  data() {
    return {};
  }
};
</script>
<style lang="less" scoped>
.collectList {
  li {
    overflow: hidden;
    padding: 0.48rem 0.2rem;
    background: #fff;
    border-bottom: 1px solid #f0f0f0;
    .img {
      width: 1.97rem;
      max-height: 1.97rem;
      img {
        max-width: 100%;
      }
    }
    .txts {
      width: 70%;
      position: relative;
      h3 {
        font-size: 0.28rem;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
      p {
        margin-top: 0.6rem;
        font-size: 0.28rem;
        font-weight: bold;
        color: rgba(255, 55, 55, 1);
        span {
          font-size: 0.2rem;
          font-weight: 300;
          color: rgba(102, 102, 102, 1);
        }
      }
      .collect-btn {
        position: absolute;
        width: 0.36rem;
        height: 0.36rem;
        top: 1.1rem;
        right: 0.56rem;
        z-index: 3;
        padding: .2rem;
        img {
          width: 100%;
        }
      }
    }
  }
}
</style>
