import React from 'react';
import EmptySpace from './EmptySpace';
import colors from '../../utils/colors';

export default (props) => {
  const bodyStyle = {
    color: props.textColor  || 'black',
    backgroundColor: props.backgroundColor,
    fontFamily: 'Arial',
    fontSize: '18px',
    textAlign: 'center',
    padding: '20px',
    margin: '20px 0px 20px 0px'
  };

  return (
    <div className="content" style={bodyStyle}>
      {props.children}
    </div>
  );
};