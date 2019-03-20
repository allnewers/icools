export function getCookie(name) {//获取cookie
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
export function setCookie(c_name, value, expiredays) {//设置cookie
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
};

export function delCookie(name) {//删除cookie
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
export function CookieEnable() {//检测浏览器cookie 是否被禁用
    var result = false;
    if (navigator.cookiesEnabled) return true;

    document.cookie = "testcookie=yes;";

    var cookieSet = document.cookie;

    if (cookieSet.indexOf("testcookie=yes") > -1) result = true;

    delCookie('testcookie');

    return result;
} 
export function validIdNum( num ){//检验身份证号
    let reg = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2]\d)|(3[0-1]))((\d{4})|(\d{3}[Xx]))$/;
    let cardNo = num.replace(/\s/g, "");
    let val=reg.test(cardNo);
    if(val){
        return true;
    }else{
        return false;
    }
}
export function validCreditCode(val){
    let reg =/[0-9A-Za-z]{18}/;
    let vals = reg.test(val);
    return vals = vals?true:false;
}
export function checkEmail(val){
    let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
    let vals = reg.test(val);
    return vals = vals?true:false;
  }
export const imgBaseUrl = 'http://eicools.oss-cn-beijing.aliyuncs.com/';