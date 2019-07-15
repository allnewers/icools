<template>
  <div class="order">
    <div v-show="showAll">
      <div class="address" :class="noAdderss?'noStyle':''">
        <div class="defaults">
          <div class="add" v-if="noAdderss" @click="addAddress">新增收货地址</div>
          <div class="has" v-if="hasAdderss" @click="jumpUrl('addressList')">
            <div class="userPhone clear">
              <p class="fl">{{addressList[addressIndex].consignee}}</p>
              <p class="fl">{{addressList[addressIndex].phone}}</p>
            </div>
            <div class="address-i">{{address}}</div>
          </div>
        </div>
      </div>
      <div class="border-cai">
        <img src="../../assets/img/cai@2x.png" alt>
      </div>
      <div class="goodsBill">
        <h3>商品清单</h3>
        <div class="goods">
          <div class="tops clear">
            <div class="img fl">
              <img :src="imgBaseUrl+orderInfo.thumbnail" alt>
            </div>
            <div class="txt fl">
              <p>{{orderInfo.fullName}}</p>
              <p>
                <span>¥{{buyType == 'single'?orderInfo.price:orderInfo.groupPrice | returnFloat}}</span>
                ×{{sum}}
              </p>
            </div>
          </div>
          <ul>
            <li @click="choiceType">
              <span>配送方式</span>
              <span>{{currentVal?currentVal:'选择配送方式'}}</span>
            </li>
            <li @click="choiceTime">
              <span>送货时间</span>
              <span>{{times.deliveryDate?times.deliveryDate:''}} {{times.deliveryDate?times.deliveryTime:'选择配送时间'}}</span>
            </li>
            <li @click="setInvoiceTitle">
              <span>发票</span>
              <span>{{list[invoiceTitle]?list[invoiceTitle].title:'不开发票'}}</span>
            </li>
            <!-- <li @click="discount">
              <span>优惠券</span>
              <span>暂无可用</span>
            </li> -->
            <li>
              <span>商品金额</span>
              <span class="red">¥{{summary | returnFloat}}</span>
            </li>
            <!-- <li>
            <span>数量</span>
            <div class="compute fr">
              <button class="fl" @click="decrease">-</button>
              <input class="fl" type="text" v-model="snum" readonly onfocus="this.blur();">
              <button class="fl" @click="increase">+</button>
            </div>
            </li>-->
            <li>
              <span>运费</span>
              <span class="red">¥0.00</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="blank"></div>
      <div class="submitOrder">
        <div class="summary">
          共
          <span>{{params.sum}}</span>件，合计：
          <i>¥{{summary | returnFloat}}</i>
        </div>
        <div class="submit" @click="submitOrder">提交订单</div>
      </div>
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
    <mt-popup v-model="popupVisible" :closeOnClickModal="true" position="bottom">
      <div class="date-top">配送日期</div>
      <!-- {{forbidden}} -->
      <div class="con">
        <div class="date titles">配送日期</div>
        <div class="date-select clear">
          <div
            class="item-poupe"
            v-for="(item,index) in DateData"
            :key="index"
            
          >
            <input
              id="dates"
              :class="(index==0&&noSelected)?'todayForbidden':''"
              :disabled="index==0&&noSelected"
              v-model="times.deliveryDate"
              type="radio"
              :value="sendData[index]"
            >
            <label for="dates">{{item}}</label>
          </div>
        </div>
        <div class="time titles">配送时间</div>
        <div class="time-select">
          <div class="item-poupe" v-for="(item,index) in timeList" :key="index" :class="{isForbidden:forbidden[index]}">
            <input
              id="am"
              :disabled="forbidden[index]"
              v-model="times.deliveryTime"
              type="radio"
              :value="item"
            >
            <label for="am">{{item}}</label>
          </div>
          
        </div>
      </div>
      <button class="confirm" @click="checkTime">确定</button>
    </mt-popup>
    <mt-popup v-model="popupVisible1" position="bottom">
      <mt-picker :slots="slots" ref="picker" :show-toolbar="true">
        <p class="mint-picker-top">配送方式</p>
      </mt-picker>
      <button class="confirm" @click="setTypeVal">确定</button>
    </mt-popup>
  </div>
