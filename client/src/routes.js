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
import SetPassword from './components/pages/SetPassword.jsx'

import AccountSettings from './components/pages/AccountSettings.jsx'
import InviteUsers from './components/pages/InviteUsers.jsx'
import LiveSocket from './components/pages/LiveSocket.jsx'
import EmailGettingStarted from './components/email-templates/GettingStartedEmail'
import HealthEventNotificationEmail from './components/email-templates/HealthEventNotificationEmail'
import PasswordResetEmail from './components/email-templates/PasswordResetEmail'
import InvitedUserEmail from './components/email-templates/InvitedUserEmail';

import Roles from './components/utils/Roles';


var cacheStores = () => {
  let snapshot = alt.takeSnapshot();
  localStorage.setItem('snapshot', snapshot);
}

//onLeave handles redirects, unload eventListener handles refreshes
window.addEventListener('unload', cacheStores);

var getNextStateRoles = (nextState) => {
  console.dir(nextState);

  let nextRoute = nextState.routes[0];
  if (!nextRoute || !nextRoute.isAllowed) {
    return Roles.getRoles();
  } else {
    return nextRoute.isAllowed;
  }
}

var authCheck = (nextState, replace) => {
  let snapshot = localStorage.getItem('snapshot');
  alt.bootstrap(snapshot);

  let state = AccountStore.getState();
  if (!state.user) {
    console.log('Not logged in... redirecting...');
    replace('/login');
  }
  else{
    AccountActions.getPeople()
    .then(function(response){
      console.log('RESPONSE:');
      console.dir(response);
    });
  }

  let role = state.user.role ? state.user.role.name : undefined;
  let rolesForNextState = getNextStateRoles(nextState);
  console.log('Allowed roles for next state:')
  console.dir(rolesForNextState);
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
    <Route path="/resetPassword" component={SetPassword} onLeave={cacheStores} />
    { /* AUTHENTICATED PAGES */ }
    <Route path="/me" component={Telesession} onEnter={authCheck} onLeave={cacheStores} />
    <Route path="/telesession" component={Telesession} onEnter={authCheck} onLeave={cacheStores} />
    <Route path="/patient" component={PatientProfile} onEnter={authCheck} onLeave={cacheStores} />
    <Route path="/doctor" component={DoctorProfile} onEnter={authCheck} onLeave={cacheStores} />
    <Route path="/account" component={AccountSettings} onEnter={authCheck} onLeave={cacheStores} />
    <Route path="/invite" component={InviteUsers} onEnter={authCheck} onLeave={cacheStores} />
    <Route path="/liveSocket" component={LiveSocket} onEnter={authCheck} onLeave={cacheStores} />
    { /* EMAIL TEMPLATES */ }
    <Route path="/email-templates/GettingStarted" component={EmailGettingStarted} />
    <Route path="/email-templates/HealthEventNotification" component={HealthEventNotificationEmail} />
    <Route path="/email-templates/PasswordResetEmail" component={PasswordResetEmail} />
    <Route path="/email-templates/InvitedUserEmail" component={InvitedUserEmail} />
  </Router>
);

export default routes;
