'use strict';

var clusterflock  = require('clusterflock');
var express       = require('express');
var path          = require('path');
var bouncer       = require('./lib/bouncer');
var cookieSession = require('./lib/cookie-session');
var api           = require('./lib/api');

module.exports = function(app, options) {
  var defaultOptions = {
    startServer: true,
    publicDir  : path.join(process.cwd(), 'public')
  };

  options || (options = {});

  if (typeof app === 'object') {
    options = app;
    app     = null;
  }

  for (var key in defaultOptions) {
    if (!options.hasOwnProperty(key)) {
      options[key] = defaultOptions[key];
    }
  }

  if (!app) {
    app = express();
  }

  app.use(express.cookieParser(process.env.COOKIE_SECRET));
  app.use(cookieSession);
  bouncer(app);
  app.use(express.favicon());
  app.use(express.csrf());
  app.use(express.static(options.publicDir));

  app.get('/api/*', api.api);
  app.post('/api/*', api.api);
  app.put('/api/*', api.api);
  app.delete('/api/*', api.api);

  if (options.startServer) {
    clusterflock(app);
  }
};
