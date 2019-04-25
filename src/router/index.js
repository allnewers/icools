import Vue from 'vue'
import Router from 'vue-router'
import { GetRequest } from '../util'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path:'/',
      redirect:'/home'
    },
    {
      path: '/home',
      name: 'GBindex',
      component: ()=>import("@/components/groupBuyIndex"), 
      meta:{
        title:'首页'
      } 
    },
    {
      path:'/search',
      name:'search',
      component:()=>import("@/components/search/search"),
      meta:{
        title:'搜索'
      } 
    },
    {
      path:'/tuanList/:keyword',
      name:'tuanList',
      component:()=>import("@/components/search/tuanList"),
      meta:{
        title:'拼团'
      } 
    },
    {
      path:'/proList/:id',
      name:'proList',
      component:()=>import("@/components/proList"),
      meta:{
        title:'拼团'
      } 
    },
    {
      path:'/detail/:sn',
      name:'detail',
      component:()=>import("@/components/detail"),
      meta:{
        title:'商品详情'
      } 
    },
    {
      path:'/totalComments/:goodsId',
      name:'totalComments',
      component:()=>import("@/components/totalComments"),
      meta:{
        title:'全部评价'
      } 
    },
    {
      path:'/game',
      name:'game',
      component:()=>import("@/components/game"),
      meta:{
        title:'玩法详情'
      } 
    },
    {
      path:'/order',
      name:'order',
      component:()=>import("@/components/order/order"),
      meta:{
        title:'填写订单'
      } 
    },
    {
      path:'/payType',
      name:'payType',
      component:()=>import("@/components/pay/payType") ,
      meta:{
        title:'支付订单'
      } 
    },
    {
      path:'/orderinfos',
      name:'orderinfos',
      component:()=>import("@/components/order/orderInfos")
    },
    {
      path:'/addAddress',
      name:'addAddress',
      component:()=>import("@/components/order/addAddress"),
      meta:{
        title:'新建收货地址'
      } 
    },
    {
      path:'/addressList',
      name:'addressList',
      component:()=>import("@/components/order/addressList"),
      meta:{
        title:'我的收货地址'
      } 
    },
    {
      path:'/invoiceTitle',
      name:'invoiceTitle',
      component:()=>import("@/components/order/invoiceTitle"),
      meta:{
        title:'添加发票抬头'
      } 
    },
    {
      path:'/invoiceDetail/:id',
      name:'invoiceDetail',
      component:()=>import("@/components/order/invoiceDetail"),
      meta:{
        title:'发票详情'
      } 
    },
    {
      path:'/invoiceList/:origin',
      name:'invoiceList',
      component:()=>import("@/components/order/invoiceList"),
      meta:{
        title:'全部发票抬头'
      } 
    },
    {
      path:'/phonelogin/:urlCode',
      name:'phonelogin',
      component:()=>import("@/components/login/phonelogin"),
      meta:{
        title:'登录'
      } 
    },
    {
      path:'/notice',
      name:'notice',
      component:()=>import("@/components/notice/notice"),
      meta:{
        title:'消息中心'
      } 
    },
    {
      path:'/notice/messages/:type',
      name:'messages',
      component:()=>import("@/components/notice/messages"),
      meta:{
        title:'通知消息'
      } 
    },
    {
      path:'/brandList',
      name:'brandList',
      component:()=>import("@/components/brandList"),
      meta:{
        title:'拼团'
      } 
    },
    {
      path:'/myZone',
      name:'myZone',
      component:()=>import("@/components/personal/myZone"),
      meta:{
        title:'个人中心'
      } 
    },
    {
      path:'/updateUserInfo',
      name:'updateUserInfo',
      component:()=>import("@/components/personal/updateUserInfo"),
      meta:{
        title:'修改个人信息'
      } 
    },
    {
      path:'/aboutUs',
      name:'aboutUs',
      component:()=>import("@/components/personal/aboutUs"),
      meta:{
        title:'关于我们'
      } 
    },
    {
      path:'/settings',
      name:'settings',
      component:()=>import("@/components/personal/settings"),
      meta:{
        title:'设置'
      } 
    },
    {
      path:'/collectList',
      name:'collectList',
      component:()=>import("@/components/personal/collectList"),
      meta:{
        title:'商品收藏'
      } 
    },
    {
      path:'/couponList',
      name:'couponList',
      component:()=>import("@/components/personal/couponList"),
      meta:{
        title:'全部优惠券'
      } 
    },
    {
      path:'/awaitPay',
      name:'awaitPay',
      component:()=>import("@/components/pay/awaitPay"),
      meta:{
        title:'待付款'
      } 
    },
    {
      path:'/payDetail/:origin/:sn',
      name:'payDetail',
      component:()=>import("@/components/pay/payDetail"),
      meta:{
        title:'订单详情'
      } 
    },
    {
      path:'/receiveDetail/:origin/:sn',
      name:'receiveDetail',
      component:()=>import("@/components/awaitReceive/receiveDetail"),
      meta:{
        title:'订单详情'
      } 
    },
    {
      path:'/commentDetail/:origin/:sn',
      name:'commentDetail',
      component:()=>import("@/components/awaitComment/commentDetail"),
      meta:{
        title:'订单详情'
      } 
    },
    {
      path:'/commentEdit/:orderSn/:productId',
      name:'commentEdit',
      component:()=>import("@/components/awaitComment/commentEdit"),
      meta:{
        title:'评价晒单'
      } 
    },
    {
      path:'/shareDetail/:origin/:sn',
      name:'shareDetail',
      component:()=>import("@/components/share/shareDetail"),
      meta:{
        title:'订单详情'
      } 
    },
    {
      path:'/feedback',
      name:'feedback',
      component:()=>import("@/components/personal/feedback"),
      meta:{
        title:'意见反馈'
      } 
    },
    {
      path:'/help',
      name:'help',
      component:()=>import("@/components/personal/help"),
      meta:{
        title:'使用帮助'
      } 
    },
    {
      path:'/deal',
      name:'deal',
      component:()=>import("@/components/personal/deal"),
      meta:{
        title:'服务协议'
      } 
    },
    {
      path:'/awaitshare',
      name:'awaitshare',
      component:()=>import("@/components/share/awaitshare"),
      meta:{
        title:'待分享'
      } 
    },
    {
      path:'/payOver',
      name:'payOver',
      component:()=>import("@/components/pay/payOver"),
      meta:{
        title:'支付成功'
      } 
    },
    {
      path:'/awaitReceive',
      name:'awaitReceive',
      component:()=>import("@/components/awaitReceive/receive"),
      meta:{
        title:'待收货'
      } 
    },
    {
      path:'/awaitComment',
      name:'awaitComment',
      component:()=>import("@/components/awaitComment/comments"),
      meta:{
        title:'待评价'
      } 
    },
  ]
})
