import React, { Component } from 'react';
import LocalizedStrings from 'react-localization';
import PatientInfoPanel from '../../panels/PatientInfoPanel'
import MainHeader from '../../headers/MainHeader'
import AccountStore from '../../../alt/stores/AccountStore'

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

var PatientProfile = React.createClass({
  mixins: null,
  cursors: {
    list: ['list']
  },
  updateLanguage: function(language) {
    strings.setLanguage(language);
    this.setState({language: language});
  },
  getInitialState() {
    let accountState = AccountStore.getState();
    return {
      language: 'en',
      user: accountState.user
    };
  },
  render: function () {
    return (
      <div className="PatientProfile profile page">
        <MainHeader />
        <div id="welcome">
          <h2>{strings.welcome}, {this.state.user.name}</h2>
        </div>
        <PatientInfoPanel user={this.state.user} />
      </div>
    );
  }
});

export default PatientProfile;

