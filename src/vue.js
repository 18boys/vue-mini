// 实现响应式原理
// 将一个对象变成响应式对象

// 存储副作用的桶
const bucket = new Set();

function Ref(data) {
  const p = new Proxy(data, {
    get(target, key) {
      return target[key];
    },
    set(target, key, value) {
      target[key] = value;
    },
  });
  return p;
}

module.exports = Ref;
