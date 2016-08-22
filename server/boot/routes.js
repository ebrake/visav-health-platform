import React from "react";
import Router from "react-router";
import ReactDOMServer from 'react-dom/server'
import loopback from 'loopback'
import System from 'systemjs'
import Path from 'path'

const clientDir = (process.env.NODE_ENV!=="development" ? "client-dist" : "client")

module.exports = function routes(app) {

  app.use(loopback.static(clientDir+"/build"));

  app.use(function(req, res) {
    res.sendFile(Path.join(__dirname, '../', '../', clientDir, 'build', 'index.html'));
  });

}
