import React, { Component } from 'react';
import LocalizedStrings from 'react-localization';
import SegmentedControl from 'react-segmented-control'

var PatientInfoPanel = React.createClass({
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
      <div className="PatientInfoPanel panel">
        <h1 className="title">Patient Info</h1>
        <ul id="patient-info-list">
          <span>Patient Name: {this.props.user.name}</span>
        </ul>
      </div>
    );
  }
});

export default PatientInfoPanel;

