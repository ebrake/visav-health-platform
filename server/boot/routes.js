import React from "react";
import Router from "react-router";
import ReactDOMServer from 'react-dom/server'

var System = require('es6-module-loader').System;

const clientDir = (process.env.NODE_ENV=="production" ? "client-dist" : "client")

System.import('../../'+clientDir+'/src/components/Home.jsx').then(function(m) {

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

  app.get("/", function (req, res) {
    let HomeFactory = React.createFactory(Home);
    const html = ReactDOMServer.renderToString(HomeFactory({}));
    res.render("index", {
      markup: html,
    });
  });
}
