module.exports = {
  cacheDirectory: true,
  presets: [
    'babel-preset-airbnb'
  ].map(require.resolve),
  plugins: [
    'babel-plugin-syntax-trailing-function-commas',
    'babel-plugin-transform-class-properties',
    'babel-plugin-transform-decorators-legacy'
  ].map(require.resolve)
};
