import {reactive, computed, toRefs} from "vue";
import initDevtools from "./devTools";
 const isFunction = (fn) => typeof fn === "function";
 const isObject = (obj) => obj!== null && typeof obj === "object" && Array.isArray(obj) === false;
 const concatAllParams = (key,...rest)=>{
    const params = [].concat(rest)
    if(Array.isArray(key)){
        params.unshift(...key)
    } else {
        params.unshift(key)
    }
    return params.filter(e=>e&&e!=='')
}
const originState = {}
let _ZState = '[ZState warning] firstly,you should use defineState() to define a state'

export const installStore = {
    install(app) {
        app.config.globalProperties.$zState = _ZState
        initDevtools(app,_ZState)
    }
}
export const defineState = (state,getters)=>{
    _ZState = {
        state: {},
        getters: {}
    }
    if(isObject(state)){
        Object.assign(originState,state) // 保留原始state
        _ZState.state = reactive(state)
    } else {
        console.log('[ZState warning] you must define a state')
        return  false
    }

    if (isObject(getters) && Object.keys(getters).length > 0) {
        const keys = Object.keys(getters)
        const hasDuplicateKey = keys.some(key => key in state)
        if(hasDuplicateKey){
            console.log(`[ZState warning] some key is already defined in state,it will be overrided by storeToRefs`)
        }
        keys.forEach((key) => {
            if (isFunction(getters[key])) {
                const func = ()=> getters[key](_ZState.state);
                _ZState.getters[key] = computed(func);
            }
        });
    }
    return installStore
}
export const useState = (key,...rest)=>{
    const params = concatAllParams(key,...rest)
    const len = params.length
    const hasParams = len >= 0
    const hasKey = keyName => keyName in _ZState.state
    const getOne = keyName => hasKey(keyName) ? toRefs(_ZState.state)[keyName] : undefined
    if(len === 0){
        return _ZState.state
    }
    if(hasParams && params.some(e=>typeof e !== 'string')){
        console.error('use Function Alert: the key of use must be String or String Array')
        return
    }
    if (len === 1){
        return getOne(params[0])
    } else {
        return params.map(getOne)
    }
}
export const useGetters = (key,...rest)=>{
    if(Object.keys(_ZState.getters).length === 0){
        console.log(`[ZState warning] make sure you define getters`)
        return false
    }
    const params = concatAllParams(key,...rest)
    const len = params.length
    const hasParams = len >= 0
    const hasKey = keyName => keyName in _ZState.getters
    const getOne = keyName => hasKey(keyName) ? _ZState.getters[keyName] : undefined
    if(len === 0){
        return _ZState.getters
    }
    if(hasParams && params.some(e=>typeof e !== 'string')){
        console.error('use Function Alert: the key of use must be String or String Array')
        return
    }
    if (len === 1){
        return getOne(params[0])
    } else {
        return params.map(getOne)
    }
}
export const stateToRefs = () => {
    return {..._ZState.getters,...toRefs(_ZState.state)};
}
export const resetState = ()=>{
    Object.assign(_ZState.state,originState)
}
export const patchState = (desire)=>{
    if(isObject(desire)){
        Object.assign(_ZState.state,desire)
    } else if(isFunction(desire)){
        desire(_ZState.state)
    } else {
        console.log('[ZState warning] $patch function receive an object or a function')
    }
}
export default defineState
