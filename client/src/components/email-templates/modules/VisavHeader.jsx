import React from 'react';
import colors from '../../utils/colors';

const VisavHeader = (props) => {
  const style = {
    width: '100%',
    margin: '50px 0px 20px 0px'
  }

  var letterStyle = {
    width: '80px',
    height: '80px',
    lineHeight: '80px',
    fontSize: '50px',
    color: 'white',
    fontFamily: 'Arial',
    textAlign: 'center',
    margin: '0 5px',
    display: 'inline-block',
    borderRadius: '100%',
  }

  var letterStyle1 = Object.assign({ backgroundColor: colors.getColor('foregroundBlue') }, letterStyle);
  var letterStyle2 = Object.assign({ backgroundColor: colors.getColor('brightBlue') }, letterStyle);
  var letterStyle3 = Object.assign({ backgroundColor: colors.getColor('purple') }, letterStyle);
  var letterStyle4 = Object.assign({ backgroundColor: colors.getColor('orange') }, letterStyle);
  var letterStyle5 = Object.assign({ backgroundColor: colors.getColor('red') }, letterStyle);

  return (
    <div style={style}>
      <span style={ letterStyle1 } >V</span>
      <span style={ letterStyle2 } >I</span>
      <span style={ letterStyle3 } >S</span>
      <span style={ letterStyle4 } >A</span>
      <span style={ letterStyle5 } >V</span>
    </div>
  );
};


export default VisavHeader;