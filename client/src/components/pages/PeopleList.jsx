import React, { Component } from 'react';
import PersonPanel from '../panels/PersonPanel';
import PeopleListPanel from '../panels/PeopleListPanel';

import AccountStore from '../../alt/stores/AccountStore'
import FullscreenAlert from '../misc/FullscreenAlert';
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
    else if (accountState.user.role.name == 'owner' || accountState.user.role.name == 'admin'){
      this.allowedPeopleLists = ['doctors', 'patients', 'caregivers', 'admins'];
    }

    this.state = {
      showPersonPopup: false,
      displayedPerson: null,
    };
  }

  didSelectPerson(event, person){
    console.dir(person);
    this.setState({ displayedPerson: person });
    this.launchPersonPopup();
  }

  closePersonPopup(){
    this.setState({ showPersonPopup: false,  displayedPerson: null });
  }

  launchPersonPopup(){
    this.setState({ showPersonPopup: true });
  }
  render() {
    return (
      <div className="PeopleList content-container row-gt-sm">
        <FullscreenAlert active={ this.state.showPersonPopup } onClickOutside={ this.closePersonPopup.bind(this) }  content={<PersonPanel person={ this.state.displayedPerson } />} />

        {
          this.allowedPeopleLists.map(function(role, i){
            return <PeopleListPanel displayedRole={role}  key={i} onSelectPerson={ this.didSelectPerson.bind(this) } />
          }.bind(this))
        }
      </div>
    );
  }
}

export default AuthenticatedPage(PeopleList);
