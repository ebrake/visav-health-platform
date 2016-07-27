import React from "react";
import Router from "react-router";
import reactRoutes from "../../client/routes";
import ReactDOMServer from "react-dom/server";
import App from '../../client/src/components/App'
module.exports = function routes(server) {
  app.set('views', '/public/views');
  app.get("/", function (req, res) {

    const html = ReactDOMServer.renderToString(App);
    res.render("index", {
      markup: html,
    });
    
  });
}