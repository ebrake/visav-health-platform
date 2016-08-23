import React, { Component } from 'react';
import LocalizedStrings from 'react-localization';
import SegmentedControl from 'react-segmented-control'

class PatientInfoPanel extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div className="PatientInfoPanel panel">
        <h1 className="title">Patient Info</h1>
        <ul id="patient-info-list">
          <span>Patient Name: {this.props.user.firstName} {this.props.user.lastName}</span>
        </ul>
      </div>
    );
  }
};

PatientInfoPanel.propTypes = {
  user: React.PropTypes.object.isRequired
};

export default PatientInfoPanel;

