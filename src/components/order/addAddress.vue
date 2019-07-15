<template>
  <div>
    <div class="from">
      <ul>
        <li>
          <label for>姓名</label>
          <input
            type="text"
            v-model="formData.consignee"
            maxlength="30"
            placeholder="请输入姓名（必填）"
            required
          />
        </li>
        <li @click="popupVisible1 = true">
          <label for>性别</label>
          <input
            type="text"
            ref="gender"
            :value="currentgenderVal[0]?currentgenderVal[0]:'请选择(必填)'"
            unselectable="on"
            onfocus="this.blur()"
            readonly
          />
        </li>
        <li>
          <label for>电话</label>
          <input type="text" v-model="formData.phone" maxlength="11" placeholder="请输入正确的联系电话（必填）" />
        </li>
        <li @click="popupVisible = true">
          <label for>地区</label>
          <input
            type="text"
            ref="area"
            :value="districtVal?districtVal:'请选择(必填)'"
            unselectable="on"
            onfocus="this.blur()"
            readonly
          />
        </li>
        <li>
          <label for>地址</label>
          <input type="text" v-model="formData.address" maxlength="50" placeholder="请输入详细地址（必填）" />
        </li>
        <!-- <li>
          <label for>邮编</label>
          <input type="text" v-model="formData.consignee" maxlength="10" placeholder="请输入邮政编码（必填）">
        </li>-->
      </ul>
    </div>
    <div class="submit" @click="submit">保存</div>
    <mt-popup v-model="popupVisible" position="bottom">
      <mt-picker :slots="slots" ref="picker" :show-toolbar="true">
        <p class="mint-picker-top">配送至</p>
      </mt-picker>
      <button class="confirm" @click="setVal">确定</button>
    </mt-popup>
    <mt-popup v-model="popupVisible1" position="bottom">
      <mt-picker :slots="genderslots" ref="picker1" :show-toolbar="true">
        <p class="mint-picker-top">请选择性别</p>
      </mt-picker>
      <button class="confirm" @click="setgenderVal">确定</button>
    </mt-popup>
  </div>
