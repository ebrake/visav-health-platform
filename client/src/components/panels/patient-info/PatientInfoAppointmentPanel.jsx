import React, { Component } from 'react';
import HealthEventStore from '../../../alt/stores/HealthEventStore';
import ExerciseStore from '../../../alt/stores/ExerciseStore';
import InfoList from '../../lists/InfoList'

class PatientInfoAppointmentPanel extends Component {
  
  constructor(props) {
    super(props);

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render() {

    return (
      <div className="PatientInfoAppointmentPanel panel">
        
        <h2 className="title">Next Appointment</h2>


      </div>
    );
  }
};

PatientInfoAppointmentPanel.propTypes = {
  patient: React.PropTypes.object
};

export default PatientInfoAppointmentPanel;

