const fs = require('fs');
const loaderUtils = require('loader-utils');
const schemaUtils = require('schema-utils');

function loader(source) {
  let cb = this.async();
  let options = loaderUtils.getOptions(this);
  let schema = {
    type: 'object',
    properties: {
      text: {
        type: 'string',
      },
      filename: {
        type: 'string',
      }
    }
  };
  schemaUtils(schema, options, 'banner-loader');
  if (options.filename) {
    // 实时打包添加依赖到 webpack 中
    this.addDependency(options.filename);
    fs.readFile(options.filename, 'utf8', (err, data) => {
      cb(err, `/**${data}**/${source}`);
    })
  } else {
    cb(null, `/**${options.text}**/${source}`);
  }
}

module.exports = loader;
