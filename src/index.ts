
// @ts-ignore
import {reactive, computed, toRefs} from "vue";
import initDevtools from "./devTools";
import {isObject,concatAllParams,isFunction} from "./utils";
declare interface realState_type{
    state:{[key:string]:any};
    getters: { [key: string]: {value?:any} };
}
const originState = {}
const _State:realState_type = {
    state: {},
    getters: {}
}

const installStore = {
    install(app:any) {
        app.config.globalProperties.$ostate = _State
        initDevtools(app,_State)
    }
}
export const defineState = (state: {[key:string]:any},getters?:any)=>{

    if(isObject(state)){
        Object.assign(originState,state) // 保留原始state
        _State.state = reactive(state)
    } else {
        console.log('[onlyState warning] you must define a state')
    }

    if (isObject(getters) && Object.keys(getters).length > 0) {
        const keys:string[] = Object.keys(getters)
        const hasDuplicateKey:boolean = keys.some(key => key in state)
        if(hasDuplicateKey){
            console.log(`[OnlyState warning] some key is already defined in state,it will be overrided by storeToRefs`)
        }
        keys.forEach((key) => {
            if (isFunction(getters[key])) {
                const func = ()=> getters[key](_State.state);
                _State.getters[key] = computed(func);
            }
        });
    } else {
        console.log('[onlyState warning] why you do not need getters')
    }
    return installStore
}
export const useState = (key:string|string[],...rest:any[])=>{
    const params = concatAllParams(key,...rest)
    const len = params.length
    const hasParams = len >= 0
    const hasKey = (keyName:string) => keyName in _State.state
    const getOne = (keyName:string) => hasKey(keyName) ? toRefs(_State.state)[keyName] : <any>undefined
    if(len === 0){
        return _State.state
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
export const useGetters = (key:string|string[],...rest:any[])=>{
    if(!_State.getters){return undefined}
    if(Object.keys(_State.getters).length === 0){
        console.log(`[onlyState warning] make sure you define getters`)
        return false
    }
    const params = concatAllParams(key,...rest)
    const len = params.length
    const hasParams = len >= 0
    const hasKey = (keyName:string) => keyName in _State.getters
    const getOne = (keyName:string) => hasKey(keyName) ? _State.getters[keyName] : <any>undefined
    if(len === 0){
        return _State.getters
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
    const getters = _State.getters ? _State.getters : {}
    return {...getters,...toRefs(_State.state)};
}
export const resetState = ()=>{
    Object.assign(_State.state,originState)
}
export const patchState = (desire:any)=>{
    if(isObject(desire)){
        Object.assign(_State.state,desire)
    } else if(isFunction(desire)){
        desire(_State.state)
    } else {
        console.log('[onlyState warning] $patch function receive an object or a function')
    }
}
const OnlyState ={
    defineState,
    useState,
    useGetters,
    stateToRefs,
    resetState,
    patchState
}
export default OnlyState

