const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

// const dist = isDev ? 'C:\\Ospanel\\OSPanel\\domains\\panel' : './dist';
const dist = './dist';

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);
const optimization = () => {
  const config = {};
  return config;
};

const devTool = () => {
  let tool = '';
  if (isDev) tool = 'source-map';
  return tool;
};

const plugins = () => {
  const initial = [
    new HTMLWebpackPlugin({
      // Auto HTML
      template: './src/index.html',
      minify: { collapseWhitespace: isProd }
    }),
    new CopyWebpackPlugin([
      // КОпирование
      {
        from: path.resolve(__dirname, 'app/api/'),
        to: path.resolve(`${dist}/admin/api`)
      },
      {
        from: path.resolve(__dirname, 'app/.htaccess'),
        to: path.resolve(`${dist}/admin/`)
      }
    ]),
    new MiniCSSExtractPlugin({ filename: filename('css') })
  ];
  if (isProd) initial.push(new CleanWebpackPlugin());
  return initial;
};
module.exports = {
  context: path.resolve(__dirname, 'app/'),
  mode: 'development',
  entry: ['@babel/polyfill', './src/main.js'],
  output: {
    filename: filename('js'),
    path: path.resolve(`${dist}/admin`)
  },
  devtool: devTool(),
  optimization: optimization(),
  devServer: { port: 3000, hot: isDev },
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: ['file-loader']
      },
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
