// 1. 收集依赖
// 2. 触发依赖
let currentEffect;

class Dep {
  constructor() {
    // 收集依赖的容器
    this.effects = new Set();
  }
  
  depend() {
    if (currentEffect) {
      this.effects.add(currentEffect);
    }
  }

  notice() {
    for (const effect of this.effects) {
      effect();
    }
  }
}

export const watchEffect = (effect) => {
  currentEffect = effect;
  effect();
  currentEffect = null;
};

const targetMap = new WeakMap();
export function reactive(raw) {
  // 对象
  // 如果对象的每个 key 当做之前的 dep 的话，那么一个 key 就应该有一个 dep
  // 每一个 key 的 dep 应该存储在哪里，设置的时候，是不是需要调用到 dep 的 notice 或者是 depend

  // 多个对象
  // 当前这个对象, 基于它的key 来找对应的 dep

  const getDep = (target, key) => {
    // 去找到当前 key 对应的 dep
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      depsMap = new Map();
      targetMap.set(target, depsMap);
    }

    let dep = depsMap.get(key);
    if (!dep) {
      dep = new Dep();
      depsMap.set(key, dep);
    }

    return dep;
  };

  return new Proxy(raw, {
    get(target, key) {
      // 去找到当前 key 对应的 dep
      const dep = getDep(target, key);
      // 依赖收集
      dep.depend();
      return Reflect.get(target, key);
    },
    set(target, key, val) {
      // 还是需要找到 dep
      const dep = getDep(target, key);
      const result = Reflect.set(target, key, val);
      dep.notice();
      return result;
    },
  });
}