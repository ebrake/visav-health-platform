/* eslint-disable no-unused-vars */

var colors = {
    'blue' : '69, 200, 229',
    'darkestGrey' : '41,44,54',
    'darkGrey' : '69,72,83',
    'grey' : '92,94,102',
    'lightGrey' : '115,118,128',
    'lightestGrey' : '238,238,238',
    'orange' : '237, 165, 57',
    'red' : '244, 87, 87',
    'yellow' : '229, 183, 82'
  },
  fontColors = {
    'dark': colors['darkGrey'],
    'medium': colors['lightGrey'],
    'light': colors['lightestGrey'],
    'secondary': colors['blue'],
    'highlight': colors['blue'],
    'faded': colors['grey'],
  };

var toRGB = (color) => {
  return 'rgb('+color+')';
}

var toRGBA = (color, opacity) => {
  opacity = opacity || 1;
  return 'rgba('+color+', '+opacity+')';
}

export default {
  getColor: (name) => {
    if (!colors[name]) 
      return 'black';

    return toRGB(colors[name]);
  },
  getFontColor: (name) => {
    if (!name || !fontColors[name]) 
      return toRGB('lightGrey');

    return toRGB(fontColors[name]);
  }
}