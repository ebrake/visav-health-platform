import React, { Component } from 'react';
import scriptLoader from 'react-async-script-loader'
import MainHeader from '../headers/MainHeader';
import RepsChartPanel from '../panels/RepsChartPanel';
import PatientInfoPanel from '../panels/PatientInfoPanel';
import AccountStore from '../../alt/stores/AccountStore'
import TelesessionPanel from '../panels/TelesessionPanel';

import ExercisesChartPanel from '../panels/ExercisesChartPanel';
import HealthEventsChartPanel from '../panels/HealthEventsChartPanel';
import ExerciseActions from '../../alt/actions/ExerciseActions';
import AuthenticatedPage from './AuthenticatedPage';

@scriptLoader(
  'https://static.opentok.com/v2/js/opentok.min.js'
)

class Telesession extends React.Component {
  
  constructor(props) {
    super(props);
    let accountState = AccountStore.getState();

    this.state = {
      loggedInUser: accountState.user
    };
  }

  render() {
    return (
      <div className="Telesession content-container row-gt-sm">
        <div className="left-column">
          <div className="charts-container" >
            <RepsChartPanel />
            <ExercisesChartPanel />
            <HealthEventsChartPanel />
          </div>
        </div>
        <div className="right-column">
          <TelesessionPanel />
          <PatientInfoPanel user={this.state.loggedInUser} />

        </div>
        
      </div>
    );
  }
}

export default AuthenticatedPage(Telesession);
