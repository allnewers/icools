import Axios from 'axios'
import { getCookie } from "../util";
import { Toast } from 'mint-ui'
import qs from 'qs'
//Axios.defaults.baseURL = 'http://192.168.0.200:9898/';
let instance = Axios.create({
  //baseURL: 'http://192.168.0.200:9898/',//内部服务器
  //baseURL:'http://2443934eq9.qicp.vip:29031/'
  //baseURL:'http://tuan.eicools.com:9898/'
  baseURL:'http://app.icools.com/'////正式环境
  //baseURL:'http://test.app.icools.com/'////测试服务器环境
});
//let baseURLs='http://192.168.0.200:9898/';
//let baseURLs='http://2443934eq9.qicp.vip:29031/';//付永花生壳
//let baseURLs = 'http://eic.natapp1.cc/';
function $fetch(method, url, data, params) {
  return new Promise((reslove, reject) => {
    instance({
      method,
      url,
      data,
      params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      transformRequest: [function (data) {
        return qs.stringify(data);
      }],
    }).then(res => {
      let body = res.data
      reslove(body);
      // if (body.code == 200 || body.code == 201) {
      //     reslove(body)
      // }else{
      //     reject(body)
      // }
    }).catch(err => {
      reject(err)
    })

  })
}

function $fetch1(method, url, data, params,header) {
  return new Promise((reslove, reject) => {
    instance({
      method,
      url,
      data,
      params,
      headers:header?header : {
        //'multipart/form-data;'
        //application/json
        'Content-Type': 'application/json'
      },
      // transformRequest: [
      //   function (data) { // 解决传递数组变成对象的问题
      //     data = qs.stringify(data,{ indices: false }) // 这里必须使用qs库进行转换
      //     return data
      //   }
      // ],
    }).then(res => {
      let body = res.data;
      //reslove(body);
      if (body.result === true) {
        reslove(body.data);
      }else{
        Toast(body.msg);
        reslove(body);
      }
    }).catch(err => {
      reject(err)
    })

  })
}


function $axiosPost(url, data) {
  return new Promise((reslove, reject) => {
    Axios.post(url, data).then(res => {
      let body = res.data
      reslove(body);
    }).catch(err => {
      reject(err)
    });
  });
}
//export const baseURL = 'http://192.168.0.200:9898/';
//export const baseURL = 'http://tuan.eicools.com:9898/'
//export const baseURL = 'http://2443934eq9.qicp.vip:29031/'
//export const baseURL = 'http://test.app.icools.com/'//测试服务器环境
export const baseURL = 'http://app.icools.com/'//正式环境
export const getIndexData = () => $fetch('get', 'homePage/details');
export const sendLoginCode = (params) => $fetch('get', 'sms/sendSms', '', params);
export const signIn = (params) => $fetch('get', 'mobileLogin', '', params);
export const getNoticeNum = (params) => $fetch('get', 'message/gropListMessageNum', '', params);
export const getNoticeList = (params) => $fetch('get', 'message/gropListMessageCount', '', params);
export const getNoticeDetail = (params) => $fetch('get', 'message/listMessagePage', '', params);
export const getNavList = (params) => $fetch('get', 'search/getCategory', '', params);
export const eachGoodsBuyList = (params) => $fetch('get', 'product/getGroupbuyingReoceds', '', params);
export const updateGroupPrice = (params) => $fetch('get', 'product/refreshGroupProduct', '', params);
export const updateSinglePrice = (params) => $fetch('get', 'product/refreshProduct', '', params);
export const getOrderInfo = (params) => $fetch('get', 'product/productInfoBrief', '', params);
export const getShipInfo = (params) => $fetch('get', 'order/ordershipinfo', '', params);
export const getCommentsNum = (params) => $fetch('get', 'product/getReviewCount', '', params);
export const wxShareConfig = (params) => $fetch('get', 'share/wx', '', params);

