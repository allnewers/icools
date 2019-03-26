<template>
  <div>
    <div class="invoiceList" v-if="list.length>0">
      <ul>
        <li class="clear" v-for="(item,index) in list" :key="item.id">
          <div class="left fl" @click="selectInvoice(index,item.id)">
            <h3>{{item.title}}</h3>
            <p>
              <i v-if="item.type === 1">身份证号</i>
              <i v-if="item.type === 2">税号</i>
              <span></span>
              {{item.identifyNumber}}
            </p>
          </div>
          <div class="right fr">
            <p @click="delInvoice(item.id)">
              <img src="../../assets/img/del@2x.png" alt>
            </p>
          </div>
        </li>
        <div class="add" @click="goAdd">+添加</div>
      </ul>
    </div>
    <div class="noData" v-show="showNoData">
      <img src="../../assets/img/noData.png" alt>
      <span>您还没有发票抬头</span>
      <div class="add" @click="goAdd">+添加</div>
    </div>
    <div class="alerts"></div>
  </div>
</template>
<script>
import { getCookie } from "../../util";
import { InvoiceTitleList, deleteInvoice } from "../../api";
import { Indicator } from "mint-ui";
import { setTimeout } from "timers";
import { MessageBox } from "mint-ui";
export default {
  name: "invoiceList",
  data() {
    return {
      list: [],
      showNoData: false,
      Loop: "",
      origin: "",
      id: "",
      idIndex: {}
    };
  },
  mounted() {
    let token = getCookie("token");
    let origin = this.$route.params.origin;
    this.origin = origin;
    this.token = token;

    Indicator.open();
    InvoiceTitleList({
      token: this.token
    })
      .then(res => {
        console.log(res);
        Indicator.close();
        if (res.result === true) {
          this.list = res.data;
          if (res.data.length == 0) {
            this.showNoData = true;
          }
          this.idIndex = this.getIndex();
        } else {
          console.log(res.msg);
        }
      })
      .catch();
  },
  methods: {
    selectInvoice(index, id) {
      this.id = id;
      if (this.origin == "order") {
        this.$store.commit("changeInvoiceTitle", index);
        this.$router.go(-1);
      } else {
        this.$router.push({ name: "invoiceDetail", params: { id: this.id } });
      }
    },
    goAdd() {
      this.$router.push("/invoiceTitle");
    },
    delInvoice(id) {
      MessageBox.confirm("确定删除?", "温馨提示")
        .then(res => {
          Indicator.open();
          deleteInvoice({
            ids: id,
            token: this.token
          })
            .then(res => {
              Indicator.close();
              //console.log(res);
              if (res.result === true) {
                this.list.splice(this.idIndex[id], 1); //ui 删除
                this.$toast("删除成功");
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {});
    },
    getIndex() {
      let arr = this.list;
      let need = {};
      arr.forEach((element, index) => {
        need[element.id] = index;
      });
      return need;
    }
  }
};
</script>
<style lang="less" scoped>
.invoiceList {
  padding: 0.28rem;
  ul {
    li {
      height: 1.8rem;
      background: url("../../assets/img/invoice-bg.png") no-repeat;
      background-size: cover;
      line-height: 0.9rem;
      text-indent: 0.3rem;
      color: #333;
      margin-bottom: 0.2rem;
      .left {
        width: 90%;
      }
      .right {
        width: 10%;
        height: 100%;
        p {
          width: 100%;
          height: 50%;
          overflow: hidden;
          img {
            width: 0.3rem;
            height: 0.3rem;
            display: block;
            margin: 0.3rem auto 0;
          }
        }
      }
      h3 {
        font-size: 0.3rem;
        font-weight: 400;
      }
      p {
        font-size: 0.26rem;
        color: #999;
        span {
          padding: 0 0.2rem;
        }
      }
    }
  }
}
.add {
  height: 0.9rem;
  line-height: 0.9rem;
  color: #fff;
  font-size: 0.3rem;
  text-align: center;
  background: #333;
  width: 80%;
  margin: 0.3rem auto;
}
</style>
