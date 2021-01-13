export default function handleAttrs(dom, key, value) {
  // 如果属性名是className，则改回class
  if (key === 'className') key = 'class';

  if (/on\w+/.test(key)) {       // 如果属性名是onXXX，则是一个事件监听方法
    key = key.toLowerCase();
    dom[key] = value || '';
  } else if (key === 'style') {   // 如果属性名是style，则更新style对象
    if (!value || typeof value === 'string') {
      dom.style.cssText = value || '';
    } else if (value && typeof value === 'object') {
      for (let key in value) {
        // 可以通过style={ width: 20 }这种形式来设置样式，可以省略掉单位px
        dom.style[key] = typeof value[key] === 'number' ? value[key] + 'px' : value[key];
      }
    }
  } else { // 普通属性则直接更新属性
    if (key in dom) {
      dom[key] = value || '';
    }
    if (value) {
      dom.setAttribute(key, value);
    } else {
      dom.removeAttribute(key);
    }
  }
}
