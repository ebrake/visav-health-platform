//try and keep this up to date with colors.css

var brightBlue = '114, 153, 204'
  , lightBlue = '150, 156, 180'
  , mediumBlue = '60, 62, 74'
  , darkBlue = '43, 46, 53'
  , purple = '167, 146, 224'
  , darkestGrey = '17, 17, 17'
  , darkGrey = '37, 37, 37'
  , mediumDarkGrey = '69, 69, 69'
  , mediumLightGrey = '119, 119, 119'
  , lightGrey = '170, 170, 170'
  , lightestGrey = '221, 221, 221'
  , orange = '237, 165, 57'
  , red = '244, 87, 87'
  , green = '227, 227, 4'
  , white = '255, 255, 255'
  , graphColors = [brightBlue, purple, orange, red, green];

export default {
  getGraphColor: (i, opacity) => {
    if (i > graphColors.length) return 'rgb('+white+', '+opacity+')';
    if (typeof opacity !== 'number') opacity = 1;
    return 'rgba('+graphColors[i]+', '+opacity+')';
  }
}