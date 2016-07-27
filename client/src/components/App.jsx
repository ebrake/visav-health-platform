import React from 'react';
import logo from '../img/logo.svg';
import '../css/App.css';
import Home from './Home'
import routes from './../routes'
var App = React.createClass({
  render: function () {
    return routes;
  }
});

export default App;

