import chalk from 'chalk';
import { program } from 'commander';
import { VERSION } from './utils/constants';
import apply from './index';

/**
 * tpl commands
 *   - init
 *   - config
 */
let actionMap = {
  init: {
    alias: 'generator',
    description: 'generate a new project from a template',
    usages: [
      'tpl init templateName projectName'
    ]
  },
  config: {
    alias: 'cfg',
    description: 'config .tplrc',
    usages: [
      'tpl config set <k> <v>',
      'tpl config get <k>',
      'tpl config remove <k>'
    ]
  },
  //other commands
}

Object.keys(actionMap).forEach((action) => {
  program
    .command(action)
    .description(actionMap[action].description)
    .alias(actionMap[action].alias)
    .action(() => {
      switch (action) {
        case 'init':
          apply(action, ...process.argv.slice(3));
          break;
        case 'config':
          // 配置
          apply(action, ...process.argv.slice(3));
          break;
        default:
          break;
      }
    });
});

function help() {
  console.log('\r\nUsage:');
  Object.keys(actionMap).forEach((action) => {
    actionMap[action].usages.forEach(usage => {
      console.log('  - ' + usage);
    });
  });
  console.log('\r');
}

program.usage('<command> [options]');
program.on('-h', help);
program.on('--help', help);
program.version(VERSION, '-V --version').parse(process.argv);

// tpl 不带参数时
if (!process.argv.slice(2).length) {
  program.outputHelp(make_green);
}
function make_green(txt) {
  return chalk.green(txt);
}
