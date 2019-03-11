<template>
  <div>
    <div class="address">
      <!-- <div class="newIncrease"></div> -->
      <div class="defaults">
        <div class="userPhone clear">
          <p class="fl">王小二</p>
          <p class="fl">13222223333</p>
        </div>
        <div class="address-i">北京西城区内环到二环里西城区阜外大街甲9号国宾酒店打 一层GBC-15区域</div>
      </div>
    </div>
    <div class="border-cai">
      <img src="../assets/img/cai@2x.png" alt>
    </div>
    <div class="goodsBill">
      <h3>商品清单</h3>
      <div class="goods">
        <div class="tops clear">
          <div class="img fl">
            <img src="../assets/img/phone@2x.png" alt>
          </div>
          <div class="txt fl">
            <p>小米6全网通 亮黑色 6GB+64GB</p>
            <p>
              <span>¥250</span>
              ×{{snum}}
            </p>
          </div>
        </div>
        <ul>
          <li>
            <span>支付配送</span>
            <span>爱酷士配送</span>
          </li>
          <li>
            <span>送货时间</span>
            <span>2017-07-01 星期六 17:00-1900</span>
          </li>
          <li>
            <span>发票</span>
            <span>不开发票</span>
          </li>
          <li @click="discount">
            <span>优惠券</span>
            <span>暂无可用</span>
          </li>
          <li>
            <span>商品金额</span>
            <span class="red">¥6000</span>
          </li>
          <li>
            <span>数量</span>
            <div class="compute fr">
              <button class="fl" @click="decrease">-</button>
              <input class="fl" type="text" v-model="snum" readonly onfocus="this.blur();">
              <button class="fl" @click="increase">+</button>
            </div>
          </li>
          <li>
            <span>运费</span>
            <span class="red">¥0</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="blank"></div>
    <div class="submitOrder">
      <div class="summary">
        共
        <span>{{snum}}</span>件，合计：
        <i>¥6000</i>
      </div>
      <div class="submit" @click="submitOrder">提交订单</div>
    </div>
    <transition name="slideUp">
      <div class="selectC yheight" v-show="dialog">
        <Selects @closeD="closeDialog">
          <h3>优惠券</h3>
          <div class="tabar">
            <ul>
              <li
                v-for="(item,index) in tabBar"
                :class="{active:isActive == index}"
                @click="tab(index)"
                :key="index+Math.random()"
              >
                {{item}}
                <i v-show="isActive == index"></i>
              </li>
            </ul>
          </div>
          <div class="tickets">
            <ul>
              <li>
                <div class="txt">
                  <h4>满500减30</h4>
                  <p>2018.01.01-2018.03.03</p>
                </div>
                <div class="limit" :class="{grey:noUse}">
                  ¥
                  <span>30</span>
                </div>
              </li>
            </ul>
          </div>
        </Selects>
      </div>
    </transition>
    <!-- <transition name="slideUp">
      <div class="selectC yheight" v-show="dialog">
        <Selects>
          222
        </Selects>
      </div>
    </transition>-->
  </div>
