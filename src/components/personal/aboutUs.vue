<template>
  <div>
    <div class="care">
      <img src="../../assets/img/erweima.png" alt=""> 
      <span>保存图片 扫码关注即可获得优惠</span>
      <div class="tel">
        <p>www.eicools.com</p>
        <p>联系电话：0710-3815007</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name:"aboutUs",
  data(){
    return {
    }
  }
}
</script>
<style lang="less" scoped>
.care{
  text-align: center;
  height: 100vh;
  background: #fff;
  padding-top: 1rem;
  img{
    width: 90%;
    display: block;
    margin: 0 auto;
  }
  span{
    color: #666;
    font-size: .3rem;
  }
}
.tel{
  position: absolute;
  bottom:.5rem;
  width: 100%;
  p{
    text-align: center;
    font-size: .24rem;
    color: #ADADAD;
    padding: .2rem;

  }
}
</style>
