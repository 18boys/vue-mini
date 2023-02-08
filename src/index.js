const { ref, effect, computed, watch } = require('vue.js');

const refObj = ref({
  switch: true,
  name: 'name',
  subObj: {
    subName: 'subName',
  },
  a: 1,
  b: 2,
  watchObj: 'watch',
});

function log() {
  console.log('ref的深层值', refObj.subObj.subName);
}

// 希望设置的之后能够将console的动作执行一遍
effect(log);

refObj.subObj.subName = 'hello';


// computed实现
// 核心就是实现传入一个get函数

computed(function add() {
  console.log('computed重新计算', refObj.a + refObj.b);
  return refObj.a + refObj.b;
});

refObj.a++;


// watch的核心实现
const watchObj = ref({
  watchValue: 'watch',
});
watch(watchObj, () => {
  console.log('watch 被触发了');
});

watchObj.watchValue = 'watch trigger';

// 数组监听
const arr = [1, 2, 3];
const arrRef = ref(arr);

effect(() => {

  console.log('arrRef副作用执行', arrRef.join('|'));
});
arrRef[7] = 7;
arrRef[9] = 9;
arrRef.length = 3;
arrRef.push(6); // 有重复执行副作用的问题(会执行 length两次以及key=3时候)


