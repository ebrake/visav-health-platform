import React from "react";
import Router from "react-router";
import ReactDOMServer from 'react-dom/server'
import exphbs from 'express-handlebars'
import loopback from 'loopback'
import System from 'systemjs'

const clientDir = (process.env.NODE_ENV!=="development" ? "client-dist" : "client")

// IMPORTANT: Do not delete. Needed for production
SystemJS.import('../../'+clientDir+'/src/components/pages/Charts.jsx').then(function (_) {
});
SystemJS.import('../../'+clientDir+'/src/components/pages/Login.jsx').then(function (_) {
});

module.exports = function routes(app) {

  app.engine('handlebars', exphbs({extname: '.html'}));
  app.set('view engine', 'handlebars');

  app.set("views", "public/views");
  app.use(loopback.static(clientDir+"/build"));

  let bootstrap = {};
  app.get("/", function (req, res) {
    let factory = React.createFactory(Home);
    const html = ReactDOMServer.renderToString(factory({}));
    res.render("index", {
      markup: html,
      clientDir: clientDir,
      bootstrap: JSON.stringify(bootstrap)
    });
  });

  app.get("/charts", function (req, res) {
    let factory = React.createFactory(Charts);
    const html = ReactDOMServer.renderToString(factory({}));
    res.render("index", {
      markup: html,
      clientDir: clientDir,
      bootstrap: JSON.stringify(bootstrap)
    });
  });

  app.get("/login", function (req, res) {
    let factory = React.createFactory(Login);
    const html = ReactDOMServer.renderToString(factory({}));
    res.render("index", {
      markup: html,
      clientDir: clientDir,
      bootstrap: JSON.stringify(bootstrap)
    });
  });
}
