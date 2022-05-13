export declare const defineState: (state: {
    [key: string]: any;
}, getters?: any) => {
    install(app: any): void;
};
export declare const useState: (key: string | string[], ...rest: any[]) => {
    [key: string]: any;
} | undefined;
export declare const useGetters: (key: string | string[], ...rest: any[]) => false | {
    value?: any;
} | {
    [key: string]: {
        value?: any;
    };
} | ({
    value?: any;
} | undefined)[] | undefined;
export declare const stateToRefs: () => {
    [x: string]: {
        value?: any;
    } | import("vue").Ref<any>;
};
export declare const resetState: () => void;
export declare const patchState: (desire: any) => void;
declare const OnlyState: {
    defineState: (state: {
        [key: string]: any;
    }, getters?: any) => {
        install(app: any): void;
    };
    useState: (key: string | string[], ...rest: any[]) => {
        [key: string]: any;
    } | undefined;
    useGetters: (key: string | string[], ...rest: any[]) => false | {
        value?: any;
    } | {
        [key: string]: {
            value?: any;
        };
    } | ({
        value?: any;
    } | undefined)[] | undefined;
    stateToRefs: () => {
        [x: string]: {
            value?: any;
        } | import("vue").Ref<any>;
    };
    resetState: () => void;
    patchState: (desire: any) => void;
};
export default OnlyState;
