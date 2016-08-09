import React from "react";
import Router from "react-router";
import ReactDOMServer from 'react-dom/server'
import Charts from '../../client/src/components/pages/Charts.jsx'
import Login from '../../client/src/components/pages/Login.jsx'
var System = require('es6-module-loader').System;

const clientDir = (process.env.NODE_ENV=="production" ? "client-dist" : "client")


System.import('../../'+clientDir+'/src/components/Home.jsx').then(function(m) {

});

System.import('../../'+clientDir+'/src/components/Charts.jsx').then(function(m) {

});

System.import('../../'+clientDir+'/src/routes').then(function(m) {

});

import cons from 'consolidate'
import loopback from 'loopback'

module.exports = function routes(app) {
  app.engine("html", cons.handlebars);
  app.set("view engine", "html");
  app.set("views", "public/views");
  app.use(loopback.static(clientDir+"/build"));

  let bootstrap = {};
  app.get("/", function (req, res) {
    let factory = React.createFactory(Home);
    const html = ReactDOMServer.renderToString(factory({}));
    res.render("index", {
      markup: html,
      clientDir: 'client',
      bootstrap: JSON.stringify(bootstrap)
    });
  });

  app.get("/charts", function (req, res) {
    let factory = React.createFactory(Charts);
    const html = ReactDOMServer.renderToString(factory({}));
    res.render("index", {
      markup: html,
      clientDir: 'client',
      bootstrap: JSON.stringify(bootstrap)
    });
  });

  app.get("/login", function (req, res) {
    let factory = React.createFactory(Login);
    const html = ReactDOMServer.renderToString(factory({}));
    res.render("index", {
      markup: html,
      clientDir: 'client',
      bootstrap: JSON.stringify(bootstrap)
    });
  });
}
