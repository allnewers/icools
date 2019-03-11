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
      component:()=>import("@/components/search")
    },
    {
      path:'/tuanList/:keyword',
      name:'tuanList',
      component:()=>import("@/components/tuanList")
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
      path:'/order',
      name:'order',
      component:()=>import("@/components/order")
    },
    {
      path:'/payType',
      name:'payType',
      component:()=>import("@/components/payType")
    },
    {
      path:'/orderinfos',
      name:'orderinfos',
      component:()=>import("@/components/orderInfos")
    },
    {
      path:'/login/:urlCode',
      name:'login',
      component:()=>import("@/components/login")
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
      component:()=>import("@/components/myZone")
    },
  ]
})
