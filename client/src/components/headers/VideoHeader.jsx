import React, { Component } from 'react';
import LocalizedStrings from 'react-localization';
import SegmentedControl from 'react-segmented-control'
import NavItem from '../lists/NavItem'
class VideoHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render () {
    return (
      <div className="VideoHeader header">
        <div className="header-row">
          <h1 className="title">Visav</h1>
          <ul className="horizontal-nav nav" id="primary-nav">
            <NavItem title="Overview" imgSrc="/src/img/logo.svg" path="/me" />
            <NavItem title="Charts" />
            <NavItem title="Telesession" />
            <NavItem title="Logout" />
          </ul>
        </div>
      </div>
    );
  }
};


export default VideoHeader;
