import React, { Component } from 'react';
import LocalizedStrings from 'react-localization';
import DoctorAccountHeader from '../../headers/DoctorAccountHeader'
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
var DoctorProfile = React.createClass({
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
      <div className="DoctorProfile profile">
        <DoctorAccountHeader />

        <div id="welcome">
          <h2>{strings.welcome}, {user.name}</h2>
        </div>
      </div>
    );
  }
});

export default DoctorProfile;

