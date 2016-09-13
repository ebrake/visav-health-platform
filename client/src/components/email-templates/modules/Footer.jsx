import React from 'react';
import EmptySpace from './EmptySpace';

const Footer = (props) => {

  const footerContainerStyle = {
    color: props.color,
    backgroundColor: '#dddddd',
    padding: '20px'
  };
  const privacyTextStyle = {
    fontSize: '9px',
    color: 'black',
    margin: '0px 0px 10px 0px'

  };
  const privacyHeaderStyle = {
    fontSize: '12px',
    color: 'black',
    margin: '0px 0px 10px 0px'
  }
  const visavTextStyle = {
    fontSize: '10px',
    color: '#555',
    margin: '0px 0px 0px 0px'

  }


  return (
    <div
      className='footer-container'
      style={footerContainerStyle}>
      <h2 style={privacyHeaderStyle}>Privacy Policy</h2>
      <p style={privacyTextStyle}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
      sed do eiusmod tempor incididunt ut labore et dolore magna 
      aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
      ullamco laboris nisi ut aliquip ex ea commodo consequat. 
      Duis aute irure dolor in reprehenderit in voluptate velit 
      esse cillum dolore eu fugiat nulla pariatur. Excepteur sint 
      occaecat cupidatat non proident, sunt in culpa qui officia 
      deserunt mollit anim id est laborum.</p>
      <p style={visavTextStyle}>Powered by <a href='https://visav.io'>Visav</a>. Copyright 2016.</p>
    </div>
  );
};

export default Footer;