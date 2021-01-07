const loaderUtils = require('loader-utils');

function loader(source) {
  let str = `
    let style = document.createElement('style');
    style.innerHTML = ${JSON.stringify(source)};
    document.head.appendChild(style);
  `;

  return str;
}

// style-loader 去处理 less-loader!css-loader!./index.less
loader.pitch = function(remainingRequest) {
  // stringifyRequest 绝对路径转相对路径
  let str = `
    let style = document.createElement('style');
    style.innerHTML = require(${loaderUtils.stringifyRequest(this, '!!' + remainingRequest)});
    document.head.appendChild(style);
  `;

  return str;
}

module.exports = loader;