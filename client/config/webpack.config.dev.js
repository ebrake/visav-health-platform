var path = require('path');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var postcssEasyImport = require('postcss-easy-import');
var postcssStripInlineComment = require('postcss-strip-inline-comments');
var postcssSelectorNot = require('postcss-selector-not');
var postCssColorFunction = require('postcss-color-function');

var StyleLintPlugin = require('stylelint-webpack-plugin');//css linter
var customMedia = require("postcss-custom-media")

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

// TODO: hide this behind a flag and eliminate dead code on eject.
// This shouldn't be exposed to the user.
var isInNodeModules = 'node_modules' ===
  path.basename(path.resolve(path.join(__dirname, '..', '..')));
var relativePath = isInNodeModules ? '../../..' : '..';
var isInDebugMode = process.argv.some(arg =>
  arg.indexOf('--debug-template') > -1
);
if (isInDebugMode) {
  relativePath = '../template';
}
var srcPath = path.resolve(__dirname, relativePath, 'src');
var nodeModulesPath = path.join(__dirname, '..', 'node_modules');
var indexHtmlPath = path.resolve(__dirname, relativePath, 'index.html');
var faviconPath = path.resolve(__dirname, relativePath, 'favicon.ico');
var buildPath = path.join(__dirname, isInNodeModules ? '../../..' : '..', 'build');

module.exports = {
  devtool: 'eval',
  entry: [
    require.resolve('webpack-dev-server/client') + '?http://localhost:3000',
    require.resolve('webpack/hot/dev-server'),
    path.join(srcPath, 'index')
  ],
  output: {
    // Next line is not used in dev but WebpackDevServer crashes without it:
    path: buildPath,
    pathinfo: true,
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  resolveLoader: {
    modules: [nodeModulesPath],
    moduleExtensions: ["-loader"],
    enforceModuleExtension: false
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        loader: 'eslint',
        include: srcPath,
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: srcPath,
        exclude: /node_modules/,
        query: require('./babel.dev')
      },
      {
        test: /\.css$/,
        loader: 'style!css!postcss'
      },
      {
        test:   /\.style.js$/,
        include: srcPath,
        loader: 'style!css!postcss',
        query: 'parser=postcss-js!babel'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
        loader: 'file',
      },
      {
        test: /\.(mp4|webm)$/,
        loader: 'url',
        query: 'limit=10000'
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
        query: 'limit=10000&mimetype=application/font-woff'
      }, 
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
        query: 'limit=10000&mimetype=application/font-woff'
      }, 
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
        query: 'limit=10000&mimetype=application/octet-stream'
      }, 
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
      }, 
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
        query: 'limit=10000&mimetype=image/svg+xml'
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: function(webpack) {
          return [
                  postcssEasyImport,
                  postcssStripInlineComment,
				  postcssSelectorNot,
                  autoprefixer, 
                  precss,
                  customMedia,
            	  postCssColorFunction
                  ];
        },
        eslint: {
          configFile: path.join(__dirname, 'eslint.js'),
          useEslintrc: false
        }
      }
    }),
    new HtmlWebpackPlugin({
      inject: true,
      favicon: faviconPath,
      template: indexHtmlPath
    }),
    new StyleLintPlugin({
      configFile: '.stylelintrc',
      context: 'src/css/',
      files: '**/*.css',
      failOnError: false,
    }),
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('development'),
        'API_ROOT': JSON.stringify('http://localhost:4000/')
      }
    }),

    // Note: only CSS is currently hot reloaded
    new webpack.HotModuleReplacementPlugin()
  ]
};
