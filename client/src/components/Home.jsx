import React, { Component } from 'react';
import { Link } from 'react-router';

var Home = React.createClass({
  mixins: null,
  cursors: {
    list: ['list']
  },
  render: function () {

    return (
      <div className="App">
        <div className="App-header header-class">
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
});

export default Home;

