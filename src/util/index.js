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