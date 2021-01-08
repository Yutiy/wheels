## 使用的第三方库

- @babel/cli @babel/core @babel/preset-env: 语法转换
- commander: 命令行工具
- download-git-repo: 用来下载远程模板
- ini: 格式转换
- inquirer: 交互式命令行工具
- ora: 显示loading动画
- chalk: 修改控制台输出内容样式
- log-symbols: 显示出 √ 或 × 等的图标

## 安装依赖

npm install

## 启动

npm run watch

## 执行 npm link

此时就可以使用 tpl 命令了。

- tpl init ts-axios myAxios
- tpl config get
- tpl config set type orgs
- tpl config set registry ts-axios
- tpl config set type users
- tpl config set registry Yutiy

## 发布

开发完成后，即可发布至 npm.

## 参考

[手摸手教你撸一个脚手架](https://github.com/YvetteLau/Blog/blob/master/eos-cli/README.md)
