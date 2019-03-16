<template>
  <div>
    <div class="addressList">
      <div class="item-list">
        <div class="userPhone clear">
          <p class="fl">王小二</p>
          <p class="fl">13222223333</p>
        </div>
        <div class="address-i">北京西城区内环到二环里西城区阜外大街甲9号国宾酒店打 一层GBC-15区域</div>
        <div class="border"></div>
        <div class="edit">
          <div class="circle"></div>
          <p>默认地址</p>
          <div class="pen"></div>
          <div class="del"></div>
        </div>
      </div>
      <div class="item-list">
        <div class="userPhone clear">
          <p class="fl">王小二</p>
          <p class="fl">13222223333</p>
        </div>
        <div class="address-i">北京西城区内环到二环里西城区阜外大街甲9号国宾酒店打 一层GBC-15区域</div>
        <div class="border"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "addressList",
  data() {
    return {};
  }
};
</script>
<style lang="less" scoped>
.item-list {
  background: #fff;
  padding-left: 0.28rem;
  margin-bottom: .2rem;
  .border{
    border-bottom: 1px solid #f0f0f0;
    width: 100%;
    height: 0;
    padding-bottom: .2rem;
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
.edit{
  padding: .25rem 0;
}
</style>
