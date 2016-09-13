import React, { Component } from 'react';
import NavItem from '../nav/NavItem'
class MainHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render () {
    return (
      <div className="MainHeader header">
        <div className="header-row">
          <h1 className="title">Visav</h1>
          <ul className="horizontal-nav nav" id="primary-nav">
            <NavItem title="Invite" />
            <NavItem title="Logout" imgSrc="logout.png" />
          </ul>
        </div>
      </div>
    );
  }
};

export default MainHeader;
