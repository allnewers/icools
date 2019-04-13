<template>
  <div>
    <div class="awaitshare">
      <ul>
        <li>
          <div class="top clear">
            <p class="fl">订单编号：201901272561</p>
            <span class="fr">待分享，差一人</span>
          </div>
          <div class="brief clear">
            <div class="thumbnail fl">
              <img src alt>
            </div>
            <div class="txts fr">
              <h3>iPhone 7 Plus (A1661)[银色 256G 全 网通4G]</h3>
              <p>
                <span>¥6000</span>
                <span>×1</span>
              </p>
            </div>
          </div>
          <div class="fun-btn">
            <button class="cancel" @click="cancelOrder">取消订单</button>
            <button class="toPay" @click="invite">邀请好友凑团</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import wx from "weixin-js-sdk";
import axios from "axios";
export default {
  name: "awaitshare",
  data() {
    return {};
  },
  mounted() {
    // axios.get('http://192.168.0.103:9898/share/wx',{
    //   params: {
    //     url: 'http://24b39x8901.qicp.vip:10989/#/awaitshare'
    //   }
    // }).then(res=>{
    //   console.log(res);
    // }).catch(err=>{
    //   console.log(err);
    // });
    this.init();
  },
  methods: {
    cancelOrder() {},
    invite() {},
    async init() {
      let _this = this;
      let url = encodeURIComponent(window.location.href.split('#')[0]);
      let data = await axios.get("http://192.168.0.103:9898/share/wx", {
        params: {
          url: url
        }
      });
      console.log(data, data.data.appId,data.data.noncestr);

      wx.config({
        debug: true,
        appId: data.data.appId, // 和获取Ticke的必须一样------必填，公众号的唯一标识
        timestamp: data.data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.data.noncestr, // 必填，生成签名的随机串
        signature: data.data.signature, // 必填，签名，见附录1
        //需要分享的列表项:发送给朋友，分享到朋友圈，分享到QQ，分享到QQ空间
        jsApiList: [
          "onMenuShareAppMessage",
          //"onMenuShareTimeline",
          //"onMenuShareQQ",
          //"onMenuShareQZone"
        ]
      });
      //处理验证失败的信息
      wx.error(function(res) {
        _this.$toast("验证失败返回的信息:", res);
      });
      wx.ready(function() {
        //分享给朋友
        wx.onMenuShareAppMessage({
          title: "_this.newDetailObj.title", // 分享标题
          desc: "_this.desc", // 分享描述
          link: window.location.href.split("#")[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: "", // 分享图标
          type: "", // 分享类型,music、video或link，不填默认为link
          dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
          success: function(res) {
            // 用户确认分享后执行的回调函数
            _this.$toast("分享给朋友成功返回的信息为:", res);
          },
          cancel: function(res) {
            // 用户取消分享后执行的回调函数
            _this.$toast("取消分享给朋友返回的信息为:", res);
          }
        });
        
      });
    }
  }
};
</script>
<style lang="less" scoped>
.awaitshare {
  li {
    background: #fff;
    margin-top: 0.2rem;
    .top {
      height: 0.9rem;
      line-height: 0.9rem;
      padding: 0 0.28rem;
      font-size: 0.28rem;
      border-bottom: 1px solid #f0f0f0;
      p {
        color: #666;
      }
      span {
        color: #ff3737;
      }
    }
    .brief {
      padding: 0.28rem 0.2rem;
      border-bottom: 1px solid #f0f0f0;
      .thumbnail {
        width: 1.5rem;
        height: 1.5rem;
        img {
          max-width: 100%;
          height: 100%;
          border: 1px solid #f0f0f0;
        }
      }
      .txts {
        width: 5.3rem;
        font-size: 0.28rem;

        h3 {
          font-weight: 400;
          color: #333;
          font-size: 0.28rem;
        }
        p {
          color: #666;
          margin-top: 0.4rem;
          overflow: hidden;
          text-align: justify;
          span {
            float: left;
            &:last-child {
              float: right;
            }
          }
        }
      }
    }
    .fun-btn {
      height: 0.9rem;
      line-height: 0.85rem;
      text-align: right;
      padding: 0 0.28rem;
      button {
        vertical-align: middle;
        padding: 0.1rem 0.15rem;
        border: 1px solid #f0f0f0;
        border-radius: 4px;
      }
      .cancel {
        color: #666;
      }
      .toPay {
        background: #ff3737;
        color: #fff;
        border-color: #fff;
        margin-left: 0.4rem;
      }
    }
  }
}
</style>
