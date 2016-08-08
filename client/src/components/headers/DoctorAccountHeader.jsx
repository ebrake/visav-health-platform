import React, { Component } from 'react';
import LocalizedStrings from 'react-localization';
import SegmentedControl from 'react-segmented-control'

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
      <div className="DoctorAccountHeader header">
        <h1 className="title">Visav</h1>
        <ul className="horizontal-nav" id="primary-nav">
          <span>Overview</span>
          <span>Patients</span>
          <span>Admin</span>
          <span>Charts</span>
          <span>Telesession</span>
        </ul>
      </div>
    );
  }
});

export default PatientAccountHeader;

