import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: "src/index.js", // 入口
    output: {
        file: "dist/zState.js", // 输出文件
        format:'es',
        name:'zState'
    }, // 出口
    plugins: [nodeResolve({dedupe:['@vue/devtools-api']})], // 各种插件使用的配置
    external: ['vue'],// 外部依赖的配置
};
