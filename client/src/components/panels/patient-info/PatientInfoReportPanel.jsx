import React, { Component } from 'react';
import HealthEventStore from '../../../alt/stores/HealthEventStore';
import ExerciseStore from '../../../alt/stores/ExerciseStore';
import InfoList from '../../lists/InfoList'

class PatientInfoReportPanel extends Component {
  
  constructor(props) {
    super(props);

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render() {

    return (
      <div className="PatientInfoReportPanel panel">
        
        <h2 className="title">Reports</h2>


      </div>
    );
  }
};

PatientInfoReportPanel.propTypes = {
  patient: React.PropTypes.object
};

export default PatientInfoReportPanel;

