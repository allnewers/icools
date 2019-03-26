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
export const imgBaseUrl = 'http://eicools.oss-cn-beijing.aliyuncs.com/';