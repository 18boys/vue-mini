const ref = require('vue.js')

console.log('ref',ref)
const refObj = ref({
  name: 'hello'
})
console.log('ref的值', refObj.name)
