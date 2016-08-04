import React from 'react';
import { Router, Route, hashHistory } from 'react-router'
import Home from './components/Home.jsx'
import Telesession from './components/Telesession.jsx'

var routes = (
  <Router history={hashHistory}>
    <Route path="/" component={Home} />
    <Route path="/telesession" component={Telesession} />
    </Router>
);

export default routes;