</template>
<script>
export default {
  name: "order",
  data() {
    return {
      snum: 1,
      dialog: false,
      tabBar: ["可用优惠券（1）", "不可用优惠券（2）"],
      isActive: "0",
      noUse:false
    };
  },
  methods: {
    submitOrder() {
      this.$router.push("/payType");
    },
    increase() {
      ++this.snum;
    },
    decrease() {
      if (this.snum > 1) {
        --this.snum;
      }
    },
    discount() {
      this.dialog = true;
    },
    closeDialog(val) {
      this.dialog = val;
    },
    tab(index) {
      this.isActive = index;
      if(index == '1'){
        this.noUse = true
      }else{
        this.noUse = false
      } 
    }
  }
};
</script>
<style lang="less" scoped>
.address {
  padding: 0.1rem 0.28rem 0.28rem;
  position: relative;
  background: #fff url("../assets/img/address.png") no-repeat 0.28rem center;
  background-size: 22px 23px;
}
.defaults {
  background: url("../assets/img/right.png") no-repeat 6.6rem center;
  background-size: 24px 28px;
  padding-left: 0.62rem;
  color: rgba(51, 51, 51, 1);
  .userPhone {
    font-size: 0.3rem;
    font-weight: 400;
    line-height: 0.8rem;
    p {
      margin-right: 0.5rem;
    }
  }
  .address-i {
    font-size: 0.24rem;
    font-weight: 300;
    line-height: 0.4rem;
    width: 95%;
  }
}
.border-cai {
  background: #fff;
}
.compute {
  margin-top: 0.15rem;
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
.goodsBill {
  background: #fff;
  h3 {
    height: 0.9rem;
    line-height: 0.9rem;
    font-size: 0.28rem;
    padding-left: 0.3rem;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
  }
}
.goods {
  .tops {
    background: #f9f9f9;
    padding: 0.35rem;
    .img {
      width: 1rem;
      text-align: center;
      margin-right: 0.3rem;
      img {
        width: 0.76rem;
        display: inline;
      }
    }
    .txt {
      p {
        font-size: 0.26rem;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        &:last-child {
          margin-top: 0.2rem;
          font-size: 0.2rem;
          span {
            font-size: 0.26rem;
            color: #f24848;
          }
        }
      }
    }
  }
  ul {
    padding-left: 0.28rem;
  }
  li {
    height: 0.9rem;
    line-height: 0.9rem;
    padding-right: 0.28rem;
    border-bottom: 1px solid #f0f0f0;
    font-weight: 300;
    &:nth-child(2),
    &:nth-child(3),
    &:nth-child(4) {
      padding-right: 0.5rem;
      background: url("../assets/img/right.png") no-repeat 98.5% center;
      background-size: 20px 24px;
    }
    span {
      float: left;
      font-size: 0.3rem;
      color: #333;
      &.red {
        color: #f24848;
      }
      &:last-child {
        float: right;
      }
    }
  }
}
.submitOrder {
  height: 1rem;
  line-height: 1rem;
  background: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  text-align: center;
  border-top: 1px solid #f0f0f0;
  .summary {
    flex: 4;
    span,
    i {
      color: #f24848;
    }
    span {
      padding: 0 0.1rem;
    }
    i {
      font-size: 0.34rem;
    }
  }
  .submit {
    flex: 2;
    background: #f24848;
    color: #fff;
  }
}
.blank {
  margin-top: 0.2rem;
  height: 1rem;
}
.yheight {
  height: 50%;
  h3 {
    font-size: 0.3rem;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    padding: 0.57rem 0 0.2rem;
    text-align: center;
  }
}
.tabar {
  ul {
    display: flex;
    justify-content: space-around;
    background: #fff;
    height: 0.86rem;
    line-height: 0.86rem;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    margin-bottom: 0.05rem;
    border-bottom: 1px solid #f0f0f0;
    li {
      flex: 1;
      text-align: center;
      font-size: 0.28rem;
      color: rgba(153, 153, 153, 1);
      position: relative;
      &.active {
        font-family: MicrosoftYaHei;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
      }
      i {
        height: 1px;
        width: 2.3rem;
        background: #f24848;
        display: block;
        bottom: 0;
        left: 0.68rem;
        position: absolute;
      }
    }
  }
}
.tickets {
  ul {
    padding: 0.28rem;
    li {
      display: flex;
      height: 1rem;
      border-radius: 4px;
      border: 1px solid #f0f0f0;
      margin-bottom: 0.3rem;

      color: rgba(51, 51, 51, 1);
      .txt {
        flex: 3;
        font-size: 0.28rem;
        line-height: 0.4rem;
        padding-left: 0.28rem;
        padding-top: 0.1rem;
        h4 {
          font-weight: 400;
        }
        p {
          font-size: 0.2rem;
        }
      }
      .limit {
        flex: 1;
        background: #f24848;
        line-height: 1rem;
        text-align: center;
        color: #fff;
        border-radius: 0 4px 4px 0;
        &.grey{
          background: #DBDBDB;
        }
      }
    }
  }
}
</style>


