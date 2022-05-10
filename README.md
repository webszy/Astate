# a-state
一个仅关注state的状态库，
基于vue3-reactive模块实现，
并且提供vue-devtools插件
# 特点
+ 关注于State,去掉了action,你可以通过compositionAPI来时实现action
# 使用
`npm install @webszy/a-state --save-dev`
1. 定义state
```javascript
//store.js
import {defineState} from 'only-state';
const install = defineState({
    a: 1,
    b: 2
}, {
    c: state => 'a=' + state.a,
    d: state => 'b=' + state.b
});
export default install;
```
2. 注册state
```javascript
import Astate from './store'
//main.js
app = createApp(App);
app.use(Astate);
```
3. 基本使用
```vue
<script setup>
import {useState} from 'only-state';
    const [a, b] = useState('a', 'b');
    a.value = 2;
</script>
```
# TODO
- [x] 基本功能
- [ ] rollup打包umd、cjs、esm
- [ ] vue devtools 文件单独打包使用
