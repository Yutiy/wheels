import diff from './diff'

const render = (vnode, container) => {
  diff(null, vnode, container);
}

const ReactDOM = {};
ReactDOM.render = render;

export default ReactDOM;
