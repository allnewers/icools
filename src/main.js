// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/common.css'
import './assets/css/dpr.css'
import 'swiper/dist/css/swiper.css'
import store from './store'
import Selects from "./components/common/select"
import Mint from 'mint-ui'
import filters from './filter'
import { Toast,Lazyload,InfiniteScroll,Spinner ,Picker ,Popup,Indicator} from 'mint-ui'
import VueImageSwipe from 'vue-image-swipe'
import 'vue-image-swipe/dist/vue-image-swipe.css'
Vue.use(VueImageSwipe)
Vue.component(Toast.name, Toast);
Vue.component(Spinner.name, Spinner);
Vue.component(Picker.name, Picker);
Vue.component(Popup.name, Popup);
Vue.use(Lazyload,{
  error:require('./assets/img/r404.png'),
  //loading:require('./assets/img/load.gif'),
});
Vue.use(InfiniteScroll);

Vue.use(Mint);
Vue.config.productionTip = false
//console.log(filters);
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]));
Vue.component('Selects',Selects)

//阻止浏览器默认行为
// Vue.prototype.mo = function (e) { 
//   if (event.cancelable) {
//   // 判断默认行为是否已经被禁用
//     if (!event.defaultPrevented) {
//         event.preventDefault();
//     }
//   } 
// }
// //弹出框禁止滑动
// Vue.prototype.noScroll = function () {
//   document.body.style.overflow = 'hidden'
//   document.addEventListener('touchmove', this.mo, { passive: false })// 禁止页面滑动
// }
// //弹出框可以滑动
// Vue.prototype.canScroll = function () {
//   document.body.style.overflow = ''// 出现滚动条
//   document.removeEventListener('touchmove', this.mo, { passive: false })
// }


/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
//全局守卫
router.beforeEach((to, from, next) => {
  //vm.canScroll()  ;//进入路由，初始化 弹框状态
  const slideRoute = ['search','addAddress']//需要slide效果的组件
  let direction = ''
  const toName = to.name    // 即将进入的路由名字
  const toIndex = slideRoute.indexOf(toName);
  Indicator.close();
  if(toIndex!='-1'){
    direction = 'right'
  }
  store.commit('setViewDirection',direction);  //这里使用vuex进行赋值

  next();
})
// alert(showDialog)
// vm.$watch(showDialog,(val)=>{
//   if (val === true) {
//     this.noScroll();
//   } else {
//     this.canScroll();
//   }
//   document.body.scrollTop = this.pageScrollYoffset;
//   window.scroll(0, this.pageScrollYoffset);
// })
