import React, { Component } from 'react';
import HealthEventStore from '../../../alt/stores/HealthEventStore';
import ExerciseStore from '../../../alt/stores/ExerciseStore';

class PatientInfoPersonalPanel extends React.Component {
  
  constructor(props) {
    super(props);
  }



  render() {
    
    return (
      <div className="PatientInfoPersonalPanel panel">
        <h1 className="title">Patient Information</h1>

          <h2 className="title">Medical Information</h2>
          <ul id="patient-info-list">
            <li>Name: {this.props.patient ? this.props.patient.firstName+' '+this.props.patient.lastName : ''}</li>
            <li>Date of Birth: 23/04/1976 (40 years old)</li>
            <li>Gender: Male</li>
            <li>{"Height: 6'11\""}</li>
            <li>Weight: 284lbs</li>
            <li>ID: 12313513221</li>
            <li>Known conditions:
              <ul>
                <li>Asthma</li>
                <li>Diabetes (Type II)</li>
                <li>Left ACL partial tear (repaired)</li>
              </ul>
            </li>
            <li>Caregivers:
              <ul>
                <li>Jane Doe (Spouse)</li>
              </ul>
            </li>
            <li>Doctors:
              <ul>
                <li>Dr. John Johnson (Primary Physician)</li>
              </ul>
            </li>
          </ul>

      </div>
    );
  }
};

PatientInfoPersonalPanel.propTypes = {
  patient: React.PropTypes.object
};

export default PatientInfoPersonalPanel;

