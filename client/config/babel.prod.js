module.exports = {
  /* Shaking-tree-friendly ES2015/2016/2017 */
  presets: [
    ["latest", {
      "es2015": {
        "loose": true,
        "modules": false
      }
    }],
    'react',
  ],
  /* These are installed by airbnb preset */
  plugins: [
    'transform-es3-member-expression-literals',
    'transform-es3-property-literals',
    'transform-jscript',
    ['transform-object-rest-spread', { useBuiltIns: true }]
  ]
};
