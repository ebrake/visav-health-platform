import React from 'react';
import { Router, Route, hashHistory } from 'react-router'
import AccountStore from './alt/stores/AccountStore';
import AccountActions from './alt/actions/AccountActions';

import Home from './components/pages/Home.jsx'
import Charts from './components/pages/Charts.jsx'
import Telesession from './components/pages/Telesession.jsx'
import PatientProfile from './components/pages/patient/PatientProfile'
import DoctorProfile from './components/pages/doctor/DoctorProfile'
import Login from './components/pages/Login.jsx'
import Signup from './components/pages/Signup.jsx'
var authCheck = (nextState, replace) => {
  return;
  let state = AccountStore.getState();
  if (!state.user) {
    console.log('Not logged in... redirecting...');
    replace('/login');
  }
};
var logout = (nextState, replace) => {
  AccountActions.logoutUser();
  console.log('Logged out... redirecting...');
  replace('/login');
};
var routes = (
  <Router history={hashHistory}>
    <Route path="/" component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    <Route path="/charts" component={Charts} onEnter={authCheck} />
    <Route path="/telesession" component={Telesession} onEnter={authCheck} />
    <Route path="/patient" component={PatientProfile} onEnter={authCheck} />
    <Route path="/me" component={PatientProfile} onEnter={authCheck} />
    <Route path="/doctor" component={DoctorProfile} onEnter={authCheck} />
    <Route path="/logout" onEnter={logout} />
  </Router>
);


export default routes;
