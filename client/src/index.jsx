//dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import {polyfill} from 'es6-promise';

polyfill();
import 'whatwg-fetch';
//All our headers need the accessToken attached as Authorization if it is there
global.Header = function(args) {
  args = args || {};
  args['Authorization'] = localStorage.getItem('accessToken') || undefined;
  return args;
}

//Loopback config
import { config } from 'react-loopback';
config.set('baseUrl', process.env.API_ROOT + 'api/');
config.set('access_token', 'I_AM_AN_ACCESS_TOKEN');
config.set('OPENTOK_API_KEY', '45631802');

//CSS imports
import './css/base.css';
import './css/button.css';
import './css/colors.css';
import './css/Accounts.css';
import './css/App.css';
import './css/SegmentedControl.css'
import './css/Telesession.css';
import './css/header.css';
import './css/nav.css';
import './css/charts.css';
import './css/panel.css';
import './css/media.css';
import './css/flex.css';
//import main app component
import App from './components/App.jsx';


ReactDOM.render(
  <App />,
  document.getElementById('root')
);
