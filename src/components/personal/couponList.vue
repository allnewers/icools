<template>
  <div>
    <div class="tabar">
      <ul>
        <li
          v-for="(item,index) in tabBar"
          :class="{active:isActive == index}"
          @click="tab(index)"
          :key="index"
        >
          {{item}}
          <i v-show="isActive == index"></i>
        </li>
      </ul>
    </div>
    <div class="tickets">
      <ul>
        <li v-for="(item,index) in couponList" :key="item.id">
          <div class="txt">
            <h4>{{item.couponObj.name}}</h4>
            <p v-if="item.couponObj.endDate">{{item.couponObj.beginDate | time}} 至 {{item.couponObj.endDate | time}}</p>
            <p v-if="!item.couponObj.endDate">永久可用</p>
          </div>
          <div class="limit" :class="{grey:noUse}">
            <span v-if="item.couponObj.note>1">¥{{item.couponObj.note}}</span>
            <span v-else>{{(item.couponObj.note)*10}}折</span>
          </div>
        </li>
      </ul>
      <div class="noData" v-if="showNoData">
          <img src="../../assets/img/noData.png" alt="">
          <span>暂无优惠券</span>
        </div>
    </div>
  </div>
</template>
<script>
import { getAllCoupon } from '../../api'
import { Indicator } from "mint-ui";
import { getCookie } from "../../util";
export default {
  name: "couponList",
  data() {
    return {
      
      isActive: 0,
      noUse:false,
      token:'',
      couponList:[],
      showNoData:false,
      used:0,
      failure:0
    };
  },
  computed:{
    tabBar(){
      return ["未使用（"+this.used+"）", "已过期（"+this.failure+"）"]
    }
  },
  mounted(){
    let token = getCookie("token");
    this.token = token;
    
    this.getCoupon(0);//0:未使用; 1:已使用; 2:已过期;
  },
  methods: {
    tab(index) {
      if(this.isActive == index) return;
      this.isActive = index;
      this.couponList = [];
      this.showNoData = false;
      if (index == "1") {
        this.noUse = true;
        this.getCoupon(2);
      } else {
        this.noUse = false;
        this.getCoupon(0);
      }
    },
    getCoupon(type){
      Indicator.open();
      getAllCoupon({
        token:this.token,
        couponStatus:type
      }).then(res=>{
        Indicator.close();
        console.log(res);
        if(res.result === true){
          this.couponList = res.data.list;
          let len = this.couponList.length;
          if(type == 0){
            this.used = len;
          }else if(type == 2){
            this.failure = len;
          }
          
          if(len == 0){
            this.showNoData = true;
          }
        }else{
          console.log(res.msg);
        }
      }).catch(err=>{
        alert(err);
      });
    }
  },
  filters:{
    time(val){
      return val.substr(0,10);
    }
  }
};
</script>
<style lang="less" scoped>
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
      background:#fff;
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
        &.grey {
          background: #dbdbdb;
        }
      }
    }
  }
}
</style>
