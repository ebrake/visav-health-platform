import React, { Component } from 'react';
import RepsChartPanel from '../panels/RepsChartPanel';
import PatientInfoPanel from '../panels/PatientInfoPanel';
import AccountStore from '../../alt/stores/AccountStore'
import ChatPanel from '../panels/ChatPanel';
import TelesessionPanel from '../panels/TelesessionPanel';

import ExercisesChartPanel from '../panels/ExercisesChartPanel';
import HealthEventsChartPanel from '../panels/HealthEventsChartPanel';
import ExerciseActions from '../../alt/actions/ExerciseActions';
import AuthenticatedPage from './AuthenticatedPage';

import TelesessionStore from '../../alt/stores/TelesessionStore';

class Telesession extends React.Component {
  
  constructor(props) {
    super(props);

    let telesessionState = TelesessionStore.getState();
    let accountState = AccountStore.getState();

    this.telesessionChanged = this.telesessionChanged.bind(this);

    this.state = {
      loggedInUser: accountState.user,
      activeSession: null
    };

  }

  componentDidMount(){
    TelesessionStore.listen(this.telesessionChanged);
  }

  componentWillUnmount(){
    TelesessionStore.unlisten(this.telesessionChanged);
  }

  telesessionChanged(telesessionState) {

    // Updates state->activeSession if it's changed from TelesessionStore
    // (To hide or display chat panel)
    if (telesessionState.activeSession) {
      if (telesessionState.activeSession != this.state.activeSession) {
        this.setState({
          activeSession: telesessionState.activeSession
        });
      }
    }
  }

  render() {

    // To hide or display chat panel
    var chatPanel = this.state.activeSession ? <ChatPanel /> : null;

    return (
      <div className="Telesession content-container row-gt-sm">
        <div className="left-column charts-container">
          <RepsChartPanel />
          <ExercisesChartPanel />
          <HealthEventsChartPanel />
        </div>
        <div className="right-column">
          <TelesessionPanel user={this.state.loggedInUser} />
          <PatientInfoPanel user={this.state.loggedInUser} />
          { chatPanel }
        </div>
      </div>
    );
  }
}

export default AuthenticatedPage(Telesession);
