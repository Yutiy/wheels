import diff from './diff';
import { Component } from '../react/component'

/**
 * @description 实例化组件
 * @param {function} Constructor vnode.tagName
 * @param {object} props vnode.attrs
 * @return {'import ../react/component'.instance} Constrcutor instance
 */
export function createComponent(component, props) {
  let inst;

  if (component.prototype && component.prototype.render) {  // 如果是类定义组件，则直接返回实例
    inst = new component(props);
  } else {                                                  // 如果是函数定义组件，则将其扩展为类定义组件
    inst = new Component(props);
    inst.constructor = component;
    inst.render = function() {
      return inst.constructor(props);
    }
  }

  return inst;
}

export function setComponentProps(component, props) {
  if (!component.base) {
    component.componentWillMount && component.componentWillMount();
  } else {
    component.componentWillReceiveProps && component.componentWillReceiveProps(props);
  }

  component.props = props || {};
  return renderComponent(component);
}

export function renderComponent(component, isForceUpdate) {
  const isUpdate = !!component.base;

  let props = component.props,
    state = component.state,
    prevState = component.prevState || state,
    prevProps = component.prevProps || props;

  if (component.constructor.getDerivedStateFromProps) {
    Object.assign(
      component.state,
      component.constructor.getDerivedStateFromProps(props, prevState)
    )
  }

  let skip = false
  let base = component.base

  if (isUpdate) {
    component.props = prevProps
    component.state = prevState
    if (
      !isForceUpdate &&
      component.shouldComponentUpdate &&
      component.shouldComponentUpdate(props, state) === false
    ) {
      skip = true
    }
    component.props = props
    component.state = state
  }

  if (!skip) {
    const vnode = component.render()
    base = diff(component.base, vnode, props)

    component.base = base
    component.base._component = component

    if (isUpdate) {
      component.componentDidUpdate && component.componentDidUpdate(prevProps, prevState)
    } else {
      component.componentDidMount && component.componentDidMount()
    }

    component.prevProps = component.props
    component.prevState = component.state
  }

  return base
}

export function unmountComponent(component) {
  if (component.componentWillUnMount) {
    component.componentWillUnMount()
  }
  if (component.base && component.base.parnetNode) {
    component.base._component = null
    component.base.parnetNode.removeChild(component.base)
  }
}
