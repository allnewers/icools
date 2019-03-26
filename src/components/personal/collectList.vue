<template>
  <div>
    <div class="collectList">
      <ul v-if="collectList.length>0">
        <li v-for="(item,index) in collectList" :key="item.id">
          <div @click="goDetail(item.sn)">
            <div class="img fl">
              <img v-lazy="imgBaseUrl+item.imag" alt>
            </div>
            <div class="txts fr">
              <h3>{{item.name}}</h3>
              <p>
                ¥{{item.groupPrice}}
                <span>已拼{{item.groupNum}}件</span>
              </p>
            </div>
          </div>

          <div class="collect-btn" @click="collect(item.id)">
            <!-- <img  src="../../assets/img/like@2x.png" alt> -->
            <img src="../../assets/img/like1@2x.png" alt>
          </div>
        </li>
      </ul>
      <div class="noData" v-show="showNoData">
          <img src="../../assets/img/noData.png" alt="">
          <span>暂无数据</span>
        </div>
    </div>
  </div>
</template>
<script>
import { collectList ,collectProduct } from "../../api";
import { getCookie } from "../../util";
import { imgBaseUrl } from "../../util";
import { Indicator } from "mint-ui";
import { setTimeout } from 'timers';
export default {
  name: "collectList",
  data() {
    return {
      currentPage: 1,
      token: "",
      collectList: [],
      imgBaseUrl: imgBaseUrl,
      showNoData:false,
    };
  },
  mounted() {
    let token = getCookie("token");
    this.token = token;
    this.firstPage();
  },
  methods: {
    firstPage() {
      Indicator.open();
      collectList({
        token: this.token,
        pageNum: this.currentPage
      })
        .then(res => {
          console.log(res);
          Indicator.close();
          if (res.result === true) {
            this.collectList = res.data.list;
            if(this.collectList.length == 0){
              this.showNoData = true;
            }
          } else {
            console.log(res.msg);
          }
        })
        .catch(err => {});
    },
    collect(id) {
      Indicator.open();
      collectProduct({ token: this.token, productId:id  })
        .then(res => {
          Indicator.close();
          console.log(res);
          if(res.result === true){
            this.$toast({message:res.msg,duration:1000});
            setTimeout(()=>{
              location.reload();
            },1000);
          }
        })
        .catch(err=>{
          console.log(err);
        });
    },
    goDetail(sn) {
      this.$router.push({ name: "detail", params: { sn: sn } });
    }
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
    position: relative;
    .img {
      width: 1.97rem;
      max-height: 1.97rem;

      img {
        max-width: 100%;
        max-height: 1.97rem;
      }
    }
    .collect-btn {
      position: absolute;
      width: 0.36rem;
      height: 0.36rem;
      bottom: 0.6rem;
      right: 0.56rem;
      z-index: 3;
      padding: 0.2rem;
      z-index: 100;
      img {
        width: 100%;
      }
    }
    .txts {
      width: 70%;
      h3 {
        font-size: 0.28rem;
        font-weight: 400;
        min-height: 0.7rem;
        color: rgba(51, 51, 51, 1);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
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
    }
  }
}
</style>
