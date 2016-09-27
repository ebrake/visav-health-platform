import React, { Component } from 'react';

class VISAV extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render () {
    return (
      <div className="visav-logo title">
        <div className="logo-letter-container dark-blue"><div className="logo-letter">V</div></div>
        <div className="logo-letter-container light-blue"><div className="logo-letter">I</div></div>
        <div className="logo-letter-container purple"><div className="logo-letter">S</div></div>
        <div className="logo-letter-container orange"><div className="logo-letter">A</div></div>
        <div className="logo-letter-container red"><div className="logo-letter">V</div></div>
      </div>
    );
  }
};

export default VISAV;
