var path = require('path');
var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  devtool: 'eval-source-map',
  mode: 'development',
  entry: ['./src/index'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'index.html',
      template: './index.html',
      filename: './index.html'
    })
  ],
	resolve: {
    extensions: ['.js', '.jsx'],
    symlinks: false,
    alias: {
      mobx: path.resolve(__dirname, 'node_modules/mobx'),
      react: path.resolve(__dirname, 'node_modules/react'),
      'mobx-react': path.resolve(__dirname, 'node_modules/mobx-react')
    }
  },
  resolveLoader: { symlinks: false },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      resolve: { extensions: ['.js', '.jsx'] }
    }, {
      test: /\.html$/i,
      loader: "html-loader",
    }],
  },
  target: 'web',
  devServer: {
    hot: true,
    port: 3000,
    historyApiFallback: true,
    allowedHosts: 'all',
    client: {
      logging: 'verbose'
    },
    watchFiles: {
      paths: ['src/**/*.*']
    }
  },
};
