const http = require('http');
const Stream = require('stream');
const EventEmitter = require("events");
const request = require('./request');
const response = require('./response');
const context = require('./context');

class Koa extends EventEmitter {
  constructor() {
    super();

    // 原型继承，防止引用
    this.request = Object.create(request);
    this.response = Object.create(response);
    this.context = Object.create(context);
    this.middlewares = [];
  }

  use(fn) {
    this.middlewares.push(fn);
  }

  createContext(req, res) {
    const ctx = this.context;
    ctx.request = this.request;
    ctx.response = this.response;

    ctx.req = ctx.request.req = req;
    ctx.res = ctx.response.res = res;
    return ctx;
  }

  // 对客户端消息进行回复
  responseBody(ctx) {
    const content = ctx.body;
    if (Buffer.isBuffer(content) || typeof content === 'string') {
      ctx.res.setHeader('Content-Type', 'text/plain;chartset=utf8');
      ctx.res.end(content);
    } else if(content instanceof Stream) {
      content.pipe(ctx.res);
    } else if (typeof content === 'object') {
      ctx.res.setHeader('Content-Type', 'application/json;chartset=utf8');
      ctx.res.end(JSON.stringify(content));
    } else {
      ctx.res.end('Not Found');
    }
  }

  compose() {
    return async (ctx) => {
      function createNext(middleware, oldNext) {
        return async () => {
          await middleware(ctx, oldNext);
        }
      }

      // 最后一个中间件的 next 设置为一个立即 resolve 的 promise 函数
      let next = async () => Promise.resolve();

      let len = this.middlewares.length;
      for(let i = len - 1; i >= 0; i--) {
        let currentMiddleware = this.middlewares[i];
        next = createNext(currentMiddleware, next);
      }

      await next();
    }
  }

  onerror(err, ctx) {
    if (err.code === 'ENOENT') {
      ctx.status = 404;
    } else {
      ctx.status = 500;
    }

    let msg = err.message || 'Internal error';
    ctx.res.end(msg);
    this.emit('error', err);  // 触发error事件
  }
  
  handleRequest = (req, res) => {
    const ctx = this.createContext(req, res);
    const respond = () => this.responseBody(ctx);
    const onerror = (err) => this.onerror(err, ctx);

    let fn = this.compose();
    fn(ctx).then(respond).catch(onerror);
  }

  listen(...args) {
    const server = http.createServer(this.handleRequest);
    server.listen(...args);
  }
}

module.exports = Koa;
