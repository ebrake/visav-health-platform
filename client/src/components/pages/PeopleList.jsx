import React, { Component } from 'react';
import RepsChartPanel from '../panels/RepsChartPanel';
import PatientInfoPanel from '../panels/PatientInfoPanel';
import AccountStore from '../../alt/stores/AccountStore'
import TelesessionPanel from '../panels/TelesessionPanel';

import ExercisesChartPanel from '../panels/ExercisesChartPanel';
import HealthEventsChartPanel from '../panels/HealthEventsChartPanel';
import ExerciseActions from '../../alt/actions/ExerciseActions';
import AuthenticatedPage from './AuthenticatedPage';

class PeopleList extends React.Component {
  
  constructor(props) {
    super(props);
    let accountState = AccountStore.getState();
    this.userRole = accountState.role;
    if(accountState.role == 'doctor'){
      this.allowedPeopleLists = ['doctors', 'patients', 'caregivers', 'owners', 'admins'];
    }
    else if (accountState.role == 'patient'){
      this.allowedPeopleLists = ['admins', 'doctors', 'caregivers'];
    }
    else if (accountState.roll == 'owner'){
      this.allowedPeopleLists = ['doctors', 'patients', 'caregivers', 'owners', 'admins'];
    }
    else if (accountState.roll == 'admin'){
      this.allowedPeopleLists = ['doctors', 'patients', 'caregivers', 'owners', 'admins'];
    }

  }

  render() {
    return (
      <div className="PeopleList content-container row-gt-sm">
        {
          return this.allowedPeopleLists.map(function(role){
            return <PeopleListPanel userRole={this.userRole} displayedRole={role} />
          })
        }
      </div>
    );
  }
}

export default AuthenticatedPage(PeopleList);
