const loaderUtils = require('loader-utils');

function loader(source) {
  const filename = loaderUtils.interpolateName(this, '[hash].[ext]', { content: source });

  // 发射文件
  this.emitFile(filename, source);
  return `module.exports="${filename}"`;
}

loader.raw = true;  // 二进制
module.exports = loader;
