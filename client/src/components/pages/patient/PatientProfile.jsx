import React, { Component } from 'react';
import LocalizedStrings from 'react-localization';
import PatientInfoPanel from '../../panels/PatientInfoPanel'
import MainHeader from '../../headers/MainHeader'
import AccountStore from '../../../alt/stores/AccountStore'
import ExerciseStore from '../../../alt/stores/ExerciseStore';
import ExerciseActions from '../../../alt/actions/ExerciseActions';
import HealthEventStore from '../../../alt/stores/HealthEventStore';
import HealthEventActions from '../../../alt/actions/HealthEventActions';
import AuthenticatedPage from '../AuthenticatedPage';

let strings = new LocalizedStrings({
  en:{
   welcome:"Welcome to Visav",
   english:"English",
   french:"French"
  },
  fr: {
   welcome:"Bienvenue à Visav",
   english:"Anglais",
   french:"Français"
  }
});

class PatientProfile extends React.Component {
  constructor(props) {
    super(props);
    let accountState = AccountStore.getState();

    ExerciseActions.getExercises();
    HealthEventActions.getHealthEvents();

    this.state = {
      language: 'en',
      user: accountState.user,
      exercises: []
    };

    this.updateLanguage = this.updateLanguage.bind(this);
    this.exercisesChanged = this.exercisesChanged.bind(this);
    this.healthEventsChanged = this.healthEventsChanged.bind(this);
  } 

  updateLanguage(language) {
    strings.setLanguage(language);
    this.setState({language: language});
  }

  exercisesChanged(exerciseState) {
    this.setState({
      exercises: exerciseState.exercises
    });
  }

  healthEventsChanged(healthEventState) {
    this.setState({
      healthEvents: healthEventState.healthEvents
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
    return (
      <div className="PatientProfile profile content-container">
        <div id="welcome">
          <h2>{strings.welcome}, {this.state.user.name}</h2>
        </div>
        <PatientInfoPanel user={this.state.user} />
      </div>
    );
  }
};

export default AuthenticatedPage(PatientProfile);

