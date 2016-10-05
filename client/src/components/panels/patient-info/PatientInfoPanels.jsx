import React, { Component } from 'react';
import HealthEventStore from '../../../alt/stores/HealthEventStore';
import ExerciseStore from '../../../alt/stores/ExerciseStore';
import PatientInfoPersonalPanel from './PatientInfoPersonalPanel';
import PatientInfoExercisePanel from './PatientInfoExercisePanel';
import PatientInfoAppointmentPanel from './PatientInfoAppointmentPanel';
import PatientInfoMedicationPanel from './PatientInfoMedicationPanel';
import PatientInfoReportPanel from './PatientInfoReportPanel';
import PatientInfoChatPanel from './PatientInfoChatPanel';
import VisavIcon from '../../misc/VisavIcon';

class PatientInfoPanels extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      displayedContent: <PatientInfoPersonalPanel patient={ this.props.patient } />,
      selectedSubsection: 'main'
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

      this.setState({ 
        displayedContent: content,
        selectedSubsection: subsection
      });
    }.bind(this)
  }

  render() {
    return (
      <div className="PatientInfoPanels">
        { this.state.displayedContent }
        <div className='vertical-control-panel panel'>
          <VisavIcon type='general-patient-info' onClick={ this.didSelectSubsection('main') } selected={this.state.selectedSubsection === 'main'} />
          <VisavIcon type='next-appointment' onClick={ this.didSelectSubsection('appointment') } selected={this.state.selectedSubsection === 'appointment'} />
          <VisavIcon type='medications' onClick={ this.didSelectSubsection('medication') } selected={this.state.selectedSubsection === 'medication'} />
          <VisavIcon type='exercises' onClick={ this.didSelectSubsection('exercise') } selected={this.state.selectedSubsection === 'exercise'} />
          <VisavIcon type='reports' onClick={ this.didSelectSubsection('report') } selected={this.state.selectedSubsection === 'report'} />
          <VisavIcon type='chat' onClick={ this.didSelectSubsection('chat') } selected={this.state.selectedSubsection === 'chat'} />
        </div>
      </div>
    );
  }
};

PatientInfoPanels.propTypes = {
  patient: React.PropTypes.object
};

export default PatientInfoPanels;

