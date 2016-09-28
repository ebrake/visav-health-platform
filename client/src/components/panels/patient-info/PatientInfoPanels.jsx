import React, { Component } from 'react';
import HealthEventStore from '../../../alt/stores/HealthEventStore';
import ExerciseStore from '../../../alt/stores/ExerciseStore';
import PatientInfoPersonalPanel from './PatientInfoPersonalPanel';
import PatientInfoExercisePanel from './PatientInfoExercisePanel';
import PatientInfoAppointmentPanel from './PatientInfoAppointmentPanel';
import PatientInfoMedicationPanel from './PatientInfoMedicationPanel';
import PatientInfoReportPanel from './PatientInfoReportPanel';
import PatientInfoChatPanel from './PatientInfoChatPanel';

import ImageButton from '../../buttons/ImageButton';

class PatientInfoPanels extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      displayedContent: <PatientInfoPersonalPanel patient={ this.props.patient } />
    };
  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.patient && JSON.stringify(nextProps.patient) != JSON.stringify(this.props.patient)) {
      this.setState({
        displayedContent: <PatientInfoPersonalPanel patient={ nextProps.patient } />
      });
    }
  }

  didSelectSubsection(subsection){
    var self = this;
    var patient = this.props.patient;
    return function(event){
      var content;
      if( subsection === 'main'){
        content = <PatientInfoPersonalPanel patient={ this.props.patient } />
      }
      else if( subsection === 'appointment'){
        content = <PatientInfoAppointmentPanel patient={ this.props.patient } />

      }
      else if( subsection === 'medication'){
        content = <PatientInfoMedicationPanel patient={ this.props.patient } />

      }
      else if( subsection === 'exercise'){
        content = <PatientInfoExercisePanel patient={ this.props.patient } />
      }
      else if( subsection === 'report'){
        content = <PatientInfoReportPanel patient={ this.props.patient } />

      }
      else if( subsection === 'chat'){
        content = <PatientInfoChatPanel patient={ this.props.patient } />

      }
      self.setState({ displayedContent: content });

    }

  }

  render() {
    return (
      <div className="PatientInfoPanels">
        { this.state.displayedContent }
        <div className='vertical-control-panel panel'>
          <ImageButton text='M' onClick={ this.didSelectSubsection('main').bind(this) }/>
          <ImageButton text='A' onClick={ this.didSelectSubsection('appointment').bind(this) }/>
          <ImageButton text='M' onClick={ this.didSelectSubsection('medication').bind(this) }/>
          <ImageButton text='X' onClick={ this.didSelectSubsection('exercise').bind(this) }/>
          <ImageButton text='R' onClick={ this.didSelectSubsection('report').bind(this) }/>
          <ImageButton text='C' onClick={ this.didSelectSubsection('chat').bind(this) }/>

        </div>
      </div>
    );
  }
};

PatientInfoPanels.propTypes = {
  patient: React.PropTypes.object
};

export default PatientInfoPanels;

