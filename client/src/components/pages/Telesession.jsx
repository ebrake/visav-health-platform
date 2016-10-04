import React, { Component } from 'react';
import HealthEventsChartPanel from '../panels/HealthEventsChartPanel';
import PatientInfoPanels from '../panels/patient-info/PatientInfoPanels';
import TelesessionPanels from '../panels/TelesessionPanels';

import ActivityChartPanel from '../panels/ActivityChartPanel';
import HeartRateChartPanel from '../panels/HeartRateChartPanel';
import ExerciseActions from '../../alt/actions/ExerciseActions';
import AuthenticatedPage from './AuthenticatedPage';
import FullscreenAlert from '../misc/FullscreenAlert';

import AccountStore from '../../alt/stores/AccountStore';
import OrganizationStore from '../../alt/stores/OrganizationStore';
import OrganizationActions from '../../alt/actions/OrganizationActions';

class Telesession extends Component {
  
  constructor(props) {
    super(props);
    let user = AccountStore.getUser();

    this.state = {
      user: user,
      patient: undefined,
      patientId: this.props.location.query.patient || 9
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
      else {
        let orgState = OrganizationStore.getState();
        if (orgState.patients && (orgState.patients.length > 0)) {
          let newPatient = orgState.patients[0];
          this.setState({
            patient: newPatient,
            patientId: newPatient.id
          });
        }
      }
    }.bind(this))
  }

  render() {

    return (
      <div className="Telesession content-container row-gt-sm">
        <div className="left-column charts-container">
          <HealthEventsChartPanel patientId={this.state.patientId} />
          <ActivityChartPanel patientId={this.state.patientId} />
          <HeartRateChartPanel patientId={this.state.patientId} />
        </div>
        <div className="right-column">
          <TelesessionPanels patient={this.state.patient} />
          <PatientInfoPanels patient={this.state.patient} />
        </div>
      </div>
    );
  }
}

export default AuthenticatedPage(Telesession);
