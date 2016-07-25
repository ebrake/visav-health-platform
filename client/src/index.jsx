import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import {polyfill} from 'es6-promise';
polyfill();
import 'whatwg-fetch';

//Loopback config
import { config } from 'react-loopback';
config.set('baseUrl', 'http://localhost:4000/api/');
config.set('access_token', 'I_AM_AN_ACCESS_TOKEN');

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