</template>
<script>
import { getCookie,imgBaseUrl, setCookie,delCookie } from "../../util";
import { receiveAddress, InvoiceTitleList ,saveOrderGroup,saveOrderSingle,getOrderInfo} from "../../api";
import { mapState } from "vuex";
import { Indicator } from "mint-ui";
import { prototype } from 'stream';
export default {
  name: "order",
  data() {
    return {
      productId:'',
      sum: 1,
      price:0,
      buyType:'',
      imgBaseUrl:imgBaseUrl,
      dialog: false,
      tabBar: ["可用优惠券（1）", "不可用优惠券（2）"],
      isActive: "0",
      noUse: false,
      params: {},
      token: "",
      orderInfo:{},
      noAdderss: false,
      hasAdderss: false,
      addressList: [],
      showAll: false,
      popupVisible: false, //配送时间
      popupVisible1: false, //配送方式
      // deliveryTime:'',
      // deliveryDate:'',
      DateData: [],
      sendData: [],
      list: [],
      forbidden: [false, false, false, false],
      noSelected: false, //今天不可选
      slots: [
        {
          flex: 1,
          values: ["酷急送快递","顺丰快递",'到店自提'],
          textAlign: "center"
        }
      ],
      timeList:['09:00-12:00','12:00-15:00','15:00-18:00','18:00-21:00'],
      tokenExpire:false,
      groupId:'',//拼团记录id
      groupMethod:1,//1、开团 2、凑团 
    };
  },
  computed: {
    ...mapState(["addressIndex", "times", "invoiceTitle",'currentVal']),
    summary() {
      let price = this.buyType == 'single'?this.orderInfo.price:this.orderInfo.groupPrice;

      let sum = parseFloat(price) * parseFloat(this.sum);
      return sum;
    },
    address() {
      let data = this.addressList[this.addressIndex];
      data = data ? data.areaName + data.address : "";
      return data;
    },
    addressId(){
      return this.addressList[this.addressIndex]?this.addressList[this.addressIndex]['id']:'';
    },
    isInvoice(){
      if(this.list[this.invoiceTitle]){
        return true;
      }else{
        return false;
      }
    },
    invoiceTitleCan(){
      let val;
      return val = this.list[this.invoiceTitle]?this.list[this.invoiceTitle].title:'';
    },
    invoiceNum(){
      let val;
       return val = this.list[this.invoiceTitle]?this.list[this.invoiceTitle].identifyNumber:'';
    }
  },
  mounted() {
    // let params = this.$route.params;
    // this.params = params;
    // console.log(params);
    let token = getCookie("token");
    let productId = getCookie("productId");
    let buyType = getCookie("buyType");
    let groupId = getCookie('groupId');
    this.sum = getCookie("sum");
    this.groupId = groupId;  
    this.productId = productId;
    this.buyType = buyType;
    //console.info(params);  
    this.token = token;
    Indicator.open();
    receiveAddress({ token: this.token })
      .then(res => {
        //console.log(res);
        if(res.errorCode == 10){
          this.tokenExpire = true;//服务器token过期
        }
        if (res.result === false) {
          this.noAdderss = true;
        } else {
          this.addressList = res.data;
          if(this.addressList.length>0){
            this.hasAdderss = true;
          }else{
            this.noAdderss = true;
          }
          if (this.addAddress === 0) {
            //（刷新 vuex值丢失）首次进入，设置默认地址
            res.data.forEach((element, index) => {
              if (element.isDefault === true) {
                this.n = index; //初始化默认地址 标识
              }
            });
          }
          
        }
        getOrderInfo({
          productId:this.productId
        }).then(res=>{
          
          console.log(res);
          this.showAll = true;
          if(res.result === true){
            this.orderInfo = res.data;
          }else{
            if(res.errorCode == '1000'){//直接进入order 重定向到首页
              this.$router.replace('/');
            }
            this.$toast(res.msg);
          }
          Indicator.close();
        }).catch(err=>{
          console.log(err);
        });

      })
      .catch();
    InvoiceTitleList({
      token: this.token
    })
      .then(res => {
        console.log(res);
        if (res.result === true) {
          this.list = res.data;
        } else {
          console.log(res.msg);
        }
      })
      .catch();
    
  },
  methods: {
    addAddress() {
      if(this.tokenExpire){
        this.$router.push({ name: "phonelogin", params: { urlCode:'order' } });
        return;
      }
      this.jumpUrl("addAddress");
    },
    submitOrder() {
      //let buyType = this.params.buyType;
      delCookie('isPay');
      if(this.addressId == ''){
        this.$toast('请填写收货地址');
        return;
      }
      Indicator.open();
      //console.log(this.isInvoice,this.invoiceTitleCan,this.invoiceNum)
      //单买 、团购分开 调接口
      if(this.buyType === 'single'){//单买 保存订单接口
        this.singleOrder();
      }else if(this.buyType === 'group'){//团购 保存订单接口
        this.tuanOrder();
      }
      
    },
    setInvoiceTitle() {
      let len = this.list.length;
      if (len > 0) {
        this.$router.push({ name: "invoiceList", params: { origin: "order" } });
      }else {
        this.jumpUrl("invoiceTitle");
      }
    },
    tuanOrder(){
      if(!this.groupId){
        this.groupId = null;
      }else{//如果有拼团记录id 则为凑团的订单
        this.groupMethod = 2;
      }
      //console.log(this.groupMethod)
      let params = {
        token:this.token,
        productId:this.productId,//商品id
        quantity:this.sum,//商品数量
        receiverId :this.addressId,//地址id
        shippingMethodId:1,//配送方式id
        isInvoice:this.isInvoice,//是否开发票
        invoiceTitle:this.invoiceTitleCan,// 发票抬头
        identifyNumber:this.invoiceNum,//发票税号,
        memo:this.times.deliveryDate +' '+ this.times.deliveryTime,// 订单备注
        couponCodeId:'',//优惠卷id
        groupMethod:this.groupMethod,//1、开团 2、凑团  
        groupbuyingReocrdsId:this.groupId
      };
      //console.log(params);
      //return;
      saveOrderGroup(params).then(res=>{
        Indicator.close();
        console.log(res);
        if(res.result === true){
          //this.$router.push({ name: "payType", params: { sn: res.data,price:this.params.price } });
          setCookie('orderSn',res.data,1);
          this.$router.push('/payType');
        }else{
          this.$toast(res.msg);
        }
      }).catch(err=>{
        console.log(err);
      });
    },
    singleOrder(){
      saveOrderSingle({
        token:this.token,
        productId:this.productId,//商品id
        quantity:this.sum,//商品数量
        receiverId :this.addressId,//地址id
        shippingMethodId:1,//配送方式id
        paymentMethodId:1,
        isInvoice:this.isInvoice,//是否开发票
        invoiceTitle:this.invoiceTitleCan,// 发票抬头
        identifyNumber:this.invoiceNum,//发票税号,
        memo:this.times.deliveryDate +' '+ this.times.deliveryTime,// 订单备注
        couponCodeId:'',//优惠卷id
      }).then(res=>{
        Indicator.close();
        console.log(res);
        if(res.result === true){
          //this.$router.push({ name: "payType", params: { sn: res.data,price:this.params.price } });
          setCookie('orderSn',res.data,7);
          this.$router.push('/payType');
        }else{
          this.$toast(res.msg);
        }
      }).catch(err=>{
          
      });
    },
    discount() {
      this.dialog = true;
    },
    closeDialog(val) {
      this.dialog = val;
    },
    tab(index) {
      this.isActive = index;
      if (index == "1") {
        this.noUse = true;
      } else {
        this.noUse = false;
      }
    },
    jumpUrl(url) {
      this.$router.push("/" + url);
    },
    choiceType() {
      this.popupVisible1 = true;
    },
    choiceTime() {
      this.popupVisible = true;
      this.initFourDay();
      this.initToday();
    },
    checkTime() {
      if (!this.times.deliveryTime || !this.times.deliveryDate) {
        this.$toast("请选择时间和日期");
        return;
      }
      this.popupVisible = false; //关闭时间选择 弹框
    },
    setTypeVal() {
      this.popupVisible1 = false;
      this.$store.commit('setDeliveryType',this.$refs.picker.getValues()[0]); 
    },
    initFourDay() {
      //配送日期 今天往后推四天
      let yearArr = []; //年
      let monthArr = []; //月
      let dayArr = []; //日
      let weekNumArr = []; //周 阿拉伯数字
      let weekWordArr = []; //周 汉字
      let week = [
        "[周日]",
        "[周一]",
        "[周二]",
        "[周三]",
        "[周四]",
        "[周五]",
        "[周六]"
      ];
      let needArr = []; //渲染用
      let sendArr = []; //推数据用
      let nowDate = new Date();
      let year = nowDate.getFullYear();

      for (let i = 0; i < 4; i++) {
        monthArr[i] = nowDate.getMonth() + 1;
        dayArr[i] = nowDate.getDate() + i;
        weekNumArr[i] = nowDate.getDay() + i;
        if (weekNumArr[i] >= 7) {
          weekNumArr[i] = weekNumArr[i] - 7;
        }
        monthArr[i] = monthArr[i] >= 10 ? monthArr[i] : "0" + monthArr[i];
        dayArr[i] = dayArr[i] >= 10 ? dayArr[i] : "0" + dayArr[i];
        weekWordArr[i] = week[weekNumArr[i]];
        if (i == 0) weekWordArr[0] = "[今天]";
        needArr[i] = monthArr[i] + "月" + dayArr[i] + "日" + weekWordArr[i];
        sendArr[i] = year + "-" + monthArr[i] + "-" + dayArr[i];
      }

      this.DateData = needArr;
      this.sendData = sendArr;
    },
    initToday() {
      let nowHours = new Date().getHours();
      //let nowHours =22;
      if (nowHours >= 21) {
        this.noSelected = true;
      }
    },
    choiceDate(index) {
      let nowHours = new Date().getHours();
      let arr = [12, 15, 18, 21];
      let indexArr = [];
      for (let i in arr) {
        if (arr[i] <= nowHours) {
          indexArr.push(i);
        }
      }
      if (index == 0) {
        for (let j in indexArr) {
          this.forbidden[parseInt(indexArr[j])] = true;
        }
      } else {
        for (let i = 0; i < this.forbidden.length; i++) {
          this.forbidden[i] = false;
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
.mint-picker-top {
  text-align: center;
  line-height: 1rem;
  border-bottom: 1px solid #f0f0f0;
}
.isForbidden {
  background: #f0f0f0;
  color: #999;
}
.todayForbidden + label {
  color: #999;
  width: 100%;
  height: 100%;
  display: block;
  background: #f0f0f0;
}
.mint-popup-bottom {
  width: 100%;
  height: 55vh;
}
.address {
  padding: 0.1rem 0.28rem 0.28rem;
  position: relative;
  background: #fff url("../../assets/img/address.png") no-repeat 0.28rem center;
  background-size: 22px 23px;
  min-height: 0.4rem;
  &.noStyle {
    padding: 0.28rem;
  }
}
.defaults {
  background: url("../../assets/img/right.png") no-repeat 6.6rem center;
  background-size: 24px 28px;
  padding-left: 0.62rem;
  color: rgba(51, 51, 51, 1);
  .has {
    min-height: 1rem;
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
      width: 80%;
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
    &:nth-child(1),
    &:nth-child(2),
    &:nth-child(3),
     {
      padding-right: 0.5rem;
      background: url("../../assets/img/right.png") no-repeat 98.5% center;
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
        &.grey {
          background: #dbdbdb;
        }
      }
    }
  }
}
.date-top {
  height: 1rem;
  text-align: center;
  line-height: 1rem;
  font-size: 0.28rem;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
}
.con {
  padding: 0.28rem;
  color: #333;

  .titles {
    font-size: 0.24rem;
    padding-left: 0.36rem;
    margin-top: 0.1rem;
    &.date {
      background: url("../../assets/img/date@2x.png") no-repeat 0 center;
      background-size: 0.3rem 0.3rem;
    }
    &.time {
      background: url("../../assets/img/time@2x.png") no-repeat;
      background-size: 0.3rem 0.3rem;
    }
  }
  .time-select {
    overflow: hidden;
    padding: 0.3rem 0;
  }
}
.date-select {
  padding: 0.3rem 0;
  .item-poupe {
    width: 3rem;
  }
}
.item-poupe {
  width: 1.52rem;
  height: 0.52rem;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  font-size: 0.22rem;
  text-align: center;
  line-height: 0.52rem;
  float: left;
  margin: 0 0.2rem 0.2rem 0;
  position: relative;
  &:last-child {
    margin-right: 0;
  }
  input[type="radio"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    &:checked + label {
      background: #333;
      color: #fff;
      width: 100%;
      height: 100%;
      display: block;
      border-radius: 4px;
    }
  }
}
.order .confirm {
  margin-top: 0;
}
</style>
<style>
.mint-toast.is-placemiddle {
  z-index: 2002;
}
</style>



