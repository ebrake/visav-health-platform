import React, { Component } from 'react';
import LocalizedStrings from 'react-localization';
import SegmentedControl from 'react-segmented-control'
let strings = new LocalizedStrings({
  en:{
   welcome:"Welcome to Dillinger!",
   english:"English",
   french:"French"
  },
  fr: {
   welcome:"Bienvenue à Dillinger!",
   english:"Anglais",
   french:"Français"
  }
});
var Home = React.createClass({
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
      language: 'fr'
    };
  },
  render: function () {
    return (
      <div className="App page">
        <div className="App-header header-class">
          <h2>{strings.welcome}</h2>
        </div>
        <img src="/src/img/logo.svg"/>
        <SegmentedControl 
          onChange={this.updateLanguage} 
          value={this.state.language}
          name="language">
          <span value="en">{strings.english}</span>
          <span value="fr">{strings.french}</span>
        </SegmentedControl>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>

    );
  }
});

export default Home;

