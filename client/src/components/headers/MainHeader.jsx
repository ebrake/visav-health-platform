import React, { Component } from 'react';
import LocalizedStrings from 'react-localization';
import SegmentedControl from 'react-segmented-control'
import NavItem from '../nav/NavItem'
var PatientAccountHeader = React.createClass({
  propTypes: {
    user: React.PropTypes.object.isRequired
  },
  mixins: null,
  cursors: {
    list: ['list']
  },
  getInitialState() {
    return {

    };
  },
  render: function () {
    return (
      <div className="MainHeader header">
        <div className="header-row">
          <h1 className="title">Visav</h1>
          <ul className="horizontal-nav nav" id="primary-nav">
            <NavItem title="Overview" imgSrc="/src/img/logo.svg" />
            <NavItem title="Charts" />
            <NavItem title="Telesession" />
            <NavItem title="Logout" />
          </ul>
        </div>
      </div>
    );
  }
});

export default PatientAccountHeader;

