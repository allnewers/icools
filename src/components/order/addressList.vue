<template>
  <div>
    <div class="addressList" v-if="isShow">
      <div class="item-list" v-for="(item,index) in addressList" :key="item.id">
        <div class="txts" @click="switchAddress(index)">
          <div class="userPhone clear">
            <p class="fl">{{item.consignee}}</p>
            <p class="fl">{{item.phone}}</p>
          </div>
          <div class="address-i">{{item.areaName + item.address}}</div>
        </div>
        <div class="border"></div>
        <div class="edit">
          <div class="moren" @click="tab(index,item)">
            <div class="circle" :class="n == index ?'select':''"></div>
            <p>默认地址</p>
          </div>
          <div class="pen" @click="edits(item)">
            <div class="img">
              <img src="../../assets/img/pen@2x.png" alt>
            </div>
            <p>编辑</p>
          </div>
          <div class="del" @click="dels(item.id)">
            <div class="img">
              <img src="../../assets/img/del@2x.png" alt>
            </div>
            <p>删除</p>
          </div>
        </div>
      </div>
    </div>
    <div class="noAddress" v-if="showno">
      <img src="../../assets/img/noAddress@2x.png" alt="">
      <p>您还没有收货地址哦~</p>
    </div>
    <div class="add" @click="goAdd">新增收货地址</div>
  </div>
</template>
<script>
import { getCookie } from "../../util";
import { receiveAddress, updateAddress, deleteAddress } from "../../api";
import { Indicator } from "mint-ui";
import { MessageBox } from "mint-ui";
import { setTimeout } from "timers";
export default {
  name: "addressList",
  data() {
    return {
      token: "",
      addressList: [],
      n: 0,
      isShow:false,
      showno:false
    };
  },
  mounted() {
    let token = getCookie("token");
    this.token = token;
    Indicator.open();
    receiveAddress({ token: this.token })
      .then(res => {
        console.log(res);
        if (res.result === true) {
          this.addressList = res.data;
          this.isShow = true;
          res.data.forEach((element, index) => {
            if (element.isDefault === true) {
              this.n = index; //初始化默认地址 标识
            }
          });
        }else{
          this.showno = true;
        }

        Indicator.close();
      })
      .catch();
  },
  methods: {
    switchAddress(index) {
      this.$store.commit("changeAddressIndex", index);
      this.$router.go(-1);
    },
    tab(index, item) {
      if(this.n == index) return;//已为默认地址 不做操作
      let id = item.id;
      let data = item;
      MessageBox.confirm("确定设置为默认地址?", "温馨提示")
        .then(() => {
          Indicator.open();
          data.isDefault = true; //设置默认地址
          data.token = this.token; //携带coken
          data.id = id; //携带 地址 id
          //console.log(data);
          updateAddress(data)
            .then(res => {
              //console.log(res);
              Indicator.close();
              if (res.result === true) {
                this.n = index;
                this.$toast({ message: "设置默认地址成功", duration: 1000 });
                // setTimeout(() => {
                //   this.$router.go(-1);
                // }, 1000);
              } else {
                this.$toast(res.msg);
              }
            })
            .catch();
        })
        .catch(err => {
          //console.log(err);
        });
    },
    edits(item) {//query传参
      let data = JSON.stringify(item);
      this.$router.push({path:'/addAddress',query:{address:data}});
    },
    dels(id) {
      MessageBox.confirm("确定删除?",'温馨提示')
        .then(res => {
          deleteAddress({ ids: id, token: this.token })
            .then(res => {
              //console.log(res);
              if (res.result === true) {
                this.$toast({ message: "删除成功", duration: 1000 });
                setTimeout(() => {
                  //this.$router.go(0);
                  location.reload();
                }, 1000);
              }
            })
            .catch(err=>{
              console.log(err);
            });
        })
        .catch(err=>{
          //console.log(err);
        });
    },
    goAdd() {
      this.$router.push("/addAddress");
    }
  }
};
</script>
<style lang="less" scoped>
.addressList {
  margin-bottom: 1.2rem;
}
.item-list {
  background: #fff;
  padding-left: 0.28rem;
  margin-bottom: 0.2rem;
  .border {
    border-bottom: 1px solid #f0f0f0;
    width: 100%;
    height: 0;
    padding-bottom: 0.2rem;
  }
}
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
.edit {
  padding: 0.25rem 0;
  display: flex;
  p {
    font-size: 0.26rem;
    color: #666;
  }
  .pen,
  .del {
    display: flex;
  }
  .img {
    width: 0.36rem;
    height: 0.36rem;
    img {
      max-width: 100%;
    }
    & + p {
      flex: 2;
    }
  }
  .moren {
    flex: 2;
    display: flex;
  }
  .circle {
    height: 0.36rem;
    border-radius: 50%;
    border: 1px solid #333;
    flex: 0.36rem 0 0;
    //background: #333;
    position: relative;
    &.select {
      background: #333;
    }
    &.select:after {
      content: "";
      position: absolute;
      top: 2px;
      left: 7px;
      width: 0.1rem;
      height: 0.2rem;
      /*// 勾的短边*/
      /*// 勾的长边*/
      border: 2px solid #fff;
      /*// 勾的颜色*/
      border-width: 0 1px 1px 0;
      /* // 勾的宽度*/
      transform: rotate(45deg);
    }
  }
  p {
    flex: 2;
    padding-left: 0.2rem;
  }
  .pen {
    flex: 1;
  }
  .del {
    flex: 1;
  }
}
.add {
  height: 1rem;
  line-height: 1rem;
  text-align: center;
  background: #333;
  color: #fff;
  font-size: 0.3rem;
  width: 100%;
  position: fixed;
  z-index: 100;
  bottom: 0;
  left: 0;
}
.noAddress{
  text-align: center;
  padding-top: 1.4rem;
  img{
    width: 40%;
    display: inline-block;
  }
  p{
    font-size: .28rem;
    color: #333;
  }
}
</style>
