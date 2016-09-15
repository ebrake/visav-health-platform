import React, { Component } from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
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

@connectToStores
class Telesession extends React.Component {

  static getStores() {
    return [TelesessionStore];
  }

  static getPropsFromStores() {
    return TelesessionStore.getState();
  }
  
  constructor(props) {
    super(props);

    let accountState = AccountStore.getState();

    this.state = {
      loggedInUser: accountState.user
    };

  }

  render() {

    var chatPanel;
    // Display chat panel if TelesessionStore=>activeSession exists
    if (this.props.activeSession) {
      chatPanel = <ChatPanel />
    }

    return (
      <div className="Telesession content-container row-gt-sm">
        <div className="left-column charts-container">
          <RepsChartPanel />
          <ExercisesChartPanel />
          <HealthEventsChartPanel />
        </div>
        <div className="right-column">
          <TelesessionPanel />
          <PatientInfoPanel user={this.state.loggedInUser} />
          { chatPanel }
        </div>
      </div>
    );
  }
}

export default AuthenticatedPage(Telesession);