</template>
<script>
import { saveAddress, updateAddress } from "../../api";
import { getCookie } from "../../util";
import { Indicator } from "mint-ui";
import { setTimeout } from "timers";
export default {
  name: "addAddress",
  data() {
    return {
      popupVisible: false,
      popupVisible1: false,
      currentVal: [],
      county: "",
      currentgenderVal: [],
      slots: [
        {
          flex: 1,
          values: ["湖北省"],
          textAlign: "center"
        },
        {
          flex: 1,
          values: ["襄阳市"],
          textAlign: "center"
        },
        {
          flex: 1,
          values: ["樊城区", "襄城区", "襄州区"],
          textAlign: "center"
        }
      ],
      genderslots: [
        {
          flex: 1,
          values: ["男", "女", "保密"],
          textAlign: "center"
        }
      ],
      formData: {
        token: "",
        consignee: "", //收货人姓名
        areaName: "",
        address: "",
        phone: "",
        area: "",
        gender: ""
        //label:'',//地区标签
        //isDefault:false
      },
      editData: {},
      len: 0,
      val: ""
    };
  },
  computed: {
    districtVal() {
      return this.currentVal.join(" ");
    }
  },
  mounted() {
    let token = getCookie("token");
    this.formData.token = token;
    let query = this.$route.query;
    let len = Object.keys(query).length;
    this.len = len;
    if (len > 0) {
      //如果 是编辑页面
      let editData = JSON.parse(query.address);
      //console.log(editData);
      this.editData = editData;
      this.fillData();
      //console.log(this.currentgenderVal);
    }
  },
  methods: {
    fillData() {
      let areaName = this.editData.areaName;
      this.formData.consignee = this.editData.consignee;
      this.formData.gender = this.editData.gender; //性别id
      this.formData.areaName = this.editData.areaName;
      this.formData.address = this.editData.address;
      this.val = this.editData.gender;
      this.getGenderById(); //展示性别
      this.formData.phone = this.editData.phone;
      this.currentVal = [
        areaName.substr(0, 3),
        areaName.substr(3, 3),
        areaName.substr(6, 3)
      ]; //地区名称 省 县 市
      this.formData.address = this.editData.address;
      this.formData.area = this.editData.area;
    },
    getGenderById() {
      if (this.val == 0) {
        this.currentgenderVal[0] = "男";
      } else if (this.val == 1) {
        this.currentgenderVal[0] = "女";
      } else {
        this.currentgenderVal[0] = "保密";
      }
    },
    submit() {
      if (this.len > 0) {
        this.editAddress(); //编辑地址
      } else {
        this.xinZengAddress(); //新增地址
      }
    },
    setVal() {
      this.popupVisible = false;
      this.currentVal = this.$refs.picker.getValues();
      this.county = this.$refs.picker.getValues()[2];
      //console.log( this.county);
    },
    setgenderVal() {
      this.popupVisible1 = false;
      this.currentgenderVal = this.$refs.picker1.getValues();
      //console.log(this.currentgenderVal);
    },
    getVal() {
      let districtVal = this.currentVal.join("");
      this.formData.areaName = districtVal ? districtVal : ""; //获取地区名称
      this.getGenderId();
    },
    getGenderId() {
      if (this.currentgenderVal[0] == "男") {
        this.formData.gender = 0;
      } else if (this.currentgenderVal[0] == "女") {
        this.formData.gender = 1;
      } else if (this.currentgenderVal[0] == "保密") {
        this.formData.gender = 2;
      } else {
        this.formData.gender = "";
      }
      //console.log(this.formData.gender);
    },
    getCountyId() {
      //获取县的id
      if (this.county == "樊城区") {
        this.formData.area = 1739;
      } else if (this.county == "襄城区") {
        this.formData.area = 1738;
      } else if (this.county == "襄州区") {
        this.formData.area = 1740;
      }
    },
    validPhoneNum(num) {
      //检验手机号
      let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      let telNo = num.replace(/\s/g, ""); //去掉空格
      let val = reg.test(telNo);
      if (val) {
        return true;
      } else {
        return false;
      }
    },
    editAddress() {
      this.formData.id = this.editData.id;
      this.getVal();
      this.getCountyId();
      Indicator.open();
      updateAddress(this.formData)
        .then(res => {
          //console.log(res);
          if (res.result === true) {
            Indicator.close();
            this.$toast({ message: "编辑成功", duration: 1000 });
            setTimeout(() => {
              this.$router.go(-1);
            }, 1000);
          }
        })
        .catch(err => {});
    },
    xinZengAddress() {
      if (this.formData.consignee == "") {
        this.$toast("请输入姓名");
        return;
      }
      if (this.currentgenderVal[0] == "") {
        this.$toast("请选择性别");
        return;
      }
      if (
        this.formData.phone == "" ||
        !this.validPhoneNum(this.formData.phone)
      ) {
        this.$toast("请输入正确的手机号");
        return;
      }
      if (this.districtVal == "") {
        this.$toast("请选择地区");
        return;
      }
      if (this.formData.address == "") {
        this.$toast("请输入详细地址");
        return;
      }
      this.getVal(); //获取性别id 地区名称
      this.getCountyId(); //获取 县级 id
      Indicator.open();
      saveAddress(this.formData)
        .then(res => {
          console.log(res);
          if (res.result === true) {
            Indicator.close();
            this.$toast({ message: "添加成功", duration: 1000 });
            setTimeout(() => {
              this.$router.go(-1);
            }, 1000);
          } else {
            this.$toast(res.msg);
          }
        })
        .catch();
    }
  }
};
</script>
<style lang="less" scoped>
.mint-popup {
  width: 100%;
  height: 60vh;
}
.mint-picker-top {
  text-align: center;
  line-height: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.from {
  background: #fff;
  ul {
    padding: 0 0.5rem;
  }
  li {
    height: 1rem;
    line-height: 1rem;
    border-bottom: 1px solid #f0f0f0;
    font-size: 0.28rem;
    color: #333;
    &:last-child {
      border: none;
    }
    input {
      padding-left: 0.6rem;
      width: 80%;
      color: #333;
      &::placeholder {
        color: #d1d1d1;
      }
      &.code {
        width: 2rem;
      }
      font-size: 0.28rem;
    }
  }
}
.submit {
  width: 90%;
  height: 0.8rem;
  line-height: 0.8rem;
  color: #fff;
  font-size: 0.3rem;
  text-align: center;
  background: #333;
  border-radius: 4px;
  margin: 0.88rem auto;
  &.bgactive {
    background: #333;
  }
}
</style>
<style>
.picker-item.picker-selected {
  color: #f24848;
}
</style>

