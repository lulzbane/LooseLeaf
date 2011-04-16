/*
 * LooseLeaf: Lightweight blogging engine for node.js
 * http://looseleafjs.org/
 */

/* Load modules */
var fs = require('fs'),
  express = require('express'),
  form = require('connect-form'),
  join = require('path').join;

/* Define constants */
var VERSION = require('./package').version();

/* Create looseleaf server */
module.exports.init = function(siteDir) {

  /* Create express server */
  var app = express.createServer();

  /* Load JSON files */
  var conf = require('./conf').get(siteDir);

  /* Configure app */
  app.configure(function() {
  
    // Combined Log Format
    app.use(express.logger({ format: ':remote-addr - - [:date] ":method :url HTTP/:http-version" :status :response-time ":referrer" ":user-agent"' }));

    // For uploading files
    app.use(form({ keepExtensions: true }));

    // Set view directory
    app.set('views', join(siteDir, 'views'));  
    // Set templete engine
    app.set('view engine', 'ejs');

    // For session support
    app.use(express.cookieParser());
    app.use(express.session({secret: 'looseleafjs'}));

    // Parse HTTP
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    // session.regenerate() error occurs
    //  app.use(app.router);

    // Set static directory
    app.use(express.static(join(siteDir, 'public')));
  });

  // development mode(Default)
  app.configure('development', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  });

  // production mode($ NODE_ENV=production node app.js)
  app.configure('production', function() {
    app.use(express.errorHandler()); 
  });

/*
  app.error(function(err, req, res, next) {
    // Errorのクラス見て
    console.log('[app.err]' + err);
    res.send(err.toString());
  });
*/
  /* Init entry */
  var blog = require('./blog').init(siteDir);
  
  /* Route */
//  require('./public').set(app, blog);
  require('./public').set(app, siteDir, blog);


  // Global variables for view
  app.dynamicHelpers({
    req: function(req, res) {
      return req;
    },
    site: function(req, res) {
      return conf.site;
    },
    copyright: function(req, res) {
      return conf.copyright;
    },
    globalNavi: function(req, res) {
      return conf.globalNavi;
    },
    sidebar: function(req, res) {
      return conf.sidebar;
    },
    version: function(req, res) {
      return conf.version;
    },
    categories: function(req, res) {
      return blog.categories;
    },
    tags: function(req, res) {
      return blog.tags;
    },
    recent: function(req, res) {
      return blog.entry.recent();
    }
  });

  /* Return to app.js */
  return {
    app: app,
    conf: conf
  };
};