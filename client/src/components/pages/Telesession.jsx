import React, { Component } from 'react';
import RepsChartPanel from '../panels/RepsChartPanel';
import PatientInfoPanel from '../panels/PatientInfoPanel';
import TelesessionPanels from '../panels/TelesessionPanels';

import ExercisesChartPanel from '../panels/ExercisesChartPanel';
import HealthEventsChartPanel from '../panels/HealthEventsChartPanel';
import ExerciseActions from '../../alt/actions/ExerciseActions';
import AuthenticatedPage from './AuthenticatedPage';
import FullscreenAlert from '../misc/FullscreenAlert';

import AccountStore from '../../alt/stores/AccountStore';
import OrganizationActions from '../../alt/actions/OrganizationActions';

class Telesession extends React.Component {
  
  constructor(props) {
    super(props);
    let user = AccountStore.getUser();

    this.state = {
      user: user,
      patient: undefined,
      patientId: this.props.location.query.patient || ''
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
    return (
      <div className="Telesession content-container row-gt-sm">
        <div className="left-column charts-container">
          <RepsChartPanel patientId={this.state.patientId} />
          <ExercisesChartPanel patientId={this.state.patientId} />
          <HealthEventsChartPanel patientId={this.state.patientId} />
        </div>
        <div className="right-column">
          <TelesessionPanels patient={this.state.patient} />
          <PatientInfoPanel patient={this.state.patient} />
        </div>
      </div>
    );
  }
}

export default AuthenticatedPage(Telesession);
