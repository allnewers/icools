<template>
  <div class="wrapper">
    <ul>
      <li :class="activeIndex >= index?'on':''" v-for="(item,index) in starList" :key="item.id" @click="choice(index)"></li>
    </ul>
  </div>
</template>
<script>
// import starOff from '../../assets/img/like@2x.png'
// import starOn from '../../assets/img/like1@2x.png'
export default {
  name:"",
  data(){
    return {
      //starImg:starOff,
      starList:[
        {id:1},
        {id:2},
        {id:3},
        {id:4},
        {id:5}
      ],
      activeIndex:4
    }
  },
 methods:{
   choice(n){
     this.activeIndex = n;
     this.$emit("getStarNum", n); 
   }
 },

}
</script>
<style lang="less" scoped>
.wrapper{
  ul{
    overflow: hidden;
    li{
      float: left;
      width: .36rem;
      height: .36rem;
      margin-right: 16px;
      background: url('../../assets/img/starOff.png') no-repeat;
      background-size: cover;
      &.on{
        background: url('../../assets/img/like1@2x.png') no-repeat;
        background-size: cover;
      }
    }
  }
}
</style>
