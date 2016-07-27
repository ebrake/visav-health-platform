import React from "react";
import Router from "react-router";
import ReactDOMServer from 'react-dom/server'
import Home from '../../client/src/components/Home'
import routes from '../../client/src/routes'
import cons from 'consolidate'
import loopback from 'loopback'
module.exports = function routes(app) {
  app.engine("html", cons.handlebars);
  app.set("view engine", "html");
  app.set("views", "public/views");
  app.use(loopback.static("client/build"));

  app.get("/", function (req, res) {
    let AppFactory = React.createFactory(Home);
    const html = ReactDOMServer.renderToString(AppFactory({}));
    console.log('HTML:\n\n\n\n ' + html);
    res.render("index", {
      markup: html,
    });
    
  });
}