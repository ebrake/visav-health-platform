import React, { Component } from 'react';
import PersonPanel from '../panels/PersonPanel';
import PeopleListPanel from '../panels/PeopleListPanel';

import AccountStore from '../../alt/stores/AccountStore'
import FullscreenAlert from '../misc/FullscreenAlert';
import AuthenticatedPage from './AuthenticatedPage';

class People extends React.Component {
  
  constructor(props) {
    super(props);

    let user = AccountStore.getUser();

    if (user.role.name == 'doctor'){
      this.allowedPeopleLists = ['patients', 'caregivers'];
    }
    else if (user.role.name == 'patient'){
      this.allowedPeopleLists = ['doctors', 'caregivers'];
    }
    else if (user.role.name == 'caregiver'){
      this.allowedPeopleLists = ['doctors', 'patients'];
    }
    else if (user.role.name == 'owner' || user.role.name == 'admin'){
      this.allowedPeopleLists = ['doctors', 'patients', 'caregivers', 'admins'];
    }

    this.state = {
      showPersonPopup: false,
      displayedPerson: null,
    };

    this.closePersonPopup = this.closePersonPopup.bind(this);
    this.didSelectPerson = this.didSelectPerson.bind(this);
  }

  didSelectPerson(event, person){
    console.dir(person);
    this.setState({ showPersonPopup: true, displayedPerson: person });
  }

  closePersonPopup(){
    this.setState({ showPersonPopup: false,  displayedPerson: null });
  }

  render() {
    return (
      <div className="People content-container row-gt-sm">
        <FullscreenAlert active={ this.state.showPersonPopup } onClickOutside={ this.closePersonPopup }  content={<PersonPanel person={ this.state.displayedPerson } />} />

        {
          this.allowedPeopleLists.map(function(role, i){
            return <PeopleListPanel displayedRole={role}  key={i} onSelectPerson={ this.didSelectPerson } />
          }.bind(this))
        }
      </div>
    );
  }
}

export default AuthenticatedPage(People);
