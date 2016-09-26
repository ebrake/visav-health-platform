module.exports = {
  presets: [
    'babel-preset-airbnb'
  ].map(require.resolve),
  plugins: [
    'babel-plugin-syntax-trailing-function-commas',
    'babel-plugin-transform-class-properties',
    'babel-plugin-transform-decorators-legacy',
    'babel-plugin-transform-remove-strict-mode'
  ].map(require.resolve)
};
