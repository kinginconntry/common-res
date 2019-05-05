/**
 * 工具模块
 */

let Storage = function (storage) {
    this.storage = storage
    this.storageSupport = !!this.storage
    this.set = function (key, value, expireTime) {
        let result = false
        if (!this.storageSupport || !key || !value) {
            return result
        }
        let data = {
            value: value
        }
        if (expireTime) {
            // 存在
            if (Object.prototype.toString.call((expireTime)) === '[object Number]') {
                // 秒数
                let now = new Date()
                // 毫秒数
                let timestamp = now.getTime()
                data['expireTime'] = timestamp + expireTime * 1000
            } else if (Object.prototype.toString.call((expireTime)) === '[object Date]') {
                // 定点时间
                let timestamp = expireTime.getTime()
                data['expireTime'] = timestamp
            }
        }
        data = JSON.stringify(data)
        try {
            this.storage.setItem(key, data)
            result = true
        } catch (e) {
            console.log('存储出错，异常信息：' + e)
        }
        return result
    }
    this.get = function (key) {
        if (!this.storageSupport || !key) {
            return undefined
        }
        let data = this.storage.getItem(key)
        if (!!key && !!data) {
            // 存在
            data = JSON.parse(data)
            let nowTimestamp = new Date().getTime()
            let expireTime = data['expireTime']
            if (!expireTime) {
                // 不存在
                data = data['value']
            } else if (nowTimestamp <= expireTime) {
                // 没过期
                data = data['value']
            } else {
                // 过期了
                this.remove(key)
                data = undefined
            }
        } else {
            data = undefined
        }
        return data
    }
    this.remove = function (key) {
        if (!this.storageSupport || !key) {
            return false
        }
        this.storage.removeItem(key)
        return true
    }
    this.clear = function () {
        if (!this.storageSupport) {
            return false
        }
        this.storage.clear()
        return true
    }
    return this
}
let StorageUtils = {
    sessionStorage: new Storage(window.sessionStorage),
    localStorage: new Storage(window.localStorage)
}

let ApiRequest = {
    host: '',
    beforeSend: undefined,
    setAjaxFilter(config){
        if(config !== undefined){
            $.ajaxSetup(config || {
                complete: function (XMLHttpRequest, textStatus) {
                    //通过XMLHttpRequest取得响应头，sessionstatus，
                    if(XMLHttpRequest.status !== 200){
                        console.error('请求错误', XMLHttpRequest.status)
                    }else{
                        let res = XMLHttpRequest.responseJSON;
                        if(res !== undefined){
                            let redirect = res.data;
                            let errorCode = res.error;
                            if(errorCode === '301' || errorCode === '302'){
                                // 重定向
                                window.location.href = redirect;
                            }
                        }
                    }

                }
            });
        }
    },
    getUrl(url){
        if(!url.startsWith("http") && this.host !== ''){
            url = this.host + url;
        }
        return url;
    },
    requestJson(url, method, success, error, beforeSend){
        url = this.getUrl();
        $.ajax({
            url: url,
            type: method,
            contentType: 'application/json',
            dataType: 'json',
            beforeSend: this.beforeSend || beforeSend || function () {},
            success: function (res) {
                success && success(res);
            },
            error: function (err) {
                (error && error(err));
            }
        });
    },
    getJson(url, success, error, beforeSend){
        this.requestJson(url, 'get', success, error, beforeSend);
    },
    postJson(url, data, success, fail, error, beforeSend){
        this.requestJson(url, 'post', success, error, beforeSend);
    }
}

let CommonUtils = {
    /**
     * 是否为本地域名
     * @param containHosts
     * @returns {boolean}
     */
    isLocal(containHosts){
        if(containHosts){
            if(containHosts.indexOf(window.location.host) > -1){
                return true;
            }else{
                return false;
            }
        }else{
            return ["127.0.0.1", "localhost", "0.0.0.0"].indexOf(window.location.hostname) > -1;
        }
    },
    /**
     * 是否为空对象
     * @param data
     * @returns {(boolean|arg is Array<any>)|boolean}
     */
    isEmpty(data){
        return !data || (Array.isArray(data) && data.length() === 0) || JSON.stringify(data) === '{}';
    },
    /**
     * 将老对象的数据复制到新对象中，返回新对象
     * @param oldObj 老对象
     * @param newObj 新对象
     * @returns {*}
     */
    copy(oldObj, newObj){
        if(!newObj){
            newObj = {}
        }
        if(!oldObj){
            oldObj = {}
        }
        for(let key in oldObj){
            newObj[key] = oldObj[key];
        }
        return newObj;
    },
    /**
     * 深度复制对象
     * @param data
     * @returns {*}
     */
    deepCopy(data){
        if(data === undefined || data === null){
            return data
        }
        let copy = JSON.parse(JSON.stringify(data));
        return copy;
    },
    getCookies: function (key) {
        var cookiesMap = {};
        var cookiesArr = document.cookie.split(";");
        if (cookiesArr) {
            for (let i = 0, len = cookiesArr.length; i < len; i++) {
                let cookieArr = cookiesArr[i].split("=");
                if (cookieArr.length === 2) {
                    cookiesMap[cookieArr[0]] = cookieArr[1];
                } else if (cookieArr.length === 2) {
                    cookiesMap[cookieArr[0]] = '';
                }
            }
        }
        if (key) {
            return cookiesMap[key];
        } else {
            return cookiesMap;
        }
    }
}

export default {
    StorageUtils,
    CommonUtils,
    ApiRequest
};
