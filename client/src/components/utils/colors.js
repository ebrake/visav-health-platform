/* eslint-disable no-unused-vars */

//try and keep this up to date with colors.css

var brightBlue = '114, 153, 204'
  , lightBlue = '150, 156, 180'
  , backgroundBlue = '53, 72, 94'
  , purple = '167, 146, 224'
  , orange = '237, 165, 57'
  , red = '241, 114, 146'
  , green = '126, 196, 126'
  , white = '255, 255, 255'
  , darkGrey = '68, 76, 90'
  , grey = '114, 129, 150'
  , lightGrey = '230, 230, 230'
  , graphColors = [
      brightBlue,
      purple,
      green,
      red,
      orange,
    ]
  , fontColors = {
      'dark': grey,
      'light': lightGrey,
      'secondary': lightBlue,
      'highlight': brightBlue,
      'faded': darkGrey,
    }
  , colors = {
      'background': backgroundBlue
    }

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

  getColor: (name) => {
    if (!name || !colors[name])
      return toRGB(white);

    return toRGB(colors[name]);
  }
}