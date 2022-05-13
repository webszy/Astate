export declare const defineState: (state: {
    [key: string]: any;
}, getters?: any) => {
    install(app: any): void;
};
export declare const useState: (key: string | string[], ...rest: any[]) => any | any[];
export declare const useGetters: (key: string | string[], ...rest: any[]) => any | any[];
export declare const useStateRaw: (key: string | string[], ...rest: any[]) => any | any[];
export declare const stateToRefs: () => any;
export declare const resetState: () => void;
export declare const patchState: (desire: any) => void;
declare const OnlyState: {
    defineState: (state: {
        [key: string]: any;
    }, getters?: any) => {
        install(app: any): void;
    };
    useState: (key: string | string[], ...rest: any[]) => any | any[];
    useGetters: (key: string | string[], ...rest: any[]) => any | any[];
    stateToRefs: () => any;
    resetState: () => void;
    patchState: (desire: any) => void;
};
export default OnlyState;
