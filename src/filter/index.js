const filter = {
  toFixed(val) {
    if(val!='' && val!=null && val!=undefined){
      return parseInt(val);
    }else{
      return 0;
    }
  }
}
export default filter;