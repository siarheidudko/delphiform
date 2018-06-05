const path = require('path');
const webpack = require("webpack");

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: [],
  entry: {
	filename: path.resolve(__dirname, './src/') + '/delphiform.js'
  },
  output: {
    path: path.resolve(__dirname, './umd/'),
    filename: 'delphiform.js',
	libraryTarget: "umd"
  }
};