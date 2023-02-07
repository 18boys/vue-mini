const { ref, effect } = require('vue.js');

const refObj = ref({
  switch: true,
  name: 'name',
  subObj: {
    subName: 'subName',
  },
});

function log() {
  console.log('ref的深层值', refObj.subObj.subName);
}

// 希望设置的之后能够将console的动作执行一遍
effect(log);

refObj.subObj.subName = 'hello';
