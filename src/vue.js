// 存储副作用的桶
const bucket = new Map();

const effectStack = [];

/**
 * 将对象转化为响应式对象
 * @param data
 * @returns {*}
 * @constructor
 */
function ref(data) {
  const p = new Proxy(data, {
    get(target, key) {
      // 依赖收集, 将副作用收集到副作用bucket中
      if (!effectStack.length) return target[key];
      const activeEffect = effectStack[effectStack.length - 1];
      if (!bucket.get(target)) { // 注意这里需要用get而不是能直接设置属性,否则key不为对象
        bucket.set(target, {})
        bucket.get(target).deps = [];
      }
      bucket.get(target).deps.push(activeEffect);
      return target[key];
    },
    set(target, key, value) {
      if(key === '__raw__') return target;
      target[key] = value;
      if (!bucket.get(target)) return;
      const rectObj = bucket.get(target);
      rectObj.deps.map(effect => effect());
    },
  });
  return p;
}


function effect(fn) {
  effectStack.push(fn);
  fn(); // 执行收集动作
  effectStack.pop();
}

module.exports = {
  ref,
  effect,
};
