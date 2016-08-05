//dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import {polyfill} from 'es6-promise';
polyfill();
import 'whatwg-fetch';

//Loopback config
import { config } from 'react-loopback';
config.set('baseUrl', 'http://localhost:4000/api/');
config.set('access_token', 'I_AM_AN_ACCESS_TOKEN');

//CSS imports
import './css/base.css';
import './css/App.css';
import './css/SegmentedControl.css'

//import main app component
import App from './components/App.jsx';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
