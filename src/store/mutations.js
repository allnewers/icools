const mutations = {
  setViewDirection(state,newVal){
    state.viewDirection = newVal;
  },
  toggleDialog(state,newVal){//切换 购物选择 弹框状态
    state.showDialog1 = newVal;
  },
  changeNotice(state,newVal){
    state.isNotice =  newVal;
  },
  changeSearchList(state,newVal){
    state.searchList = newVal;
  },
  changeDetailBanner(state,newVal){
    state.detailBanner = newVal;
  }
}
export default mutations;