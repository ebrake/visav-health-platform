import React, { Component } from 'react';
import LocalizedStrings from 'react-localization';
import SegmentedControl from 'react-segmented-control'
import HealthEventStore from '../../alt/stores/HealthEventStore';
import ExerciseStore from '../../alt/stores/ExerciseStore';

class PatientInfoPanel extends React.Component {
  
  constructor(props) {
    super(props);
    let healthEventState = HealthEventStore.getState();
    let exerciseState = ExerciseStore.getState();
    this.state = {
      lastExercise: exerciseState.exercises[exerciseState.exercises.length - 1] || {},
      lastHealthEvent: healthEventState.healthEvents[healthEventState.healthEvents.length - 1] || {}
    };

    this.healthEventsChanged = this.healthEventsChanged.bind(this);
    this.exercisesChanged = this.exercisesChanged.bind(this);

  }
  healthEventsChanged(healthEventState){
    this.setState({
      lastHealthEvent: healthEventState.healthEvents[healthEventState.healthEvents.length - 1] || {}
    });
  }
  exercisesChanged(exerciseState){
    this.setState({
      lastExercise: exerciseState.exercises[exerciseState.exercises.length - 1] || {}
    });
  }

  componentDidMount(){
    ExerciseStore.listen(this.exercisesChanged);
    HealthEventStore.listen(this.healthEventsChanged);
  }

  componentWillUnmount(){
    ExerciseStore.unlisten(this.exercisesChanged);
    HealthEventStore.unlisten(this.healthEventsChanged);
  }

  render() {
    var healthEventIsDemo;
    if (this.state.lastHealthEvent && this.state.lastHealthEvent.isDemo) {
      healthEventIsDemo = 
      <li>This health event was generated pseudo-randomly. It is not real.</li>
    }
    var exerciseIsDemo;
    if (this.state.lastExercise && this.state.lastExercise.isDemo) {
      exerciseIsDemo = 
      <li>This exercise was generated pseudo-randomly. It is not real.</li>
    }
    return (
      <div className="PatientInfoPanel panel">
        <h1 className="title">Patient Information</h1>
        <div className="columns">
          <div className="left-column">
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
          <div className="right-column">
            <h2 className="title">Last Exercise</h2>
            <ul id="exercise-info-list">
              <li>Type: {this.state.lastExercise.type}</li>
              <li>Date: {(new Date(this.state.lastExercise.date)).toLocaleString()}</li>
              <li>Exercise length: {(Number(this.state.lastExercise.duration)/1000).toFixed(1)} seconds</li>
              {exerciseIsDemo}
            </ul>

            <h2 className="title">Last Health Event</h2>
            <ul id="health-event-info-list">
              <li>Type: {this.state.lastHealthEvent.type}</li>
              <li>Intensity: {(this.state.lastHealthEvent.intensity*10).toFixed(1)}</li>
              <li>Perceived Trend: {this.state.lastHealthEvent.perceivedTrend}</li>
              <li>Date: {(new Date(this.state.lastExercise.date)).toLocaleString()}</li>
              {healthEventIsDemo}
            </ul>
          </div>
        </div>
      </div>
    );
  }
};

PatientInfoPanel.propTypes = {
  patient: React.PropTypes.object
};

export default PatientInfoPanel;

