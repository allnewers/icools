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
      path:'/comments',
      name:'comments',
      component:()=>import("@/components/comments")
    },
    {
      path:'/game',
      name:'game',
      component:()=>import("@/components/game")
    },
    {
      path:'/order/:productId/:thumbnail/:sum/:title/:price',
      name:'order',
      component:()=>import("@/components/order/order")
    },
    {
      path:'/payType',
      name:'payType',
      component:()=>import("@/components/payType") 
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
      path:'/invoiceList',
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
  ]
})
