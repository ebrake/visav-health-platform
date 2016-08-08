import React, { Component } from 'react';
import LocalizedStrings from 'react-localization';
import PatientInfoPanel from '../../panels/PatientInfoPanel'
import PatientAccountHeader from '../../headers/PatientAccountHeader'
let strings = new LocalizedStrings({
  en:{
   welcome:"Welcome to Visav!",
   english:"English",
   french:"French"
  },
  fr: {
   welcome:"Bienvenue à Visav!",
   english:"Anglais",
   french:"Français"
  }
});
let user = {
  name: 'Gaius Maximus Testicles-Popadopalous'
};
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
    return {
      language: 'en'
    };
  },
  render: function () {
    return (
      <div className="PatientProfile profile">
        <PatientAccountHeader />
        <div id="welcome">
          <h2>{strings.welcome}, {user.name}</h2>
        </div>
        <PatientInfoPanel user={user} />
      </div>
    );
  }
});

export default PatientProfile;

