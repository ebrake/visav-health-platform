import React, { Component } from 'react';
import HealthEventStore from '../../../alt/stores/HealthEventStore';
import ExerciseStore from '../../../alt/stores/ExerciseStore';
import InfoList from '../../lists/InfoList'

class PatientInfoChatPanel extends Component {
  
  constructor(props) {
    super(props);

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render() {

    return (
      <div className="PatientInfoChatPanel panel">
        
        <h2 className="title">Chat</h2>


      </div>
    );
  }
};

PatientInfoChatPanel.propTypes = {
  patient: React.PropTypes.object
};

export default PatientInfoChatPanel;

