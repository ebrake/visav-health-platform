import React from 'react';
import { Router, Route, hashHistory } from 'react-router'
import Home from './components/Home.jsx'
import Charts from './components/Charts.jsx'

var routes = (
  <Router history={hashHistory}>
    <Route path="/" component={Home} />
    <Route path="/charts" component={Charts} />
  </Router>
);

export default routes;
