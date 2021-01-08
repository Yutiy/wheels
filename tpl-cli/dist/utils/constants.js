"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULTS = exports.RC = exports.VERSION = void 0;

var _package = require("../../package.json");

// 当前 package.json 的版本号
const VERSION = _package.version; // 用户的根目录

exports.VERSION = VERSION;
const HOME = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME']; // 配置文件目录

const RC = `${HOME}/.tplrc`; // RC 配置下载模板的地方，给 github 的 api 使用
// https://api.github.com/users/Yutiy/repos
// https://api.github.com/${type}/${registry}/repos
// 模板下载地址可配置

exports.RC = RC;
const DEFAULTS = {
  registry: 'Yutiy',
  type: 'users'
};
exports.DEFAULTS = DEFAULTS;