export const wxOpenId = (data) => $fetch('post', 'order/openid',data,'');
export const tuanAvatars = (params) => $fetch('get', 'order/returnpaysuccess', '', params);
//需要 传token的 接口
export const search = (params) => $fetch('get', 'search/groupProductPage', '', params);
export const searchTag = (params) => $fetch('get', 'search/getSearch', '', params);
export const getDetail = (params) => $fetch('get', 'product/getGroupProductBySn', '', params);
export const loginout = (params) => $fetch('get', 'logout', '', params);
export const collectProduct = (params) => $fetch('get', 'product/addGroupFavorite', '', params);
export const receiveAddress = (params) => $fetch('get', 'member/listReceiver', '', params);
export const saveAddress = (params) => $fetch('get', 'member/saveReceiver', '', params);
export const updateAddress = (params) => $fetch('get', 'member/updateReceiver', '', params);
export const deleteAddress = (params) => $fetch('get', 'member/deleteReceiver', '', params);
export const updateDefaultAddress = (params) => $fetch('get', 'member/setDefaultReceiver', '', params);

export const addInvoiceTitle = (params) => $fetch('get', 'member/saveInvoice', '', params);
export const InvoiceTitleList = (params) => $fetch('get', 'member/listInvoice', '', params);
export const collectList = (params) => $fetch('get', 'search/getGroupFavoriteProducts', '', params);
export const updateInvoice = (params) => $fetch('get', 'member/updateInvoice', '', params);
export const getInvoiceDetailById = (params) => $fetch('get', 'member/getInvoiceById', '', params);
export const deleteInvoice = (params) => $fetch('get', 'member/deleteInvoice', '', params);
export const updateUserInfo = (params) => $fetch('get', 'member/updateMemberInfo', '', params);
export const getAllCoupon = (params) => $fetch('get', 'coupon/searchRepCouponPage', '', params);
export const saveOrderGroup = (params) => $fetch('get', 'order/addGroupOrder', '', params);
export const saveOrderSingle = (params) => $fetch('get', 'order/createProductOrder', '', params);
export const aliPayTest = (params) => $fetch('get', 'order/test', '', params);
export const getCommentList = (params) => $fetch('get', 'product/listReview', '', params);

export const awaitXX = (params) => $fetch('get', 'order/listGroupOrder', '', params);
export const orderDetail = (params) => $fetch('get', 'order/viewOrder', '', params);
export const getAvatar = (params) => $fetch('get', 'member/getMemberInfo', '', params);
export const updateAvatar = (data) => $axiosPost(baseURL+'member/updateMemberImage', data);

//export const payOrder = (data) => $axiosPost(baseURLs+'order/payOrderForH5', data);

export const payOrder = (data) => $fetch('post','order/payOrderForH5',data);
export const getOrderPrice = (params) => $fetch('get', 'order/orderPrice', '', params);
export const checkOrderPayStatus = (data) => $fetch('post','order/checkPayment',data);
export const goodsOrderConfirm = (params) => $fetch('get','order/confirmRec','',params);

export const wxPayment = (data) => $fetch('post','order/payOrderForWXJSAPI',data,'');

export const feedBacks = (params) => $fetch('get','member/addSuggestion','',params);
export const initOrderNums = (params) => $fetch('get','order/getOrderNum','',params);
//分享点击次数
export const shareClickTimes = (params) => $fetch('get','order/share','',params);
//微信分享 5次 自动拼团成功
export const sendweixinCode = (params) => $fetch('get','order/weixinShare','',params);

export const sendLoginCode1 = (params) => $fetch1('get', 'sms/sendSms', '', params);
//店员注册
export const sellerSign = (params) => $fetch1('get', 'member/register', '', params);
//发送微信授权码
export const sendWxCode = (params) => $fetch1('get', 'member/getEmpNo', '', params);
//微信授权查询 用户
export const sendWeixinCode = (params) => $fetch1('get', 'member/getMemberIdByWX', '', params);
//查询--用户的实物抵用券列表查询接口
export const getCouponList = (data) => $fetch1('post', 'client/user/exchange_coupon/query/userlist/activityId', data);
//微信号 绑定手机号
export const bindMobileToWx = (params) => $fetch1('get', 'member/mergeMember', '', params);






