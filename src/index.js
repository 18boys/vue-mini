const { ref, effect, computed } = require('vue.js');

const refObj = ref({
  switch: true,
  name: 'name',
  subObj: {
    subName: 'subName',
  },
  a: 1,
  b: 2,
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

refObj.a ++
