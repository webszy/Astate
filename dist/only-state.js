/*
* only-state.js 0.0.7
* author:webszy
* date:2022/5/11 上午10:26:42
*/
import { reactive, computed, toRefs } from 'vue';

function getDevtoolsGlobalHook() {
    return getTarget().__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
function getTarget() {
    // @ts-ignore
    return (typeof navigator !== 'undefined' && typeof window !== 'undefined')
        ? window
        : typeof global !== 'undefined'
            ? global
            : {};
}
const isProxyAvailable = typeof Proxy === 'function';

const HOOK_SETUP = 'devtools-plugin:setup';
const HOOK_PLUGIN_SETTINGS_SET = 'plugin:settings:set';

let supported;
let perf;
function isPerformanceSupported() {
    var _a;
    if (supported !== undefined) {
        return supported;
    }
    if (typeof window !== 'undefined' && window.performance) {
        supported = true;
        perf = window.performance;
    }
    else if (typeof global !== 'undefined' && ((_a = global.perf_hooks) === null || _a === void 0 ? void 0 : _a.performance)) {
        supported = true;
        perf = global.perf_hooks.performance;
    }
    else {
        supported = false;
    }
    return supported;
}
function now() {
    return isPerformanceSupported() ? perf.now() : Date.now();
}

class ApiProxy {
    constructor(plugin, hook) {
        this.target = null;
        this.targetQueue = [];
        this.onQueue = [];
        this.plugin = plugin;
        this.hook = hook;
        const defaultSettings = {};
        if (plugin.settings) {
            for (const id in plugin.settings) {
                const item = plugin.settings[id];
                defaultSettings[id] = item.defaultValue;
            }
        }
        const localSettingsSaveId = `__vue-devtools-plugin-settings__${plugin.id}`;
        let currentSettings = Object.assign({}, defaultSettings);
        try {
            const raw = localStorage.getItem(localSettingsSaveId);
            const data = JSON.parse(raw);
            Object.assign(currentSettings, data);
        }
        catch (e) {
            // noop
        }
        this.fallbacks = {
            getSettings() {
                return currentSettings;
            },
            setSettings(value) {
                try {
                    localStorage.setItem(localSettingsSaveId, JSON.stringify(value));
                }
                catch (e) {
                    // noop
                }
                currentSettings = value;
            },
            now() {
                return now();
            },
        };
        if (hook) {
            hook.on(HOOK_PLUGIN_SETTINGS_SET, (pluginId, value) => {
                if (pluginId === this.plugin.id) {
                    this.fallbacks.setSettings(value);
                }
            });
        }
        this.proxiedOn = new Proxy({}, {
            get: (_target, prop) => {
                if (this.target) {
                    return this.target.on[prop];
                }
                else {
                    return (...args) => {
                        this.onQueue.push({
                            method: prop,
                            args,
                        });
                    };
                }
            },
        });
        this.proxiedTarget = new Proxy({}, {
            get: (_target, prop) => {
                if (this.target) {
                    return this.target[prop];
                }
                else if (prop === 'on') {
                    return this.proxiedOn;
                }
                else if (Object.keys(this.fallbacks).includes(prop)) {
                    return (...args) => {
                        this.targetQueue.push({
                            method: prop,
                            args,
                            resolve: () => { },
                        });
                        return this.fallbacks[prop](...args);
                    };
                }
                else {
                    return (...args) => {
                        return new Promise(resolve => {
                            this.targetQueue.push({
                                method: prop,
                                args,
                                resolve,
                            });
                        });
                    };
                }
            },
        });
    }
    async setRealTarget(target) {
        this.target = target;
        for (const item of this.onQueue) {
            this.target.on[item.method](...item.args);
        }
        for (const item of this.targetQueue) {
            item.resolve(await this.target[item.method](...item.args));
        }
    }
}

function setupDevtoolsPlugin(pluginDescriptor, setupFn) {
    const descriptor = pluginDescriptor;
    const target = getTarget();
    const hook = getDevtoolsGlobalHook();
    const enableProxy = isProxyAvailable && descriptor.enableEarlyProxy;
    if (hook && (target.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !enableProxy)) {
        hook.emit(HOOK_SETUP, pluginDescriptor, setupFn);
    }
    else {
        const proxy = enableProxy ? new ApiProxy(descriptor, hook) : null;
        const list = target.__VUE_DEVTOOLS_PLUGINS__ = target.__VUE_DEVTOOLS_PLUGINS__ || [];
        list.push({
            pluginDescriptor: descriptor,
            setupFn,
            proxy,
        });
        if (proxy)
            setupFn(proxy.proxiedTarget);
    }
}

// @ts-ignore
const initDevtools = (app, store) => {
    const stateType = 'routing properties';
    const INSPECTOR_ID = 'OnlyState-inspector';
    setupDevtoolsPlugin({
        id: 'org.webszy.onlystate',
        app,
        label: 'OnlyState',
        packageName: 'OnlyState',
        homepage: 'https://github.com/webszy/only-state',
        logo: 'https://vuejs.org/images/icons/favicon-96x96.png',
        componentStateTypes: [
            stateType
        ]
    }, (api) => {
        // Use the API here
        setInterval(() => {
            api.sendInspectorState(INSPECTOR_ID);
        }, 5000);
        api.addInspector({
            id: INSPECTOR_ID,
            label: 'OnlyState',
            icon: 'collections_bookmark'
        });
        api.on.getInspectorTree((payload) => {
            if (payload.inspectorId === INSPECTOR_ID) {
                payload.rootNodes = [{
                        id: 'root',
                        label: 'OnlyState',
                        children: []
                    }];
            }
        });
        api.on.getInspectorState((payload) => {
            if (payload.nodeId === 'root') {
                const getters = [];
                if (store.getters) {
                    Object.keys(store.getters).forEach((key) => {
                        getters.push({
                            key,
                            value: store.getters[key].value
                        });
                    });
                }
                const state = [];
                Object.keys(store.state).forEach(key => {
                    state.push({
                        key,
                        value: store.state[key],
                        editable: true
                    });
                });
                payload.state = {
                    state,
                    getters
                };
            }
        });
    });
};

const isFunction = (fn) => typeof fn === "function";
const isObject = (obj) => obj !== null && typeof obj === "object" && Array.isArray(obj) === false;
const concatAllParams = (key, ...rest) => {
    const params = [].concat(rest);
    if (Array.isArray(key)) {
        params.unshift(...key);
    }
    else {
        params.unshift(key);
    }
    return params.filter(e => e && e !== '');
};

// @ts-ignore
const originState = {};
const _State = {
    state: {},
    getters: {}
};
const installStore = {
    install(app) {
        app.config.globalProperties.$ostate = _State;
        initDevtools(app, _State);
    }
};
const defineState = (state, getters) => {
    if (isObject(state)) {
        Object.assign(originState, state); // 保留原始state
        _State.state = reactive(state);
    }
    else {
        console.log('[onlyState warning] you must define a state');
        return false;
    }
    if (isObject(getters) && Object.keys(getters).length > 0) {
        const keys = Object.keys(getters);
        const hasDuplicateKey = keys.some(key => key in state);
        if (hasDuplicateKey) {
            console.log(`[OnlyState warning] some key is already defined in state,it will be overrided by storeToRefs`);
        }
        keys.forEach((key) => {
            if (isFunction(getters[key])) {
                const func = () => getters[key](_State.state);
                _State.getters[key] = computed(func);
            }
        });
    }
    return installStore;
};
const useState = (key, ...rest) => {
    const params = concatAllParams(key, ...rest);
    const len = params.length;
    const hasParams = len >= 0;
    const hasKey = (keyName) => keyName in _State.state;
    const getOne = (keyName) => hasKey(keyName) ? toRefs(_State.state)[keyName] : undefined;
    if (len === 0) {
        return _State.state;
    }
    if (hasParams && params.some(e => typeof e !== 'string')) {
        console.error('use Function Alert: the key of use must be String or String Array');
        return;
    }
    if (len === 1) {
        return getOne(params[0]);
    }
    else {
        return params.map(getOne);
    }
};
const useGetters = (key, ...rest) => {
    if (!_State.getters) {
        return undefined;
    }
    if (Object.keys(_State.getters).length === 0) {
        console.log(`[onlyState warning] make sure you define getters`);
        return false;
    }
    const params = concatAllParams(key, ...rest);
    const len = params.length;
    const hasParams = len >= 0;
    const hasKey = (keyName) => keyName in _State.getters;
    const getOne = (keyName) => hasKey(keyName) ? _State.getters[keyName] : undefined;
    if (len === 0) {
        return _State.getters;
    }
    if (hasParams && params.some(e => typeof e !== 'string')) {
        console.error('use Function Alert: the key of use must be String or String Array');
        return;
    }
    if (len === 1) {
        return getOne(params[0]);
    }
    else {
        return params.map(getOne);
    }
};
const stateToRefs = () => {
    const getters = _State.getters ? _State.getters : {};
    return { ...getters, ...toRefs(_State.state) };
};
const resetState = () => {
    Object.assign(_State.state, originState);
};
const patchState = (desire) => {
    if (isObject(desire)) {
        Object.assign(_State.state, desire);
    }
    else if (isFunction(desire)) {
        desire(_State.state);
    }
    else {
        console.log('[onlyState warning] $patch function receive an object or a function');
    }
};

export { defineState as default, defineState, installStore, patchState, resetState, stateToRefs, useGetters, useState };
