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
config.set('AWS_MQTT_ACCESS_KEY', 'AKIAJMXV7C4RR4AVLVUQ');
config.set('AWS_MQTT_ENDPOINT_ADDRESS', 'azf5xkj2sjl2t.iot.us-west-2.amazonaws.com');
config.set('AWS_MQTT_REGION', 'us-west-2');
config.set('AWS_MQTT_SECRET_KEY', 'TSH+vYw23VxKS4e3SA0xg6D3i/APycasjSokIbkn');

//CSS imports
import './css/alert.css';
import './css/banner.css';
import './css/base.css';
import './css/button.css';
import './css/colors.css';
import './css/charts.css';
import './css/dropdown.css';
import './css/flex.css';
import './css/forms.css';
import './css/inputs.css';
import './css/header.css';
import './css/media.css';
import './css/nav.css';
import './css/panel.css';
import './css/Account.css';
import './css/Example.css';
import './css/InfoList.css';
import './css/InviteUsers.css';
import './css/Logo.css';
import './css/PatientInfoPanels.css';
import './css/People.css';
import './css/SegmentedControl.css'
import './css/Telesession.css';
import 'font-awesome/css/font-awesome.css';

//import main app component
import App from './components/App.jsx';


ReactDOM.render(
  <App />,
  document.getElementById('root')
);
