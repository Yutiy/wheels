let proto = {};

function delegateGetter(property, name) {
  proto.__defineGetter__(name, function () {
    return this[property][name];
  });
}

function delegateSetter(property, name) {
  proto.__defineSetter__(name, function (val) {
    this[property][name] = val;
  });
}

// 定义request中要代理的setter和getter
let requestSet = [];
let requestGet = ['path', 'query'];

// 定义response中要代理的setter和getter
let responseSet = ['body', 'status'];
let responseGet = responseSet;

requestGet.forEach(ele => delegateGetter('request', ele));
requestSet.forEach(ele => delegateSetter('request', ele));

responseGet.forEach(ele => delegateGetter('response', ele));
responseSet.forEach(ele => delegateSetter('response', ele));

module.exports = proto;
