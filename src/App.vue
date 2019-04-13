<template>
  <div id="app">
    <transition :name="direction">
      <keep-alive include="GBindex,collectList,notice,awaitPay">
        <router-view/>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {
  name: "App",
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
          this.$router.push({ name: "login", params: { urlCode: urlCode } });
        }, 1000);
      } else {
        this.$router.push("/" + urlCode);
      }
    }
  }
};
</script>

<style>
#app {
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
