"use strict";

var _chalk = _interopRequireDefault(require("chalk"));

var _commander = require("commander");

var _constants = require("./utils/constants");

var _index = _interopRequireDefault(require("./index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * tpl commands
 *   - init
 *   - config
 */
let actionMap = {
  init: {
    alias: 'generator',
    description: 'generate a new project from a template',
    usages: ['tpl init templateName projectName']
  },
  config: {
    alias: 'cfg',
    description: 'config .tplrc',
    usages: ['tpl config set <k> <v>', 'tpl config get <k>', 'tpl config remove <k>']
  } //other commands

};
Object.keys(actionMap).forEach(action => {
  _commander.program.command(action).description(actionMap[action].description).alias(actionMap[action].alias).action(() => {
    switch (action) {
      case 'init':
        (0, _index.default)(action, ...process.argv.slice(3));
        break;

      case 'config':
        // 配置
        (0, _index.default)(action, ...process.argv.slice(3));
        break;

      default:
        break;
    }
  });
});

function help() {
  console.log('\r\nUsage:');
  Object.keys(actionMap).forEach(action => {
    actionMap[action].usages.forEach(usage => {
      console.log('  - ' + usage);
    });
  });
  console.log('\r');
}

_commander.program.usage('<command> [options]');

_commander.program.on('-h', help);

_commander.program.on('--help', help);

_commander.program.version(_constants.VERSION, '-V --version').parse(process.argv); // tpl 不带参数时


if (!process.argv.slice(2).length) {
  _commander.program.outputHelp(make_green);
}

function make_green(txt) {
  return _chalk.default.green(txt);
}