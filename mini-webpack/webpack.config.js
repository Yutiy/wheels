const path = require('path');
const TestPlugin = require('./plugins/test-plugin.js');
const CopyRightPlugin = require('./plugins/copyright-webpack-plugin.js');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: path.join(__dirname, 'src/app.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, 'loaders')],
  },
  module: {
    rules: [
      {
        test: /\.js/,
        use: [
          {
            loader: 'banner-loader',
            options: {
              text: 'yd',
              filename: path.resolve(__dirname, './src/js/banner.js'),
            }
          },
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
              ]
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          path.resolve(__dirname, 'loader', 'style-loader.js'),
          path.resolve(__dirname, 'loader', 'less-loader.js'),
        ]
      },
      {
        test: /\.jpg$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 20 * 1024,
          }
        }
      }
    ]
  },
  plugins: [
    new TestPlugin(),
    new CopyRightPlugin({
      filename: 'copyright'
    }),
  ]
}
