import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      redirect:'/home'
    },
    {
      path: '/home',
      name: 'GBindex',
      component: ()=>import("@/components/groupBuyIndex")
    },
    {
      path:'/search',
      name:'search',
      component:()=>import("@/components/search/search")
    },
    {
      path:'/tuanList/:keyword',
      name:'tuanList',
      component:()=>import("@/components/search/tuanList")
    },
    {
      path:'/proList/:id',
      name:'proList',
      component:()=>import("@/components/proList")
    },
    {
      path:'/detail/:sn',
      name:'detail',
      component:()=>import("@/components/detail")
    },
    {
      path:'/comments/:goodsId',
      name:'comments',
      component:()=>import("@/components/comments")
    },
    {
      path:'/game',
      name:'game',
      component:()=>import("@/components/game")
    },
    {
      path:'/order',
      name:'order',
      component:()=>import("@/components/order/order")
    },
    {
      path:'/payType',
      name:'payType',
      component:()=>import("@/components/pay/payType") 
    },
    {
      path:'/orderinfos',
      name:'orderinfos',
      component:()=>import("@/components/order/orderInfos")
    },
    {
      path:'/addAddress',
      name:'addAddress',
      component:()=>import("@/components/order/addAddress")
    },
    {
      path:'/addressList',
      name:'addressList',
      component:()=>import("@/components/order/addressList")
    },
    {
      path:'/invoiceTitle',
      name:'invoiceTitle',
      component:()=>import("@/components/order/invoiceTitle")
    },
    {
      path:'/invoiceDetail/:id',
      name:'invoiceDetail',
      component:()=>import("@/components/order/invoiceDetail")
    },
    {
      path:'/invoiceList/:origin',
      name:'invoiceList',
      component:()=>import("@/components/order/invoiceList")
    },
    {
      path:'/phonelogin/:urlCode',
      name:'phonelogin',
      component:()=>import("@/components/login/phonelogin")
    },
    {
      path:'/notice',
      name:'notice',
      component:()=>import("@/components/notice/notice"),
    },
    {
      path:'/notice/messages/:type',
      name:'messages',
      component:()=>import("@/components/notice/messages")
    },
    {
      path:'/brandList',
      name:'brandList',
      component:()=>import("@/components/brandList")
    },
    {
      path:'/myZone',
      name:'myZone',
      component:()=>import("@/components/personal/myZone")
    },
    {
      path:'/updateUserInfo',
      name:'updateUserInfo',
      component:()=>import("@/components/personal/updateUserInfo")
    },
    {
      path:'/aboutUs',
      name:'aboutUs',
      component:()=>import("@/components/personal/aboutUs")
    },
    {
      path:'/settings',
      name:'settings',
      component:()=>import("@/components/personal/settings")
    },
    {
      path:'/collectList',
      name:'collectList',
      component:()=>import("@/components/personal/collectList")
    },
    {
      path:'/couponList',
      name:'couponList',
      component:()=>import("@/components/personal/couponList")
    },
    {
      path:'/awaitPay',
      name:'awaitPay',
      component:()=>import("@/components/pay/awaitPay")
    },
    {
      path:'/payDetail/:origin/:sn',
      name:'payDetail',
      component:()=>import("@/components/pay/payDetail")
    },
    {
      path:'/feedback',
      name:'feedback',
      component:()=>import("@/components/personal/feedback")
    },
    {
      path:'/help',
      name:'help',
      component:()=>import("@/components/personal/help")
    },
    {
      path:'/deal',
      name:'deal',
      component:()=>import("@/components/personal/deal")
    },
    {
      path:'/awaitshare',
      name:'awaitshare',
      component:()=>import("@/components/share/awaitshare")
    },
    {
      path:'/payOver',
      name:'payOver',
      component:()=>import("@/components/pay/payOver")
    },
  ]
})
