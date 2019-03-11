<template>
  <div>
    <div class="brief">
      <ul>
        <li
          v-for="(item,index) in tabBar"
          :class="{active:isActive == index}"
          @click="tab(index)"
          :key="index+Math.random()"
        >{{item}}</li>
      </ul>
    </div>
    <div class="comments-list">
      <ul>
        <li>
          <div class="user">
            <img src="../assets/img/user@2x.png" alt>
            <p>邻家小妹</p>
          </div>
          <p class="content">第一次在爱酷士上买东西 真是超值，喝点酒撒谎喝点酒撒谎喝点酒撒谎</p>
          <div class="timeType">
            <span>2018-02-02</span> <span>金色 16GB+32GB</span>
          </div>
          <div class="uploadImg">
            <div class="img-item">
              <img src="../assets/img/prod@2x.png" alt="">
            </div>
            <div class="img-item">
              <img src="../assets/img/prod@2x.png" alt="">
            </div>
            <div class="img-item">
              <img src="../assets/img/prod@2x.png" alt="">
            </div>
            <div class="img-item">
              <img src="../assets/img/prod@2x.png" alt="">
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: "comments",
  data() {
    return {
      tabBar: [
        "全部(999)",
        "有图(9)",
        "追加(999)",
        "物流很快(9)",
        "是正品(999)"
      ],
      isActive: "0"
    };
  },
  methods: {
    tab(index) {
      this.isActive = index;
    }
  }
};
</script>
<style lang="less" scoped>
.brief {
  padding: 0.3rem 0.28rem 0;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  ul {
    overflow: hidden;
    li {
      float: left;
      height: 0.6rem;
      border-radius: 0.3rem;
      padding: 0 0.23rem;
      border: 1px solid #f0f0f0;
      color: #666;
      text-align: center;
      line-height: 0.6rem;
      margin: 0 0.5rem 0.2rem 0;
      font-size: 0.26rem;
      &.active {
        background: #333;
        color: #fff;
      }
    }
  }
}
.comments-list {
  background: #fff;
  padding: 0 .28rem .3rem;
  li{
    border-bottom: 1px solid #f0f0f0;
  }
  .user {
    line-height: 0.9rem;
    display: flex;
    padding: .3rem 0;
    img {
      height: 0.9rem;
      width: 0.9rem;
      border-radius: 50%;
    }
    p {
      padding-left: 0.2rem;
      font-size: .3rem;
      font-weight: 400;
      width: 2rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  p.content{
    font-size:.3rem;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height: .5rem;
  }
  .timeType{
    span{
      font-size:.24rem;
      font-weight:400;
      color:rgba(153,153,153,1)
    }
  }
  .uploadImg{
    overflow: hidden;
    margin-top: .2rem;
    padding-bottom: .2rem;
    .img-item{
      height: 2.2rem;
      width: 2.2rem;
      float: left;
      margin-right: .1rem;
      margin-bottom: .1rem;
    }
  }
}
</style>


