export declare const isFunction: (fn: any) => boolean;
export declare const isObject: (obj: any) => boolean;
export declare const concatAllParams: (key: string | string[], ...rest: any[]) => never[];
export interface realState_type {
    state: {
        [key: string]: any;
    };
    getters: {
        [key: string]: {
            value?: any;
        };
    };
}
