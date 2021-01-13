// 传入虚拟dom节点和真实包裹节点，把虚拟dom节点通过_render方法转换成真实dom节点，然后插入到包裹节点中，这个就是react的初次渲染
const render = (vnode, container) => {
  return container.appendChild(_render(vnode));
}

function _render(vnode) {
  console.log('_render ');
}

const ReactDom = {};
ReactDom.render = render;

export default ReactDom;
