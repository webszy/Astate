import { nodeResolve } from '@rollup/plugin-node-resolve';
import {version} from './package.json';
export default {
    input: "src/index.js", // 入口
    output: {
        file: "dist/only-state.js", // 输出文件
        format:'es',
        name:'onlyState',
        banner:`/*
* only-state.js ${version}
* author:webszy
* date:${new Date().toLocaleString()}
*/`
    }, // 出口
    plugins: [nodeResolve({dedupe:['@vue/devtools-api']})], // 各种插件使用的配置
    external: ['vue'],// 外部依赖的配置
};
