// 存储副作用的桶
const bucket = new Map();

const effectStack = [];
let isCollecting = true;
let activeEffect = null;

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
      const nextEffect = effectStack[effectStack.length - 1];
      activeEffect = nextEffect;
      if (!bucket.get(target)) { // 注意这里需要用get而不是能直接设置属性,否则key不为对象
        bucket.set(target, new Map());
      }
      const depsMap = bucket.get(target);
      if (!depsMap.get(key)) {
        depsMap.set(key, { deps: [] });
      }
      if (depsMap.get(key).deps.indexOf(activeEffect) === -1) {
        depsMap.get(key).deps.push(activeEffect);
        if (typeof target[key] === 'object') {
          p[key] = ref(target[key]); // 直接在get中设置会导致触发set从而死循环,因此收集过程不触发副作用,设置isCollecting
        }
      }
      return target[key];
    },
    set(target, key, value) {
      const oldLength = target.length;
      if (!bucket.get(target) || isCollecting){
        target[key] = value
        return true
      }
      const type = Array.isArray(target) && typeof key === 'number'? Number(key) < oldLength ? 'SET' : 'ADD' : Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'; // 增加新增属性的处理
      target[key] = value;
      if (Array.isArray(target) && type === 'ADD') {
        const lengthEffects = bucket.get(target).get('length');
        lengthEffects && lengthEffects.deps.forEach(effectFn => {
          if (effectFn !== activeEffect) {
            console.log('Array key',key)
            effectFn();
          }
        });
      }
      if (!bucket.get(target).get(key)) return true;
      const rectObj = bucket.get(target).get(key);
      rectObj.deps.forEach(effect => {
        if (effect.options.scheduler) {
          effect.options.scheduler();
        } else {
          console.log('key',key)
          effect();
        }
      });
      return true
    },
  });
  return p;
}

function createEffectFun(fn, options) {
  const effectFun = () => {
    fn();
  };
  effectFun.options = options;
  return effectFun;
}


function effect(fn, options = {}) {
  const effectFun = createEffectFun(fn, options);
  effectStack.push(effectFun);
  isCollecting = true;
  effectFun(); // 执行收集动作
  isCollecting = false;
  effectStack.pop();
  activeEffect = null;
}

function computed(getter) {
  effect(getter);
}

function traverser(obj, seen = (new Set())) {
  if (typeof obj !== 'object' || obj === null || seen.has(obj)) return;
  for (let k in obj) {
    seen.add(obj[k]); // 触发访问,收集副作用
    traverser(obj[k], seen);
  }
}

function watch(obj, cb) {
  // 强制建立对象的key和副作用函数的关联关系,之前是副作用函数的时候
  // 循环遍历读取obj的值,这里obj只考虑原始值,非响应类型的情况
  effect(() => traverser(obj), {
    scheduler() {
      cb();
    },
  });
}

module.exports = {
  ref,
  effect,
  computed,
  watch,
};
