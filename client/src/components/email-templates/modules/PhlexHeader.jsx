import React from 'react';
import phlexColors from '../../utils/phlexColors';

const Header = (props) => {
  const style = {
    width: '100%',
    margin: '50px 0px 30px 0px'
  }
  const h1Style = {
    width: '100%',
    fontSize: '80px',
    color: phlexColors.getColor('blue'),
    fontFamily: 'Arial',
    textAlign: 'center',
    margin: '0 auto'
  }

  return (
    <div style={style}>
      <h1 style={h1Style}>Phlex RS</h1>
    </div>
  );
};


export default Header;