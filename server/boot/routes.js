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

  //add 'user' to loopback.context()
  app.use(loopback.context());
  app.use(loopback.token());
  app.use(function setCurrentUser(req, res, next) {
    if (!req.accessToken) {
      console.log("This is dumb")
      return next();
    }
    app.models.Person.findById(req.accessToken.userId, function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(new Error('No user with this access token was found.'));
      }
      var loopbackContext = loopback.getCurrentContext();
      if (loopbackContext) {
        loopbackContext.set('user', user);
      }
      next();
    });
  }); 

  app.get("/", function (req, res) {
    let HomeFactory = React.createFactory(Home);
    const html = ReactDOMServer.renderToString(HomeFactory({}));
    res.render("index", {
      markup: html,
      clientDir: clientDir
    });
  });
}
