import connectToStores from 'alt-utils/lib/connectToStores';

import React, { Component } from 'react';
import RepsChartPanel from '../panels/RepsChartPanel';
import PatientInfoPanels from '../panels/patient-info/PatientInfoPanels';
import TelesessionPanels from '../panels/TelesessionPanels';

import ExercisesChartPanel from '../panels/ExercisesChartPanel';
import HealthEventsChartPanel from '../panels/HealthEventsChartPanel';
import ExerciseActions from '../../alt/actions/ExerciseActions';
import AuthenticatedPage from './AuthenticatedPage';
import FullscreenAlert from '../misc/FullscreenAlert';

import AccountStore from '../../alt/stores/AccountStore';
import OrganizationActions from '../../alt/actions/OrganizationActions';
import ChatPanel from '../panels/ChatPanel';

import TelesessionStore from '../../alt/stores/TelesessionStore';

class Telesession extends React.Component {

  static getStores() {
    return [TelesessionStore];
  }

  static getPropsFromStores() {
    return TelesessionStore.getState();
  }
  
  constructor(props) {
    super(props);
    let user = AccountStore.getUser();

    this.state = {
      user: user,
      patient: undefined,
      patientId: this.props.location.query.patient || 2
    };
  }

  componentDidMount() {
    OrganizationActions.getPatient(this.state.patientId)
    .then(function(response){
      if (response.data && response.data.status === 'success') {
        this.setState({
          patient: response.data.patient
        })
      }
    }.bind(this))
  }

  render() {

    console.log("PROPS",this.props);

    var chatPanel;
    // Display chat panel if TelesessionStore=>activeSession exists
    if (this.props.activeSession) {
      chatPanel = <ChatPanel />
    }

    return (
      <div className="Telesession content-container row-gt-sm">
        <div className="left-column charts-container">
          <RepsChartPanel patientId={this.state.patientId} />
          <ExercisesChartPanel patientId={this.state.patientId} />
          <HealthEventsChartPanel patientId={this.state.patientId} />
        </div>
        <div className="right-column">
          <TelesessionPanels patient={this.state.patient} />
          <PatientInfoPanels patient={this.state.patient} />
          { chatPanel }
        </div>
      </div>
    );
  }
}

export default AuthenticatedPage(connectToStores(Telesession));
