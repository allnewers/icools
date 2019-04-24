import wx from "weixin-js-sdk";
export const wxConfig = (appId,timestamp,nonceStr,signature)=>{
  wx.config({
    debug: true,
    appId: appId, // 和获取Ticke的必须一样------必填，公众号的唯一标识
    timestamp:timestamp, // 必填，生成签名的时间戳
    nonceStr: nonceStr, // 必填，生成签名的随机串
    signature: signature,// 必填，签名，见附录1
    //需要分享的列表项:发送给朋友，分享到朋友圈，分享到QQ，分享到QQ空间
    jsApiList: [
      'updateAppMessageShareData','updateTimelineShareData'
    ]
  });
  wx.checkJsApi({
    jsApiList: ['updateAppMessageShareData','updateTimelineShareData'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
    success: function(res) {
    // 以键值对的形式返回，可用的api值true，不可用为false
    // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
    }
  });
}
export const shareMessage = (title,desc,link,imgUrl)=>{//分享给朋友
  wx.updateAppMessageShareData({ 
    title: title, // 分享标题
    desc: desc, // 分享描述
    link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: imgUrl, // 分享图标
    success: function () {
      // 设置成功
      alert('分享给朋友成功');
    }
  })
}
export const shareTimeline = (title,link,imgUrl)=>{//分享到朋友圈
  wx.updateTimelineShareData({ 
    title: title, // 分享标题
    link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: imgUrl, // 分享图标
    success: function () {
      // 设置成功
      alert('分享给朋友成功');
    }
  })
}