import React from 'react';
import EmptySpace from './EmptySpace';

export default (props) => {

  const bodyStyle = {
    color: props.textColor,
    backgroundColor: props.backgroundColor,
    fontFamily: 'Arial',
    fontSize: '18px',
    textAlign: 'center',
    padding: '20px',
    margin: '0px 0px 30px 0px'
  };

  return (
    <div className="content" style={bodyStyle}>
      {props.children}
    </div>
  );
};