import { compress, dataURItoBlob, getCookie } from '../util'
import { updateAvatar,getAvatar,baseURL } from '../api'
import { Indicator } from "mint-ui";
import axios from 'axios'
let token = getCookie('token');
let imgArr = [];

const actions = {
  uploadImg({commit,state}) {
    Indicator.open({
      text: '上传中...',
      spinnerType: 'fading-circle'
    });
    let file = event.currentTarget.files[0]; //获取文件
    //console.log(file);
    let imgType = file.type.split('/')[1].toUpperCase();
    if (!/image\/\w+/.test(file.type)) {//检验是否上传的是图片格式
      alert("请选择图片上传");
      return false;
    }
    if (imgType != 'JPEG' && imgType != "PNG" && imgType != "JPG" && imgType != "GIF") {
      alert('请上传jpeg、png、gif类型图片');
      return false;
    }

    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = function () {
      let img = new Image;
      img.src = this.result;
      img.onload = function () {
        let datas = compress(img, imgType);//压缩图片base64
        //console.log(datas.length);
        let blob = dataURItoBlob(datas);//转为blob对象

        //console.log("*******base64转blob对象******");
        //console.log(blob);
        let config = { 'Content-Type': 'multipart/form-data' };
        var formData = new FormData();
        
        formData.append("imgUrl", blob);
        formData.append('token',token);
        //console.log("********将blob对象转成formData对象********");
        //console.log(formData.get("imgUrl"));
        //console.log(token);
        updateAvatar(formData).then(res => {
            console.log(res);
            if(res.result === true){
              commit('updateUserImg',res.data);
            }
            Indicator.close();
          }).catch();
        // axios.post('http://2443934eq9.qicp.vip:29031/member/updateMemberImage',formData).then(res=>{
        //   console.log(res);
        //   if(res.data.result === true){
        //     commit('updateUserImg',res.data.data);
        //   }
        //   Indicator.close();
        // }).catch();
      }
    }
  },
  async getUserImg({commit},[token,_this]){//刷新 vuex丢失，重新获取头像
    Indicator.open();
    let userRes = await getAvatar({
      token:token
    });
    //console.log(userRes);
    if(userRes.errorCode == 10){
      _this.$router.push({
        name: "phonelogin",
        params: { urlCode: "myZone" }
      });
    }
    if(userRes.result === true){ 
      commit('updateUserImg',userRes.data.imgUrl);
    }else{
      console.log(userRes.msg);
    }
  },
  
  commentsUpload({commit,state},[_this,doc]){
    //Indicator.open();
    let len = state.imgPath.length;
    //console.log(len);
    if(len>=4){
      _this.$toast('最多可上传4张图片~');
      return;
    }
    let file = event.currentTarget.files[0];
    if(!file) return;
    let imgType = file.type.split('/')[1].toUpperCase();
    if (!/image\/\w+/.test(file.type)) {//检验是否上传的是图片格式
      alert("请选择图片上传");
      return false;
    }
    if (imgType != 'JPEG' && imgType != "PNG" && imgType != "JPG" && imgType != "GIF") {
      alert('请上传jpeg、png、gif类型图片');
      return false;
    }
    //console.log(file);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    let urlimg = window.URL.createObjectURL(file);
    reader.onloadend = function () {
      let img = new Image;
      img.src = this.result;
      img.onload = function () {
        let datas = compress(img, imgType);//压缩图片base64
        //console.log(datas.length);
        let blob = dataURItoBlob(datas);//转为blob对象
        //imgArr.push(blob);
        //console.log("*******base64转blob对象******");
        //console.log(blob);
        
        commit('redisplay',urlimg);//前端回显图片
        commit('saveBlobs',blob);//提交给后台的blog格式图片
        // commit('changeInputType','text');
        // commit('changeInputType','file');
        //console.log(state.imgPath);
        //console.log(imgArr);
        //console.log("********将blob对象转成formData对象********");
        //console.log(formData_comments.get('imgUrl'));
      }
    }
    doc.querySelector('.uploadimg').value = '';//多次上传同一张图片
  },
  deleteImg({commit,state},index){
    state.imgPath.splice(index,1);
    state.blobs.splice(index,1);
  },
  submitComments({commit,state},[data,_this]){
    //console.log(data,'---',_this);return;
    Indicator.open();
    let formData_comments = new FormData();
    //return;
    let {token,sn,productId,score,depictScore,sellerScore,shippingScore,content,isAnonymous} = data;
    //let keys = Object.keys(data);
    for(let i=0;i<state.blobs.length;i++){
      formData_comments.append('imgUrl', state.blobs[i]);
    }
    formData_comments.append('token',token);
    formData_comments.append('sn',sn);
    formData_comments.append('productId',productId);
    formData_comments.append('score',score);
    formData_comments.append('depictScore',depictScore);
    formData_comments.append('sellerScore',sellerScore);
    formData_comments.append('shippingScore',shippingScore);
    formData_comments.append('content',content);
    formData_comments.append('isAnonymous',isAnonymous);
    axios.post(baseURL+'product/addReview',formData_comments).then(res=>{
      //console.log(res);return;
      if(res.data.result === true){ 
        Indicator.close();
        _this.$toast({message:'评论成功！',duration:1000});
        setTimeout(()=>{
          _this.$router.push('/');
        },1000);
      }else{
        alert(res.data.msg);
      }
     }).catch(err=>{

     });
  }
}
export default actions;