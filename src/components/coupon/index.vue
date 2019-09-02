<template>
  <div v-if="allshow">
    <div class="subnavs">
      <ul>
        <li
          @click="tab(index)"
          :class="{active:isActive == index}"
          v-for="(item,index) in navList"
          :key="item"
        >{{item}}</li>
      </ul>
    </div>
    <div class="couponList">
      <div class="list-top">
        <div class="topItem">兑换商品类型</div>
        <div class="topItem">可用数量</div>
        <div class="topItem">已兑换数量</div>
        <div class="topItem">状态</div>
        <div class="topItem">面值</div>
      </div>
      <div class="content" v-if="list.length>0">
        <ul>
          <li v-for="(item,index) in list" :key="index">
            <div class="top clear">
              <p class="fl">{{item.startTime}} 订单号：{{item.orderSn}}</p>
              <p class="fr">{{productsMap[item.productId]['fullName']}}</p>
            </div>
            <div class="txts">
              <div class="txt-wrap">
                <div class="item clear">
                  <img class="fl" :src="'http://eicools.oss-cn-beijing.aliyuncs.com/' + productsMap[item.productId]['image']" alt="">
                  <p class="fr">{{productsMap[item.productId]['productCategoryName']}}</p>
                </div>
                <div class="item">{{item.total}}</div>
                <div class="item">{{item.used}}</div>
                <div class="item">{{item.state===1?'可用':'不可用'}}</div>
                <div class="item">￥{{item.minMoney}} - {{item.maxMoney }}</div>
              </div>
              <div class="time">有效期:{{item.startTime}}-{{item.endTime}}</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="noData" v-if="nodata">暂无优惠券</div>
    </div>
  </div>
</template>
<script>
import { sendWeixinCode, getCouponList } from "../../api";
import { isWeixin, weixinAuth } from "../../util";
import { Indicator } from "mint-ui";
export default {
  name: "coupon",
  data() {
    return {
      allshow: false,
      userId: "",
      isActive: 0,
      list: [],
      productsMap:{},
      type: 0,
      nodata:false,
      navList: ["所有兑换券", "待使用", "已使用"]
    };
  },
  created() {
    let isweixin = isWeixin();
    let weixinCode = this.$route.query.code;
    let userId = this.$route.query.userId;
    if(userId){
      this.userId = userId.toString();
      this.firstPage();
    }
    if (isweixin && weixinCode === undefined && userId === undefined) {
      //微信浏览器 ,微信未授权获取code之前
      //console.log('coming...');
      weixinAuth(); //微信授权，获取code
      return false;
    }
    if (weixinCode !== undefined) {
      //微信授权完成，调回此页面获取到code码，发送给后台保存
      //alert(weixinCode);
      sendWeixinCode({
        code: weixinCode
      })
        .then(res => {
          //this.sellerNum = res;
          console.log('sendCodeRes---',res);
          if (
            res.data.mobile == null ||
            res.data.mobile == "" ||
            res.data.mobile == undefined
          ) {
            //alert(JSON.stringify(res));
            this.$router.replace({path:"/combine",query:{id:res.data.id}});
          } else {
            this.userId = res.data.id + "";
            this.firstPage();
          }
          //alert(res);
        })
        .catch(err => {});
    }
  },
  methods: {
    tab(n) {
      if(this.isActive == n) return;
      let searchType = [0, 1, 2]; //0:全部。1：未使用。2：已使用
      this.noData = false;
      this.list = [];
      this.isActive = n;
      this.type = searchType[n];
      //Indicator.open();
      this.firstPage();
    },
    firstPage() {
      Indicator.open();
      getCouponList({
        activityId: 10000000,
        current: 1,
        size: 1000,
        state: this.type,
        userId: this.userId
      })
        .then(res => {
          this.allshow = true;
          Indicator.close();
          if(res.pageDataDetail){
            this.list = res.pageDataDetail.records;
          }else{
            this.nodata = true;
            return;
          }
          this.productsMap = res.productsMap;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang="less" scoped>
.subnavs {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 0.96rem;
  background: #fff;
  //box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.14);
  z-index: 100;
  ul {
    display: flex;
    li {
      flex: 1;
      height: 0.92rem;
      line-height: 0.92rem;
      text-align: center;
      font-size: 0.28rem;
      color: #666;
      &.active {
        color: #239e58;
        //border-bottom: 2px solid #333;
      }
    }
  }
}
.couponList{
  margin-top: 1rem;
  .list-top{
    height: .7rem;
    line-height: .7rem;
    display: flex;
    background: #eee;
    
    .topItem{
      flex: 1 0 0;
      text-align: center;
      font-size: .24rem;
      color: #333;
      &:first-child{
        flex:1.5 0 0;
      }
    }
  }
  .noData{
    text-align: center;
    color: #666;
    line-height: 4rem;
  }
  .content{
    background: #fff;
    padding: .2rem .1rem;
    li{
      border: 1px solid #239e58;
      margin-bottom: .2rem;
      .top{
        padding: 0 .2rem;
        background: #239e58;
        color: #fff;
        font-size: .2rem;
        height: .5rem;
        line-height: .5rem;
      }
      .txts{
        padding: .2rem .1rem .1rem;
        font-size: .2rem;
        color: #333;
        .txt-wrap{
          display: flex;
          .item{
            flex: 1;
            text-align: center;
            line-height: .6rem;
            img{
              width: .6rem;
              height: .6rem;
            }
            &:first-child{
              flex: 2rem 0 0;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              p{
                width: 1.4rem;
              }
            }
          }
        }
        .time{
          text-align: right;
          line-height: .6rem;
        }
      }
    }
  }
}
</style>
