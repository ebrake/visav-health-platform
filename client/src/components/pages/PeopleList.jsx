import React, { Component } from 'react';
import PeopleListPanel from '../panels/PeopleListPanel';
import AccountStore from '../../alt/stores/AccountStore'

import AuthenticatedPage from './AuthenticatedPage';

class PeopleList extends React.Component {
  
  constructor(props) {

    super(props);
    let accountState = AccountStore.getState();

    if (accountState.user.role.name == 'doctor'){
      this.allowedPeopleLists = ['patients', 'caregivers'];
    }
    else if (accountState.user.role.name == 'patient'){
      this.allowedPeopleLists = ['doctors', 'caregivers'];
    }
    else if (accountState.user.role.name == 'caregiver'){
      this.allowedPeopleLists = ['doctors', 'patients'];
    }
    else if (accountState.user.role.name == 'owner' || accountState.user.role == 'admin'){
      this.allowedPeopleLists = ['doctors', 'patients', 'caregivers', 'admins'];
    }


  }

  render() {
    return (
      <div className="PeopleList content-container row-gt-sm">
        {
          this.allowedPeopleLists.map(function(role, i){
            return <PeopleListPanel displayedRole={role}  key={i}/>
          })
        }
      </div>
    );
  }
}

export default AuthenticatedPage(PeopleList);
