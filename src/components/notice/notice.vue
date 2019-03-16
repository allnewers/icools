<template>
  <div class="wrap">
    <div class="notice">
      <ul>
        <li class="clear" @click="goInfoList(item.type)" v-for="(item,index) in messageList" :key="index">
          <div class="icon fl">
            <img v-if="item.type === 2" :src="require('../../assets/img/n3@2x.png')" alt>
            <img v-if="item.type === 6" :src="require('../../assets/img/n2@2x.png')" alt>
            <img v-if="item.type === 5" :src="require('../../assets/img/n1@2x.png')" alt>
            <div class="icon_num" v-if="item.total>=1">{{item.total}}</div>
          </div>
          <div class="txts fl">
            <h3>{{item.typeName}}</h3>
            <p class="nowrap" v-if="item.lastMessage">{{item.lastMessage}}</p>
            <p class="nowrap" v-else>暂无信息</p>
          </div>
          <div class="time">{{item.lastDateTime | time}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import {getNoticeList} from '../../api'
import { getCookie } from "../../util";
import imgN1 from '../../assets/img/n1@2x.png'
import imgN2 from '../../assets/img/n2@2x.png'
import imgN3 from '../../assets/img/n3@2x.png'
import { setTimeout } from 'timers';
export default {
  name: "notice",
  data() {
    return {
      messageList:[],
      imgPath:''
    };
  },
  mounted(){
    let token = getCookie("token");
    getNoticeList({'token':token}).then(res=>{
      if(res.result===true){
        this.messageList = res.data;
      }else{
        this.$toast(res.msg);
        setTimeout(()=>{
          this.$router.push({ name: "phonelogin", params: { urlCode: 'notice' } });
        },2000)
      }
    }).catch(err=>{

    });
  },
  methods:{
    goInfoList(type){ 
      this.$router.push({name:'messages',params:{'type':type}});   
    }
  },
  filters:{
    time(val){
      return val.slice(0,10);
    }
  }
};
</script>
<style lang="less" scoped>
.notice {
  background: #fff;
  ul {
    padding: 0 0.28rem;
    li {
      padding: 0.38rem 0;
      border-bottom: 1px solid #f0f0f0;
      position: relative;
      .icon {
        width: 0.7rem;
        height: 0.7rem;
        margin-right: .3rem;
        position: relative;
        img {
          max-width: 100%;
        }
        .icon_num{
          width: .36rem;
          height: .36rem;
          border-radius: 50%;
          border: 1px solid #fff;
          text-align: center;
          line-height: .36rem;
          color: #fff;
          font-size: .18rem;
          background: #F24848;
          position: absolute;
          top: -.15rem;
          right: -.18rem;
        }
      }
      .txts {
        width: 85%;
        h3 {
          font-size: 0.3rem;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
        }
        p {
          font-size: 0.24rem;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          line-height: .5rem;
        }
      }
      .time{
        position: absolute;
        top: .4rem;
        right: .28rem;
        font-size:.22rem;
        font-weight:400;
        color:rgba(153,153,153,1);
      }

    }
  }
}
</style>
