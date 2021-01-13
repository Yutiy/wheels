import handleAttrs from './handleAttrs';

// 传入虚拟dom节点和真实包裹节点，把虚拟dom节点通过_render方法转换成真实dom节点，然后插入到包裹节点中，这个就是react的初次渲染
const render = (vnode, container) => {
  return container.appendChild(_render(vnode));
}

function _render(vnode) {
  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = '';
  if (typeof vnode === 'number') vnode = String(vnode);

  if (typeof vnode === 'string') {
    const textNode = document.createTextNode(vnode);
    return textNode;
  }

  const dom = document.createElement(vnode.tag);
  if (vnode.attrs) {
    Object.keys(vnode.attrs).forEach((key) => {
      const value = vnode.attrs[key];
      handleAttrs(dom, key, value); //如果有属性，例如style标签、onClick事件等，都会通过这个函数，挂在到dom上
    })
  }

  vnode.children && vnode.children.forEach((child) => render(child, dom)); // 递归渲染子节点
  return dom;
}

const ReactDOM = {};
ReactDOM.render = render;

export default ReactDOM;
