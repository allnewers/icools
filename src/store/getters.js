const getters = {
  bannerImgList(state){
    let arr = state.detailBanner;
    let data = [];
    arr.forEach(element => {
      data.push('http://eicools.oss-cn-beijing.aliyuncs.com/'+element.large);
    });
    return data;
  }
}
export default getters;