import { Component } from '../react/component';
import { _render } from '../react-dom'

export function createComponent(component, props) {
  let inst;

  if (component.prototype && component.prototype.render) {  // 如果是类定义组件，则直接返回实例
    inst = new component(props);
  } else {                                                  // 如果是函数定义组件，则将其扩展为类定义组件
    inst = new Component(props);
    inst.constructor = component;
    inst.render = function() {
      return this.constructor(props);
    }
  }

  return inst;
}

export function setComponentProps(component, props, isHook) {
  if (!component.base) {
    component.componentWillMount && component.componentWillMount();
  } else {
    component.componentWillReceiveProps && component.componentWillReceiveProps(props);
  }

  component.props = props;
  renderComponent(component, isHook);
}

export function renderComponent(component, isHook) {
  console.log('renderComponent', component);
  if (!isHook) {
    let base;

    // 返回虚拟dom对象 调用render方法，会用到state 此时的state已经通过上面的队列更新了
    const renderer = component.render();

    if (component.base && component.componentWillUpdate) {
      component.componentWillUpdate();
    }

    if (component.base && component.shouldComponentUpdate) {
      const bool = result = component.shouldComponentUpdate(component.props = {}, component.state);
      if (!bool && bool !== undefined) {
        return false
      }
    }

    base = _render(renderer);
    console.log('base ===>', base);

    if (component.base) {
      component.componentDidUpdate && component.componentDidUpdate();
    } else {
      component.componentDidMount && component.componentDidMount();
    }

    if (component.base && component.base.parentNode) {
      component.base.parentNode.replaceChild(base, component.base);
    }

    // 挂载真实的dom对象到对应的组件上, 方便后期对比
    component.base = base;

    // 挂载对应到组件到真实dom上, 方便后期对比
    base._component = component;
  }
}
