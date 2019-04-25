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
export function validIdNum(num) {//检验身份证号
    let reg = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2]\d)|(3[0-1]))((\d{4})|(\d{3}[Xx]))$/;
    let cardNo = num.replace(/\s/g, "");
    let val = reg.test(cardNo);
    if (val) {
        return true;
    } else {
        return false;
    }
}
export function validCreditCode(val) {
    let reg = /[0-9A-Za-z]{18}/;
    let vals = reg.test(val);
    return vals = vals ? true : false;
}
export function checkEmail(val) {
    let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
    let vals = reg.test(val);
    return vals = vals ? true : false;
}
export function toTop() {
    if (
        document.documentElement.scrollTop &&
        document.documentElement.scrollTop > 0
    ) {
        document.documentElement.scrollTop = 0;
    } else if (document.body.scrollTop && document.body.scrollTop > 0) {
        document.body.scrollTop = 0;
    } else {
        window.pageYOffset = 0;
    } //要做兼容 在模拟器能正常获取scrolltop在微信h5页面和手机的浏览器页面一直为0
}
export function getBrowser(getVersion) {//判断浏览器类型
    //注意关键字大小写
    var ua_str = navigator.userAgent.toLowerCase(),
        ie_Tridents,
        trident,
        match_str,
        ie_aer_rv,
        browser_chi_Type;
    //判断IE 浏览器,
    //blog: http://blog.csdn.net/aerchi/article/details/51697592
    if ("ActiveXObject" in self) {
        // ie_aer_rv:  指示IE 的版本.
        // It can be affected by the current document mode of IE.
        ie_aer_rv = (match_str = ua_str.match(/msie ([\d.]+)/))
            ? match_str[1]
            : (match_str = ua_str.match(/rv:([\d.]+)/))
                ? match_str[1]
                : 0;

        // ie: Indicate the really version of current IE browser.
        ie_Tridents = {
            "trident/7.0": 11,
            "trident/6.0": 10,
            "trident/5.0": 9,
            "trident/4.0": 8
        };
        //匹配 ie8, ie11, edge
        trident = (match_str = ua_str.match(/(trident\/[\d.]+|edge\/[\d.]+)/))
            ? match_str[1]
            : undefined;
        browser_chi_Type =
            (ie_Tridents[trident] || ie_aer_rv) > 0 ? "ie" : undefined;
    } else {
        //判断 windows edge 浏览器
        // match_str[1]: 返回浏览器及版本号,如: "edge/13.10586"
        // match_str[1]: 返回版本号,如: "edge"

        //若要返回 "edge" 请把下行的 "ie" 换成 "edge"。 注意引号及冒号是英文状态下输入的
        browser_chi_Type = (match_str = ua_str.match(/edge\/([\d.]+)/))
            ? "ie"
            : //判断firefox 浏览器
            (match_str = ua_str.match(/firefox\/([\d.]+)/))
                ? "firefox"
                : //判断chrome 浏览器
                (match_str = ua_str.match(/chrome\/([\d.]+)/))
                    ? "chrome"
                    : //判断opera 浏览器
                    (match_str = ua_str.match(/opera.([\d.]+)/))
                        ? "opera"
                        : //判断safari 浏览器
                        (match_str = ua_str.match(/version\/([\d.]+).*safari/))
                            ? "safari"
                            : undefined;
    }

    // console.log("author: aerchi, blog: http://blog.csdn.net/aerchi");

    //返回浏览器类型和版本号
    var verNum, verStr;
    verNum =
        trident && ie_Tridents[trident] ? ie_Tridents[trident] : match_str[1];

    verStr =
        getVersion != undefined
            ? browser_chi_Type + "/" + verNum
            : browser_chi_Type;
    return verStr;
}

export function isWeixin() {
    var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        //在微信中打开
        return true;
    }else{
        return false;
    }
}
export function GetRequest() {   
    var url = location.search; //获取url中"?"符后的字串   
    var theRequest = new Object();   
    if (url.indexOf("?") != -1) {   
       var str = url.substr(1);   
       strs = str.split("&");   
       for(var i = 0; i < strs.length; i ++) {   
          theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);   
       }   
    }   
    return theRequest;   
 }  
export function dataURItoBlob(base64Data) {
    var byteString;
    if (base64Data.split(",")[0].indexOf("base64") >= 0)
        byteString = atob(base64Data.split(",")[1]);
    else byteString = unescape(base64Data.split(",")[1]);
    var mimeString = base64Data
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
}

export function compress(img, imgType) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    let initSize = img.src.length;
    let width = img.width;
    let height = img.height;
    canvas.width = width;
    canvas.height = height;
    // 铺底色
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, width, height);
    //console.log("*******压缩前的图片大小*******");
    //console.log(initSize);
    //进行最小压缩
    let ndata = canvas.toDataURL("image/" + imgType, 0.1);
    //console.log("*******压缩后的图片大小*******");
    //console.log(ndata)
    //console.log(ndata.length);
    return ndata;
}
export const imgBaseUrl = 'http://eicools.oss-cn-beijing.aliyuncs.com/';