import React from 'react';
import { Router, Route, browserHistory } from 'react-router'
import AccountStore from './alt/stores/AccountStore';
import AccountActions from './alt/actions/AccountActions';
import alt from './alt/alt';

import Telesession from './components/pages/Telesession.jsx'
import PatientProfile from './components/pages/patient/PatientProfile'
import DoctorProfile from './components/pages/doctor/DoctorProfile'
import Login from './components/pages/Login.jsx'
import Signup from './components/pages/Signup.jsx'
import InviteUsers from './components/pages/InviteUsers.jsx'
import EmailGettingStarted from './components/email-templates/GettingStartedEmail'
import HealthEventNotificationEmail from './components/email-templates/HealthEventNotificationEmail'

var cacheStores = () => {
  let snapshot = alt.takeSnapshot();
  localStorage.setItem('snapshot', snapshot);
}

var authCheck = (nextState, replace) => {
  let snapshot = localStorage.getItem('snapshot');
  alt.bootstrap(snapshot);

  let state = AccountStore.getState();
  if (!state.user) {
    console.log('Not logged in... redirecting...');
    replace('/login');
  }
}

var logout = (nextState, replace) => {
  AccountActions.logoutUser();
  console.log('Logged out... redirecting...');
  replace('/login');
};

var routes = (
  <Router history={browserHistory}>
    <Route path="/" component={Telesession} onEnter={authCheck} onLeave={cacheStores} />
    { /* UNAUTHENTICATED PAGES */ }
    <Route path="/login" component={Login} onLeave={cacheStores} />
    <Route path="/signup" component={Signup} onLeave={cacheStores} />
    <Route path="/logout" onEnter={logout} onLeave={cacheStores} />
    { /* AUTHENTICATED PAGES */ }
    <Route path="/telesession" component={Telesession} onEnter={authCheck} onLeave={cacheStores} />
    <Route path="/patient" component={PatientProfile} onEnter={authCheck} onLeave={cacheStores} />
    <Route path="/me" component={Telesession} onEnter={authCheck} onLeave={cacheStores} />
    <Route path="/doctor" component={DoctorProfile} onEnter={authCheck} onLeave={cacheStores} />
    <Route path="/invite" component={InviteUsers} onEnter={authCheck} onLeave={cacheStores} />
    <Route path="/email-templates/GettingStarted" component={EmailGettingStarted} />
    <Route path="/email-templates/HealthEventNotification" component={HealthEventNotificationEmail} onEnter={authCheck} />
  </Router>
);

export default routes;
