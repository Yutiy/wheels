class CopyRightPlugin {
  constructor(options) {
    const { filename } = options;
    console.log('options = ', options);
    this.filename = filename || 'copyright';
  }

  apply(compiler) {
    // 同步钩子
    compiler.hooks.compile.tap('CopyrightWebpackPlugin', (compilation) => {
      console.log('compile');
    });

    // 异步钩子promise
    compiler.hooks.emit.tapPromise('CopyrightWebpackPlugin', (compilation) => {
      return new Promise((resolve, reject) => {
        const assets = compilation.assets;

        let content = '';
        Object.entries(assets).forEach(([filename, statObj]) => {
          content += `${filename} promise plugin ${statObj.size()}`;
        })

        assets[`${this.filename}-promise.txt`] = {
          source: function() {
            return content;
          },
          size: function() {
            return content.length; // 字符长度
          }
        }
        resolve();
      })
    })

    // 异步钩子async
    compiler.hooks.emit.tapAsync('CopyrightWebpackPlugin', (compilation, cb) => {
      compilation.assets['copyright.txt']= {
        source: function() {
          return 'copyright async plugin';
        },
        size: function() {
          return 15; // 字符长度
        }
      }
      cb();
    })
  }
}

module.exports = CopyRightPlugin;
