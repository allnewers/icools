import Axios from 'axios'
import { getCookie } from "../util";
Axios.defaults.baseURL = 'http://192.168.0.200:9898/';

function $fetch(method,url,data,params){
  return new Promise((reslove,reject)=>{
      Axios({
          method,
          url,
          data,
          params,
          headers:{
            'Content-Type' : 'application/json;charset=UTF-8'
          }
      }).then(res=>{
          let body = res.data
          reslove(body);
          // if (body.code == 200 || body.code == 201) {
          //     reslove(body)
          // }else{
          //     reject(body)
          // }
      }).catch(err=>{
          reject(err)
      })

  })
}
export const getIndexData = () => $fetch('get','homePage/details');
export const sendLoginCode = (params) => $fetch('get','sms/sendSms','',params);
export const signIn = (params) => $fetch('get','mobileLogin','',params);
export const getNoticeNum = (params) => $fetch('get','message/gropListMessageNum','',params);
export const getNoticeList = (params) => $fetch('get','message/gropListMessageCount','',params);
export const getNoticeDetail = (params) => $fetch('get','message/listMessagePage','',params);
export const getNavList = (params) => $fetch('get','search/getCategory','',params);
export const eachGoodsBuyList = (params) => $fetch('get','product/getGroupbuyingReoceds','',params);
export const updateGroupPrice = (params) => $fetch('get','product/refreshGroupProduct','',params);
export const updateSinglePrice = (params) => $fetch('get','product/refreshProduct','',params);
//需要 传token的 接口
export const search = (params) => $fetch('get','search/groupProductPage','',params);
export const searchTag = (params) => $fetch('get','search/getSearch','',params);
export const getDetail = (params) => $fetch('get','product/getGroupProductBySn','',params);
export const loginout = (params) => $fetch('get','logout','',params);
export const collectProduct = (params) => $fetch('get','product/addGroupFavorite','',params);
export const receiveAddress = (params) => $fetch('get','member/listReceiver','',params);
export const saveAddress = (params) => $fetch('get','member/saveReceiver','',params);
export const updateAddress = (params) => $fetch('get','member/updateReceiver','',params);
export const deleteAddress = (params) => $fetch('get','member/deleteReceiver','',params);

export const addInvoiceTitle = (params) => $fetch('get','member/saveInvoice','',params);
export const InvoiceTitleList = (params) => $fetch('get','member/listInvoice','',params);
export const collectList = (params) => $fetch('get','search/getGroupFavoriteProducts','',params);
export const updateInvoice = (params) => $fetch('get','member/updateInvoice','',params);
export const getInvoiceDetailById = (params) => $fetch('get','member/getInvoiceById','',params);
export const deleteInvoice = (params) => $fetch('get','member/deleteInvoice','',params);
export const updateUserInfo = (params) => $fetch('get','member/updateMemberInfo','',params);








