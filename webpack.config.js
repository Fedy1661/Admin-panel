const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = ext => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);
const optimization = () => {
  const config = {};
  // if (isProd) {
  //   config.minimizer = [
  //     new OptimizeCSSAssetWebpackPlugin(),
  //     new TerserWebpackPlugin()
  //   ];
  // }
  return config;
};
module.exports = {
  context: path.resolve(__dirname, 'app/'),
  mode: 'development',
  entry: ['@babel/polyfill', './src/main.js'],
  output: {
    filename: filename('js'),
    path: path.resolve(`C:/Ospanel/OSPanel/domains/panel/admin`)
  },
  optimization: optimization(),
  devServer: { port: 3000, hot: isDev },
  plugins: [
    new HTMLWebpackPlugin({
      // Auto HTML
      template: './src/index.html',
      minify: { collapseWhitespace: isProd }
    }),
    new CleanWebpackPlugin(), // Очистка других файлов
    new CopyWebpackPlugin([
      // КОпирование
      {
        from: path.resolve(__dirname, 'app/api/'),
        to: path.resolve(`C:/Ospanel/OSPanel/domains/panel/admin/api`)
      }
    ]),
    new MiniCSSExtractPlugin({ filename: filename('css') })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCSSExtractPlugin.loader,
            options: { hmr: isDev, reloadAll: true }
          },
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: ['@babel/plugin-proposal-class-properties']
            }
          }
        ]
      }
    ]
  }
};
