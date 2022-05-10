export const isFunction = (fn) => typeof fn === "function";
export const isObject = (obj) => obj!== null && typeof obj === "object" && Array.isArray(obj) === false;
export const concatAllParams = (key,...rest)=>{
    const params = [].concat(rest)
    if(Array.isArray(key)){
        params.unshift(...key)
    } else {
        params.unshift(key)
    }
    return params.filter(e=>e&&e!=='')
}
