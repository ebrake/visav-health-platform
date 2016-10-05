var path = require('path');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var postcssEasyImport = require('postcss-easy-import');
var postcssStripInlineComment = require('postcss-strip-inline-comments');
var postcssSelectorNot = require('postcss-selector-not');
var postCssColorFunction = require('postcss-color-function');
var FaviconsWebpackPlugin = require('favicons-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var customMedia = require("postcss-custom-media");

// TODO: hide this behind a flag and eliminate dead code on eject.
// This shouldn't be exposed to the user.
var isInNodeModules = 'node_modules' ===
  path.basename(path.resolve(path.join(__dirname, '..', '..')));
var relativePath = isInNodeModules ? '../../..' : '..';
if (process.argv[2] === '--debug-template') {
  relativePath = '../template';
}
var srcPath = path.resolve(__dirname, relativePath, 'src');
var nodeModulesPath = path.join(__dirname, '..', 'node_modules');
var indexHtmlPath = path.resolve(__dirname, relativePath, 'index.html');
var faviconPath = path.resolve(__dirname, relativePath, 'icon.png');
var buildPath = path.join(__dirname, isInNodeModules ? '../../..' : '..', 'build');

module.exports = {
  bail: true,
  devtool: 'cheap-module-source-map',
  entry: {
   js: [
     path.join(srcPath, 'index')
   ],
   vendor: [
     'react', 'react-dom', 'react-chartjs-2', 'react-router/es'
   ]
  },
  output: {
    path: buildPath,
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    // TODO: this wouldn't work for e.g. GH Pages.
    // Good news: we can infer it from package.json :-)
    publicPath: '/'
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  resolveLoader: {
    modules: [nodeModulesPath],
    moduleExtensions: ["-loader"],
    enforceModuleExtension: false
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/, //test: /\.js$/,
        enforce: 'pre',
        loader: 'eslint',
        include: srcPath,
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: srcPath,
        query: require('./babel.prod')
      },
      {
        test: /\.css$/,
        // Disable autoprefixer in css-loader itself:
        // https://github.com/webpack/css-loader/issues/281
        // We already have it thanks to postcss.
        loader: ExtractTextPlugin.extract({
          fallbackLoader: "style",
          loader: 'css?-autoprefixer!postcss'
        })
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
        test: /\.(jpg|png|gif|svg)$/,
        loader: 'file',
      },
      {
        test: /\.(mp4|webm)$/,
        loader: 'url',
        query: {
          limit: 10000
        }
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader",
        query: {
          limit:10000,
          mimetype: 'application/font-woff'
        },
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
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
          // TODO: consider separate config for production,
          // e.g. to enable no-console and no-debugger only in prod.
          configFile: path.join(__dirname, 'eslint.js'),
          useEslintrc: false
        }
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor'
    }),
    new CopyWebpackPlugin([
      { from: './src/img', to: './src/img' },//copy images
    ]),
    new FaviconsWebpackPlugin(faviconPath),
    new HtmlWebpackPlugin({
      inject: true,
      template: indexHtmlPath,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: false,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'API_ROOT': JSON.stringify(process.env.API_ROOT)
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    }),
    new ExtractTextPlugin('[name].[contenthash].css')
  ]
};
