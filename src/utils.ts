export const isFunction = (fn:any) => typeof fn === "function";
export const isObject = (obj:any) => obj!== null && typeof obj === "object" && Array.isArray(obj) === false;
export const concatAllParams = (key:string|string[],...rest:any[])=>{
    const params = [].concat(<[]>rest)
    if(Array.isArray(key)){
        params.unshift(...<[]>key)
    } else {
        params.unshift(<never>key)
    }
    return params.filter(e=>e&&e!=='')
}

