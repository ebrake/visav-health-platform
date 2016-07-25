import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import {polyfill} from 'es6-promise';
polyfill();
import 'whatwg-fetch';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
