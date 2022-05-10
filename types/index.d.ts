export declare const installStore: {
    install(app: any): void;
};
export declare const defineState: (state: {
    [key: string]: any;
}, getters?: any) => false | {
    install(app: any): void;
};
export declare const useState: (key: string | string[], ...rest: any[]) => {
    [key: string]: any;
} | undefined;
export declare const useGetters: (key: string | string[], ...rest: any[]) => false | {
    [key: string]: {
        value?: any;
    };
} | {
    value?: any;
} | ({
    value?: any;
} | undefined)[] | undefined;
export declare const stateToRefs: () => {
    value?: any;
};
export declare const resetState: () => void;
export declare const patchState: (desire: any) => void;
export default defineState;
