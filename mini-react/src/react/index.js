const React = {};

React.createElement = function (tag, attrs, ...children) {
  return {
    tag,
    attrs,
    children,
  };
};

export default React;
