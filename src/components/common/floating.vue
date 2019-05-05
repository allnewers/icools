<template>
  <div class="wrapper" ref='pageDiv' @mousemove="onmousemove($event)" @touchmove="onmousemove($event)" @mouseup="onmouseup($event)" @touchend="onmouseup($event)">
    <div ref='actionMgr' @mousedown="onmousedown($event)" @touchstart="onmousedown($event)" class="myZone" @click="checkLogin('myZone')">
      <img src="../../assets/img/avatar@2x.png" alt>
    </div>
  </div>
</template>
<script>
import { getCookie } from "../../util";
export default {
  name:"floating",
  data(){
    return {
      mgrState: false,
      mousedownState: false, //鼠标默认抬起
      iX: 0,//鼠标坐标 与 拖拽按钮 间距 x
      iY: 0//鼠标坐标 与 拖拽按钮 间距 y
    }
  },
  methods:{
     checkLogin(urlCode) {
      let token = getCookie("token");
      if (token === null) {
        this.$toast({
          message: "您尚未登录，请登录",
          duration: 1000
        });
        setTimeout(() => {
          this.$router.push({ name: "phonelogin", params: { urlCode: urlCode } });
        }, 1000);
      } else {
        this.$router.push("/" + urlCode);
      }
    },
    /* 鼠标按下事件 */
    onmousedown(event) {
      /* 此处判断  pc 或 移动端 得到 event 事件 */
      var touch;
      if (event.touches) {
        touch = event.touches[0];
      } else {
        touch = event;
      }
      // 鼠标点击 面向页面 的 x坐标 y坐标
      let { clientX, clientY } = touch;
      // 鼠标x坐标 - 拖拽按钮x坐标  得到鼠标 距离 拖拽按钮 的间距
      //this.iX = clientX - this.$refs.actionMgr.offsetLeft;
      // 鼠标y坐标 - 拖拽按钮y坐标  得到鼠标 距离 拖拽按钮 的间距
      this.iY = clientY - this.$refs.actionMgr.offsetTop;
      // 设置当前 状态为 鼠标按下
      this.mousedownState = true;
    },
    /* 鼠标移动事件 */
    onmousemove(event) {
      //鼠标按下 切移动中
      if (this.mousedownState) {
        /* 此处判断  pc 或 移动端 得到 event 事件 */
        var touch;
        if (event.touches) {
          touch = event.touches[0];
        } else {
          touch = event;
        }
        // 鼠标移动时 面向页面 的 x坐标 y坐标
        let { clientX, clientY } = touch;
        //当前页面全局容器 dom 元素  获取容器 宽高
        let {
          clientHeight: pageDivY,
          clientWidth: pageDivX
        } = this.$refs.pageDiv;
        /* 鼠标坐标 - 鼠标与拖拽按钮的 间距坐标  得到 拖拽按钮的 左上角 x轴y轴坐标 */
        let [x, y] = [clientX - this.iX, clientY - this.iY];

        //拖拽按钮 dom 元素  获取 宽高 style 对象
        let {
          clientHeight: actionMgrY,
          //clientWidth: actionMgrX,
          style: actionMgrStyle
        } = this.$refs.actionMgr;
        /* 此处判断 拖拽按钮 如果超出 屏幕宽高 或者 小于  
           设置 屏幕最大 x=全局容器x y=全局容器y 否则 设置 为 x=0 y=0 
        */
        // if (x > pageDivX - actionMgrX) x = pageDivX - actionMgrX;
        // else if (x < 0) x = 0;
        if (y > pageDivY - actionMgrY) y = pageDivY - actionMgrY;
        else if (y < 0) y = 0;
        // 计算后坐标  设置 按钮位置
        //actionMgrStyle.left = `${x}px`;
        actionMgrStyle.top = `${y}px`;
        actionMgrStyle.bottom = "auto";
        //actionMgrStyle.right = "auto";
        //当按下键滑动时， 阻止屏幕滑动事件
        event.preventDefault();
      }
    },
    /* 鼠标抬起事件 */
    onmouseup(event) {
      // 设置当前状态为鼠标抬起
      this.mousedownState = false;
    }
  }
}
</script>
<style lang="less" scoped>
.wrapper{
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
}
.myZone {
  width: 1.13rem;
  height: 0.92rem;
  position: absolute;
  bottom: 1.48rem;
  background: rgba(0, 0, 0, 0.15);
  right: 0;
  border-radius: 0.7rem 0 0 0.7rem;
  z-index: 10000;
  img {
    width: 0.84rem;
    position: relative;
    left: 0.04rem;
    top: 0.04rem;
    z-index: 10000;
  }
}
</style>
