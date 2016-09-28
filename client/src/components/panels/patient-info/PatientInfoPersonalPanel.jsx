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

    var healthInfoDict = {
      'Medical Conditions': 'Asthma, Arthritis, High Blood Pressure',
      'Medications': 'Advair, Xeljanz, Diuretics, Aerius',
      'Allergies': 'Seasonal, Penicilin'
    }
    return (
      <div className="PatientInfoPersonalPanel panel">
        <h2 className="subsection-title">Patient Information</h2>
        <InfoList infoDict={ infoDict } />

        <h2 className="subsection-title">Health Information</h2>
        <InfoList infoDict={ healthInfoDict } />
      </div>
    );
  }
};

PatientInfoPersonalPanel.propTypes = {
  patient: React.PropTypes.object.isRequired
};

export default PatientInfoPersonalPanel;

