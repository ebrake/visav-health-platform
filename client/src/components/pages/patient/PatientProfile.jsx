import React, { Component } from 'react';
import LocalizedStrings from 'react-localization';
import PatientInfoPanel from '../../panels/PatientInfoPanel'
import MainHeader from '../../headers/MainHeader'
import AccountStore from '../../../alt/stores/AccountStore'
import ExerciseStore from '../../../alt/stores/ExerciseStore';
import ExerciseActions from '../../../alt/actions/ExerciseActions';


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

    this.state = {
      language: 'en',
      user: accountState.user,
      exercises: []
    };

    this.updateLanguage = this.updateLanguage.bind(this);
    this.exercisesChanged = this.exercisesChanged.bind(this);
  } 

  updateLanguage(language) {
    strings.setLanguage(language);
    this.setState({language: language});
  }

  exercisesChanged(exerciseState) {
    this.setState({
      exercises: exerciseState.exercises
    });
    console.log('exercises:');
    console.dir(this.state.exercises);
  }

  componentDidMount(){
    ExerciseStore.listen(this.exercisesChanged);
  }

  componentWillUnmount(){
    ExerciseStore.unlisten(this.exercisesChanged);
  }

  render() {
    return (
      <div className="PatientProfile profile page">
        <MainHeader />
        <div id="welcome">
          <h2>{strings.welcome}, {this.state.user.name}</h2>
        </div>
        <PatientInfoPanel user={this.state.user} />
      </div>
    );
  }
};

export default PatientProfile;

