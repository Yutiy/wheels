function createElement( tag, attrs, ...children ) {
  return {
    tag,
    attrs,
    children
  }
}

// 将上文定义的createElement方法放到对象React中
const React = {
  createElement
}

const element = (
  <div>
    hello<span>world!</span>
  </div>
);

console.log( element );
