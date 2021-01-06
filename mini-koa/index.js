const Koa = require('./core/application');
const app = new Koa();

// koa原型上 use 方法来注册中间件
app.use((ctx, next) => {
  // koa ctx属性上挂载了很多属性
  console.log(ctx.req.url);
  console.log(ctx.request.path);
  console.log(ctx.path);

  next(); // 洋葱模型，中间件组合
})

let responseData = {};
app.use(async (ctx, next) => {
  responseData.name = 'zq';

  console.log(1);
  await next();
  console.log(2);

  ctx.body = responseData;
})

app.use(async (ctx, next) => {
  responseData.age = 23;

  console.log(3);
  await next();
  console.log(4);
})

app.use(async (ctx, next) => {
  responseData.sex = 'female';

  console.log(5);
  await next();
  console.log(6);
})

app.listen(3000, () => {
  console.log('server listening on port 3000!')
});
