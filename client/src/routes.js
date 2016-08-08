import React from 'react';
import { Router, Route, hashHistory } from 'react-router'
import Home from './components/pages/Home.jsx'
import Charts from './components/pages/Charts.jsx'
import Telesession from './components/pages/Telesession.jsx'
import Profile from './components/pages/Profile'
var routes = (
  <Router history={hashHistory}>
    <Route path="/" component={Home} />
    <Route path="/charts" component={Charts} />
    <Route path="/telesession" component={Telesession} />
    <Route path="/profile" component={Profile} />
    <Route path="/me" component={Profile} />
  </Router>
);

export default routes;
