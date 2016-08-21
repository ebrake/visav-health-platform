import React, { Component } from 'react';
import LocalizedStrings from 'react-localization';
import MainHeader from '../../headers/MainHeader'
import AuthenticatedPage from '../AuthenticatedPage';
import AccountStore from '../../../alt/stores/AccountStore';

let strings = new LocalizedStrings({
  en:{
   welcome:"Welcome to Visav",
   english:"English",
   french:"French"
  },
  fr: {
   welcome:"Bienvenue à Visav",
   english:"Anglais",
   french:"Français"
  }
});
class DoctorProfile extends React.Component {
  constructor(props) {
    super(props);
    let accountState = AccountStore.getState();
    this.state = {
      language: 'en',
      user: accountState.user
    };
    this.updateLanguage = this.updateLanguage.bind(this);
  } 
  updateLanguage(language) {
    strings.setLanguage(language);
    this.setState({language: language});
  }
  render() {
    return (
      <div className="DoctorProfile profile content-container">
        <div id="welcome">
          <h2>{strings.welcome}, {this.state.user.name}</h2>
        </div>
      </div>
    );
  }
};

export default AuthenticatedPage(DoctorProfile);

