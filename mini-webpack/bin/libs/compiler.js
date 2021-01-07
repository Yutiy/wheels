const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const { SyncHook } = require('tapable');
const parser = require('@babel/parser');
const t = require('@babel/types');
const traverse = require('@babel/traverse');
const generator = require('@babel/generator').default;

class Compiler {
  constructor(config) {
    this.config = config;
    this.modules = {};    // 模块依赖
    this.entryPath = '';  // 入口文件(相对路径)
    this.root = process.cwd();  // 工作路径

    this.hooks = {
      entryOptions: new SyncHook(),
      compile: new SyncHook(),
      afterCompile: new SyncHook(),
      afterPlugins: new SyncHook(),
      run: new SyncHook(),
      emit: new SyncHook(),
      done: new SyncHook(),
    }

    // 插件列表
    let plugins = this.config.plugins;
    if (Array.isArray(plugins)) {
      plugins.forEach(plugin => plugin.apply(this));
    }
  }

  // 获取源码
  getSource(modulePath) {
    try {
      let { rules } = this.config.module;
      let content = fs.readFileSync(modulePath, 'utf-8');

      for (let i = 0; i < rules.length; i++) {
        let { test, use } = rules[i];
        let len = use.length - 1;

        if (test.test(modulePath)) {
          // 递归处理所有loader
          function loopLoader() {
            let loader = require(use[len--]);
            content = loader(content);

            if (len >= 0) {
              loopLoader();
            }
          }
          loopLoader();
        }
      }
      return content;
    } catch (error) {
      throw new Error(`获取数据错误 : ${modulePath}`);
    }
  }

  /**
   * 解析源码 -> ast解析语法树
   * @param {*} source 源码
   * @param {*} dirname 父目录
   */
  parse(source, dirname) {
    // 生成AST
    let ast = parser.parse(source);

    // 模块依赖项列表
    let dependencies = [];

    // 遍历AST结点
    traverse(ast, {
      CallExpression(p) {
        const node = p.node;  // 对应节点
        if (node.callee.name === 'require') {
          node.callee.name = '__webpack_require__';    // 函数名替换
          let modulePath = node.arguments[0].value;     // 路径替换

          modulePath = modulePath + (path.extname(modulePath) ? '' : 'app.js');
          modulePath = './' + path.join(dirname, modulePath).replace(/\\/g, '/');
          node.arguments = [t.stringLiteral(modulePath)];

          // 保存模块依赖项
          dependencies.push(modulePath)
        }
      }
    });

    // 生成新的代码
    let sourceCode = generator(ast).code;
    return { sourceCode, dependencies };
  }

  /**
   * 构建模块依赖
   * @param {*} modulePath 模块绝对路径
   * @param {*} isEntry 是否为主入口文件
   */
  buildModule(modulePath, isEntry) {
    let source = this.getSource(modulePath);
    let moduleName = './' + path.relative(this.root, modulePath).replace(/\\/g, '/');

    if (isEntry) this.entryPath = moduleName;
    let { sourceCode, dependencies } = this.parse(source, path.dirname(moduleName));   // 解析source，返回依赖列表

    // 把相对路径和模块内容进行关联
    this.modules[moduleName] = JSON.stringify(sourceCode);

    // 递归解析获取所有模块依赖
    dependencies.forEach(d => this.buildModule(path.join(this.root, d)), false);
  }

  emitFile() {
    const { modules, entryPath, config } = this;
    const outputPath = path.resolve(this.root, config.output.path);
    const filePath = path.resolve(outputPath, config.output.filename);

    try {
      fs.readdirSync(outputPath)
    } catch(e) {
      fs.mkdirSync(outputPath);
    }

    ejs.renderFile(path.join(__dirname, 'template.ejs'), { modules, entryPath }).then(code => {
      fs.writeFileSync(filePath, code);
    })
  }

  run() {
    const { entry } = this.config;

    this.hooks.run.call();
    this.hooks.compile.call();
    this.buildModule(path.resolve(this.root, entry), true);   // 执行并创建模块依赖关系
    this.hooks.afterCompile.call();

    this.emitFile();  // 发射打包后的文件
    this.hooks.emit.call();
    this.hooks.done.call();
  }
}

module.exports = Compiler;
