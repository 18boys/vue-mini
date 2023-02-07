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
  let isCollect = true;
  const p = new Proxy(data, {
    get(target, key) {
      // 依赖收集, 将副作用收集到副作用bucket中
      if (!effectStack.length) return target[key];
      const activeEffect = effectStack[effectStack.length - 1];
      if (!bucket.get(target)) { // 注意这里需要用get而不是能直接设置属性,否则key不为对象
        bucket.set(target, new Map());
      }
      const depsMap = bucket.get(target);
      if (!depsMap.get(key)) {
        depsMap.set(key, { deps: [] });
      }
      depsMap.get(key).deps.push(activeEffect);
      p.__raw__ = target;
      if(typeof target[key] === 'object'){
        isCollect = false;
        p[key] = ref(target[key]) // 直接在get中设置会导致死循环,因此收集过程不触发副作用
        isCollect = true;
      }
      return target[key];
    },
    set(target, key, value) {
      if (key === '__raw__') return; // 防止设置的时候死循环
      target[key] = value;
      if (!bucket.get(target) || !bucket.get(target).get(key) || !isCollect) return;
      const rectObj = bucket.get(target).get(key);
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
