let noop = function(){};

let objectToQuery = function(o) {
    if (!o) return '';
    if (o instanceof window.FormData) return o;
    let paramsArr = [];
    if (o==null || o==undefined || typeof o=='string' || typeof o=='number')
        return o;
    for (let key in o) {
        paramsArr.push([key,encodeURIComponent(o[key])]);
    }
    return paramsArr.map(function(item){return [item[0]+'='+item[1]]}).join('&');
};

let request = function(data) {
    let abortTmr = null;
    let resolved = false;
    data.method = data.method || 'get';
    if (data.data && data.method=='get') data.url+='?'+objectToQuery(data.data);
    let xhr=new XMLHttpRequest();
    let resolveFn = noop, rejectFn = noop;
    let promise = new PromiseLight(function(resolve,reject){
            resolveFn = resolve;
            rejectFn = reject;
        });
    xhr.onreadystatechange=function() {
        if (xhr.readyState==4) {
            if ( xhr.status==200 || xhr.status==0) {
                let resp = JSON.parse(xhr.responseText);
                if (data.success) data.success(resp);
                resolveFn(resp);
            } else {
                if (data.error) data.error({status:xhr.status,error:xhr.statusText});
                rejectFn(xhr.statusText);
            }
            clearTimeout(abortTmr);
            resolved = true;
        }
    };
    xhr.open(data.method,data.url,true);
    if (data.requestType) {
        if (data.requestType!='multipart/form-data') // at this case header needs to be auto generated
            xhr.setRequestHeader("Content-Type", data.requestType);
    } else {
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    }
    if (data.requestType=='application/json')
        data.data = data.data && JSON.stringify(data.data);
    xhr.send(data.data);
    if (data.timeout) {
        abortTmr = setTimeout(function(){
            if (resolved) return;
            xhr.abort();
            if (data.ontimeout) data.ontimeout();
            rejectFn('timeout');
        },data.timeout);
    }
    return promise;
};


let get = function(url,data,success,error){
    return request({
        method:'get',
        url,
        data,
        success,
        error
    });
};

let post = function(url,data,success,error){
    return request({
        method:'post',
        url,
        data,
        requestType:'application/json',
        success,
        error
    });
};

let postMultiPart = function(url,file,data,success,error){
    let formData = new FormData();
    Object.keys(data).forEach(function(key){
        formData.append(key,data[key]);
    });
    formData.append('file',file);
    formData.append('fileName',file.name);
    return request({
        method:'post',
        url,
        data: formData,
        requestType:'multipart/form-data',
        success,
        error
    });
};

export default {get,post,postMultiPart};