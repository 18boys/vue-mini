const { ref, effect } = require('vue.js');

const refObj = ref({
  switch: true,
  name: 'name',
  id: 'id',
});

function log() {
  console.log('ref的值', refObj.name);
}

// 希望设置的之后能够将console的动作执行一遍
effect(log);

refObj.name = 'world';
