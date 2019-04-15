import { compress, dataURItoBlob, getCookie } from '../util'
import { updateAvatar,getAvatar,baseURL } from '../api'
import { Indicator } from "mint-ui";
import axios from 'axios'
let token = getCookie('token');
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
        formData.append('token',token)
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
  async getUserImg({commit},token){//刷新 vuex丢失，重新获取头像
    Indicator.open();
    let userRes = await getAvatar({
      token:token
    });
    console.log(userRes);
    if(userRes.result === true){ 
      commit('updateUserImg',userRes.data.imgUrl);
    }else{
      console.log(userRes.msg);
    }
    Indicator.close();
  },
}
export default actions;