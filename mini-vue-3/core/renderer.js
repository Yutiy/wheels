const utils = {
  createText(text) {
    return new Text(text);
  },
  createElement(tag) {
    return document.createElement(tag);
  },
  setText(el, text) {
    el.textContent = text;
  },
  insert(el, parent) {
    parent.append(el);
  },
  remove(el, parent) {
    parent.remove(el)
  },

  patchProp(el, key, prevValue, nextValue) {
    if (key.startsWith('on')) {
      const eventName = key.slice(2).toLocaleLowerCase();
      el.addEventListener(eventName, nextValue);
    } else {
      if (nextValue === null) {
        el.removeAttribute(key, nextValue);
      } else {
        el.setAttribute(key, nextValue);
      }
    }
  }
}

export function diff(v1, v2) {
  // 1. 如果 tag 都不一样的话，直接替换
  // 2. 如果 tag 一样的话
    // 1. 要检测 props 哪些有变化
    // 2. 要检测 children -> 较复杂
  const { props: oldProps, children: oldChildren = [] } = v1;
  const { props: newProps, children: newChildren = [] } = v2;

  if (v1.tag !== v2.tag) {
    v1.replaceWith(utils.createElement(v2.tag));
  } else {
    const el = (v2.el = v1.el);

    // 对比 props
    if (newProps) {
      // 1. 新的节点不等于老节点的值 -> 直接赋值
      Object.keys(newProps).forEach((key) => {
        if (newProps[key] !== oldProps[key]) {
          utils.patchProp(el, key, oldProps[key], newProps[key]);
        }
      });

      // 2. 遍历老节点 -> 新节点里面没有的话，那么都删除掉
      Object.keys(oldProps).forEach((key) => {
        if (!newProps[key]) {
          utils.patchProp(el, key, oldProps[key], null);
        }
      });
    }

    // 对比 children

    // newChildren -> string
    // oldChildren -> string   oldChildren -> array

    // newChildren -> array
    // oldChildren -> string   oldChildren -> array
    if (typeof newChildren === "string") {
      if (typeof oldChildren === "string") {
        if (newChildren !== oldChildren) {
          utils.setText(el, newChildren);
        }
      } else if (Array.isArray(oldChildren)) {
        // 把之前的元素都替换掉
        v1.el.textContent = newChildren;
      }
    } else if (Array.isArray(newChildren)) {
      if (typeof oldChildren === "string") {
        // 清空之前的数据
        n1.el.innerHTML = "";
        // 把所有的 children mount 出来
        newChildren.forEach((vnode) => {
          mountElement(vnode, el);
        });
      } else if (Array.isArray(oldChildren)) {
        // a, b, c, d, e -> new
        // a1,b1,c1,d1 -> old
        // 如果 new 的多的话，那么创建一个新的

        // a, b, c -> new
        // a1,b1,c1,d1 -> old
        // 如果 old 的多的话，那么把多的都删除掉
        const length = Math.min(newChildren.length, oldChildren.length);
        for (let i = 0; i < length; i++) {
          const oldVnode = oldChildren[i];
          const newVnode = newChildren[i];
          // 可以十分复杂
          diff(oldVnode, newVnode);
        }

        if (oldChildren.length > length) {
          // 说明老的节点多, 都删除掉
          for (let i = length; i < oldChildren.length; i++) {
            utils.remove(oldChildren[i], el);
          }
        } else if (newChildren.length > length) {
          // 说明 new 的节点多, 那么需要创建对应的节点
          for (let i = length; i < newChildren.length; i++) {
            mountElement(newChildren[i], el);
          }
        }
      }
    }
  }
}

export function mountElement(vnode, container) {
  const el = (vnode.el = utils.createElement(vnode.tag));

  // 处理props
  if (vnode.props) {
    for (let key in vnode.props) {
      const val = vnode.props[key];
      utils.patchProp(vnode.el, key, null, val);
    }
  }

  // 处理children
  if (Array.isArray(vnode.children)) {
    vnode.children.forEach((child) => {
      mountElement(child, el);
    })
  } else {
    utils.insert(utils.createText(vnode.children), el);
  }

  // 插入到视图中
  utils.insert(el, container);
}
