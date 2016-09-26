/* eslint-disable no-unused-vars */

//try and keep this up to date with colors.css

var brightBlue = '114, 153, 204'
  , lightBlue = '150, 156, 180'
  , purple = '167, 146, 224'
  , mediumDarkGrey = '69, 69, 69'
  , lightGrey = '170, 170, 170'
  , lightestGrey = '221, 221, 221'
  , orange = '237, 165, 57'
  , red = '244, 87, 87'
  , green = '227, 227, 4'
  , white = '255, 255, 255'
  , graphColors = [
      brightBlue,
      purple,
      orange,
      red,
      green
    ]
  , fontColors = {
      'dark': mediumDarkGrey,
      'medium': lightGrey,
      'light': lightestGrey,
      'secondary': lightBlue,
      'highlight': brightBlue,
      'faded': mediumDarkGrey,
    };

var toRGB = (color) => {
  return 'rgb('+color+')';
}

var toRGBA = (color, opacity) => {
  opacity = opacity || 1;
  return 'rgba('+color+', '+opacity+')';
}

export default {
  getGraphColor: (i, opacity) => {
    if (i > graphColors.length) return toRGBA(white);
    if (typeof opacity !== 'number') opacity = 1;
    return toRGBA(graphColors[i], opacity);
  },

  getFontColor: (name) => {
    if (!name || !fontColors[name]) 
      return toRGB(lightGrey);

    return toRGB(fontColors[name]);
  },
}