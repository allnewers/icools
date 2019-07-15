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
  },
  changeAddressIndex(state,newVal){
    state.addressIndex = newVal;
  },
  changeInvoiceTitle(state,newVal){
    state.invoiceTitle = newVal;
  },
  setDeliveryType(state,newVal){
    state.currentVal = newVal;
  },
  updateUserImg(state,newVal){
    //console.log(newVal);
    state.imgUrl = newVal
  },
  redisplay(state,newVal){
    state.imgPath.push(newVal);
  },
  saveBlobs(state,newVal){
    state.blobs.push(newVal);
  },
  changeInputType(state,newVal){
    state.inputType = newVal;
  }
  
}
export default mutations;