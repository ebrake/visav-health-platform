import React, { Component } from 'react';

class VISAV extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render () {
    return (
      <div className="visav-logo title">
        <div className="logo-letter-container dark-blue"><span className="logo-letter">V</span></div>
        <div className="logo-letter-container light-blue"><span className="logo-letter">I</span></div>
        <div className="logo-letter-container purple"><span className="logo-letter">S</span></div>
        <div className="logo-letter-container orange"><span className="logo-letter">A</span></div>
        <div className="logo-letter-container red"><span className="logo-letter">V</span></div>
      </div>
    );
  }
};

export default VISAV;
