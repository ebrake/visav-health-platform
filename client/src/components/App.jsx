import React, { Component } from 'react';
import logo from '../img/logo.svg';
import '../css/App.css';
import { Router, Route, Link, browserHistory } from 'react-router'
import Home from './Home'
import { hashHistory } from 'react-router'

var App = React.createClass({
  render: function () {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={Home} />
      </Router>
    );
  }
});

export default App;

