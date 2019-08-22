const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const fs = require('fs');
const CreateFileWebpack = require('create-file-webpack')

module.exports = (env) => {
  const currentPath = path.join(__dirname);
  const basePath = currentPath + '/.env';
  const envPath = basePath + '.' + env.ENVIRONMENT;
  const finalPath = fs.existsSync(envPath) ? envPath : basePath;
  const fileEnv = dotenv.config({ path: finalPath }).parsed;
  const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
    return prev;
  }, {});

  const filename = process.env.NODE_ENV === 'development' ? 'development.js' : `${process.env.npm_package_version}.js`
  const versionFile = {
    path: './dist',
    fileName: 'version.txt',
    content: process.env.npm_package_version
  }

  return {
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        }
      ]
    },
    output: {
      filename: filename
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 9000
    },
    plugins: [
      new webpack.DefinePlugin(envKeys),
      new CreateFileWebpack(versionFile)
    ]
  }
};
