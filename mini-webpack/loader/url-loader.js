const loaderUtils = require('loader-utils');
const mime = require('mime');

function loader(source) {
  const { limit } = loaderUtils.getOptions(this);
  if (limit && limit > source.length) {
    return `module.exports="data:${mime.getType(this.resourcePath)};base64,${source.toString('base64')}"`
  } else {
    return require('./file-loader').call(this, source);
  }
}

loader.raw = true;  // 二进制
module.exports = loader;