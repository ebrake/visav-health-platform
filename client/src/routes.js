import React from 'react';
import { Router, Route, hashHistory } from 'react-router'
import Home from './components/Home.jsx'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'

var routes = (
  <Router history={hashHistory}>
    <Route path="/" component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
  </Router>
);

export default routes;
