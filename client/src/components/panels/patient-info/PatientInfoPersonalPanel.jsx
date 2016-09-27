import React, { Component } from 'react';
import HealthEventStore from '../../../alt/stores/HealthEventStore';
import ExerciseStore from '../../../alt/stores/ExerciseStore';
import InfoList from '../../lists/InfoList'

class PatientInfoPersonalPanel extends React.Component {
  
  constructor(props) {
    super(props);
  }

  render() {
    var infoDict = {
      'Name': this.props.patient ? this.props.patient.firstName+' '+this.props.patient.lastName : '',
      'Gender': 'Male',
      'Date of Birth': '23/04/1976 (40 years old)'
    }
    return (
      <div className="PatientInfoPersonalPanel panel">
        <h1 className="title">Patient Information</h1>
        <InfoList infoDict={ infoDict } />
      </div>
    );
  }
};

PatientInfoPersonalPanel.propTypes = {
  patient: React.PropTypes.object.isRequired
};

export default PatientInfoPersonalPanel;

