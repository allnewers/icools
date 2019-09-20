<template>
  <div id="app" ref='pageDiv' @mousemove="onmousemove($event)" @touchmove="onmousemove($event)" @mouseup="onmouseup($event)" @touchend="onmouseup($event)">
    <transition :name="direction">
      <keep-alive include="GBindex,notice">
        <router-view/>
      </keep-alive>
    </transition>
    <div ref='actionMgr' @mousedown="onmousedown($event)" @touchstart="onmousedown($event)" class="myZone" @click="checkLogin('myZone')">
      <img src="./assets/img/avatar@2x.png" alt>
    </div>
  </div>
</template>

<script>
import { getCookie } from "./util";
export default {
  name: "App",
  data(){
    return {
      mousedownState: false, //鼠标默认抬起
      iX: 0,//鼠标坐标 与 拖拽按钮 间距 x
      iY: 0//鼠标坐标 与 拖拽按钮 间距 y
    }
  },
  mounted() {
    this.reset();
    window.onload = function() {
      document.documentElement.addEventListener("touchstart", function() {
        if (event.touches.length > 1) {
          event.preventDefault();
        }
      });
      var lastTouchEnd = 0;
      document.documentElement.addEventListener(
        "touchend",
        function() {
          var now = new Date().getTime();
          if (now - lastTouchEnd < 300) {
            event.preventDefault();
          }
          lastTouchEnd = now;
        },
        false
      );
    };
    document.addEventListener("gesturestart", function(event) {
      event.preventDefault();
    });
  },
  computed: {
    direction() {
      const viewDir = this.$store.state.viewDirection;
      let tranName = "";
      //alert(viewDir)
      if (viewDir === "right") {
        tranName = "view-right";
      } else {
        //tranName = "fade";
      }

      return tranName;
    }
  },
  methods: {
    reset: function() {
      (function(designWidth, maxWidth) {
        // console.log('start')
        var doc = document,
          win = window;
        var docEl = doc.documentElement;
        var tid;
        var rootItem, rootStyle;
        function refreshRem() {
          var width = docEl.getBoundingClientRect().width;
          if (!maxWidth) {
            maxWidth = 540;
          }
          if (width > maxWidth) {
            width = maxWidth;
          }
          //与淘宝做法不同，直接采用简单的rem换算方法1rem=100px
          var rem = (width * 100) / designWidth;
          //兼容UC开始
          rootStyle = "html{font-size:" + rem + "px !important}";
          rootItem =
            document.getElementById("rootsize") ||
            document.createElement("style");
          if (!document.getElementById("rootsize")) {
            document.getElementsByTagName("head")[0].appendChild(rootItem);
            rootItem.id = "rootsize";
          }
          if (rootItem.styleSheet) {
            rootItem.styleSheet.disabled ||
              (rootItem.styleSheet.cssText = rootStyle);
          } else {
            try {
              rootItem.innerHTML = rootStyle;
            } catch (f) {
              rootItem.innerText = rootStyle;
            }
          }
          //兼容UC结束
          docEl.style.fontSize = rem + "px";
        }
        refreshRem();
        win.addEventListener(
          "resize",
          function() {
            clearTimeout(tid); //防止执行两次
            tid = setTimeout(refreshRem, 300);
          },
          false
        );
        win.addEventListener(
          "pageshow",
          function(e) {
            if (e.persisted) {
              // 浏览器后退的时候重新计算
              clearTimeout(tid);
              tid = setTimeout(refreshRem, 300);
            }
          },
          false
        );
        if (doc.readyState === "complete") {
          doc.body.style.fontSize = "16px";
        } else {
          doc.addEventListener(
            "DOMContentLoaded",
            function(e) {
              doc.body.style.fontSize = "16px";
            },
            false
          );
        }
      })(750, 750);
    },
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
};
</script>

<style lang="less">
#app~div{
  /* display: none; 
	opacity:0; */
}
#app{
  min-height: 100vh;
}
.myZone {
  position:fixed!important;
  width: 1.13rem;
  height: 0.92rem;
  position: absolute;
  bottom: 1.48rem;
  background: rgba(0, 0, 0, 0.15);
  right: 0;
  border-radius: 0.7rem 0 0 0.7rem;
  z-index: 999;
  img {
    width: 0.84rem;
    left: 0.04rem;
    position: relative;
    top: 0.04rem;
  }
}
@keyframes slideInRight {
  from {
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
@keyframes slideInLeft {
  from {
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
.view-right-enter,
.view-left-leave-to {
  transform: translate(7.5rem);
}
.view-right-enter-active,
.view-left-leave-active {
  animation: slideInRight 0.3s ease-in-out;
}
.view-left-enter,
.view-left-leave-to {
  transform: translate(-7.5rem);
}
/* .view-left-enter-active,.view-left-leave-active{
  animation: slideInLeft .3s ease-in-out;  
} */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
