import defineState,{useStore, useGetters, storeToRefs} from "./index.js";

const install = defineState({
    a: 1,
    b: 2
}, {
    c: state => 'a=' + state.a,
    d: state => 'b=' + state.b
});
// console.log(install )
// const {a,b,c} = storeToRefs(store);
const [a, b] = useStore('a', 'b')
// const [c,d] = useGetters('c','d')
// a.value++
// b.value++
// $patch({
//     a: 5,
//     b:6
// })
// $patch(state=>{
//     state.a = 7
//     state.b = 8
// })
console.log(a.value, b.value)
// $reset()
// const [a,b] = useStore('a','b')
const [c, d] = useGetters('c', 'd')
// console.log('after reset')
console.log(c.value, d.value)
