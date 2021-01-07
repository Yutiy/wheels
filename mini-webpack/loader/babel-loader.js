const babel = require('@babel/core');
const loaderUtils = require('loader-utils');

function loader(source) {
  let options = loaderUtils.getOptions(this);
  let cb = this.async();
  babel.transform(source, {
    ...options,
    sourceMap: true,
    filename: this.resourcePath.split('/').pop(), // 文件名
  }, function(err, result) {
    cb(err, result.code, result.map); // 异步回调
  })
}

module.exports = loader;
