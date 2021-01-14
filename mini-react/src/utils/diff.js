/**
 * @param {HTMLElement} dom 真实DOM
 * @param {vnode} vnode 虚拟DOM
 * @param {HTMLElement} container 容器
 * @returns {HTMLElement} 更新后的DOM
 */
export function diff(dom, vnode, container) {
  const ret = diffNode(dom, vnode);

  if (container && ret.parentNode !== container) {
    container.appendChild(ret);
  }

  return ret;
}

/**
 * 原生DOM节点的vnode:
 * {
 *   tag: 'div',
 *   attrs: {
 *     className: 'container',
 *   },
 *   children: []
 * }
 *
 * 文本节点的vnode:
 * "hello,world"
 *
 * 组件的vnode:
 * {
 *   tag: ComponentConstrucotr,
 *   attrs: {
 *     className: 'container',
 *   },
 *   children: []
 * }
 */
export function diffNode(dom, vnode) {
  let out = dom;

  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = '';
  if (typeof vnode === 'number') vnode = String(vnode);

  // 对比文本节点
  if (typeof vnode === 'string') {
    if (dom && dom.nodeType === 3) {  // 如果当前的DOM就是文本节点，则直接更新内容
      // nodeType: https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType
      if (dom.textContent !== vnode) {
        dom.textContent = vnode;
      }
    } else {  // 如果DOM不是文本节点，则新建一个文本节点DOM，并移除掉原来的
      out = document.createTextNode(vnode);
      if (dom && dom.parentNode) {
        dom.parentNode.replaceChild(out, dom);
      }
    }

    return out;
  }

  // 对比函数
  if (typeof vnode.tag === 'function') {
    return diffComponent(dom, vnode);
  }
}
