import Vue from 'vue'
import Vuex from 'vuex'

import state from './state' // 导入适用于Vuex的 state（状态）文件
import mutations from './mutations' // 导入适用于Vuex的 mutations（事件）文件
import actions from './actions' 

Vue.use(Vuex)
export default new Vuex.Store({
  state,
  mutations,
  actions
})