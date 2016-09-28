import React, { Component } from 'react';
import HealthEventStore from '../../../alt/stores/HealthEventStore';
import ExerciseStore from '../../../alt/stores/ExerciseStore';
import InfoList from '../../lists/InfoList'

class PatientInfoMedicationPanel extends React.Component {
  
  constructor(props) {
    super(props);

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render() {

    return (
      <div className="PatientInfoMedicationPanel panel">
        
        <h2 className="title">Medications</h2>


      </div>
    );
  }
};

PatientInfoMedicationPanel.propTypes = {
  patient: React.PropTypes.object
};

export default PatientInfoMedicationPanel;

