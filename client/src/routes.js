import React from 'react';
import { Router, Route, hashHistory } from 'react-router'
import Home from './components/pages/Home.jsx'
import Charts from './components/pages/Charts.jsx'
import Telesession from './components/pages/Telesession.jsx'
import PatientProfile from './components/pages/doctor/DoctorProfile'
import DoctorProfile from './components/pages/patient/PatientProfile'

var routes = (
  <Router history={hashHistory}>
    <Route path="/" component={Home} />
    <Route path="/charts" component={Charts} />
    <Route path="/telesession" component={Telesession} />
    <Route path="/patient" component={PatientProfile} />
    <Route path="/me" component={PatientProfile} />
    <Route path="/doctor" component={DoctorProfile} />

  </Router>
);

export default routes;
