import React, { Component } from 'react';
import HealthEventStore from '../../../alt/stores/HealthEventStore';
import ExerciseStore from '../../../alt/stores/ExerciseStore';
import PatientInfoPersonalPanel from './PatientInfoPersonalPanel';
import PatientInfoExercisePanel from './PatientInfoExercisePanel';

import ImageButton from '../../buttons/ImageButton';

class PatientInfoPanels extends React.Component {
  
  constructor(props) {
    super(props);
    let healthEventState = HealthEventStore.getState();
    let exerciseState = ExerciseStore.getState();
    this.state = {
      displayedContent: null
    };

    this.healthEventsChanged = this.healthEventsChanged.bind(this);
    this.exercisesChanged = this.exercisesChanged.bind(this);

  }
  healthEventsChanged(healthEventState){

  }
  exercisesChanged(exerciseState){

  }

  componentDidMount(){
    ExerciseStore.listen(this.exercisesChanged);
    HealthEventStore.listen(this.healthEventsChanged);
  }

  componentWillUnmount(){
    ExerciseStore.unlisten(this.exercisesChanged);
    HealthEventStore.unlisten(this.healthEventsChanged);
  }

  didSelectSubsection(subsection){
    var self = this;
    var patient = this.props.patient;
    return function(event){
      var content;
      if( subsection === 'main'){
        content = <PatientInfoPersonalPanel patient={ this.props.patient } />
      }
      else if( subsection === 'appointments'){

      }
      else if( subsection === 'medications'){

      }
      else if( subsection === 'exercises'){
        content = <PatientInfoExercisePanel patient={ this.props.patient } />
      }
      else if( subsection === 'reports'){

      }
      self.setState({ displayedContent: content });

    }

  }

  render() {
    return (
      <div className="PatientInfoPanels">
        <div className='displayed-content-container'>
          { this.state.displayedContent }
        </div>
        <div className='vertical-control-panel panel'>
          <ImageButton text='M' onClick={ this.didSelectSubsection('main').bind(this) }/>
          <ImageButton text='A' onClick={ this.didSelectSubsection('appointments').bind(this) }/>
          <ImageButton text='M' onClick={ this.didSelectSubsection('medications').bind(this) }/>
          <ImageButton text='X' onClick={ this.didSelectSubsection('exercises').bind(this) }/>
          <ImageButton text='R' onClick={ this.didSelectSubsection('reports').bind(this) }/>
        </div>
      </div>
    );
  }
};

PatientInfoPanels.propTypes = {
  patient: React.PropTypes.object
};

export default PatientInfoPanels;

