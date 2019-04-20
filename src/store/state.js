const state = {
  viewDirection:'',//页面滑动的方向
  showDialog1:false,//选择商品 弹框
  isNotice:false,
  searchList:[],//搜索商品列表
  detailBanner:[{listMedium:''}],
  addressIndex:0,//收货地址 下标
  times:{
    deliveryDate:'',
    deliveryTime:'',
  },
  invoiceTitle:'',
  currentVal: "", //配送方式 选中值
  imgUrl:'',
  imgPath:[],//回显图片
  blobs:[],//提交给后台的 blog 图片
  inputType:'file'
}
export default state;