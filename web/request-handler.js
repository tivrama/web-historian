var fs = require('fs');
var path = require('path');
var archive = require('../helpers/archive-helpers');
var urlParser = require('url');
var utils = require('./http-helpers');
// require more modules/folders here!

var actions = {

  "GET": function(req, res){
    //parse request url using imported parser
    var parts = urlParser.parse(req.url);
    var urlPath = parts.pathname === '/' ? '/index.html' : parts.pathname;
    //serveAssets is not yet built
    utils.serveAssets(res, urlPath, function() { archive.isUrlInList(urlPath.slice(1), function(found) {
        if (found) {
          utils.sendRedirect(res, '/loading.html');
        } else {
          utils.send404(res);
        }
      });
    });
  }, 

  "POST": function(req, res){
    utils.collectData(req, function(data){
      var url = data.split('=')[1];
    console.log('calling archived!!!!!: ', req.url);

      archive.isUrlInList(url, function(found) {
        if (found) {
          archive.isUrlArchived(url, function(found) {
            if (found) {
              utils.sendRedirect(res, '/'+url);
            } else {
              utils.sendRedirect(res, '/loading.html');
            }
          });
        } else {
          utils.addUrlToList(url, function() {utils.sendRedirect(res, '/loading.html');

          });
        }
      });
    });
  },

  "OPTIONS": function(req, res){

  }
};

// exports.handleRequest = function (req, res) {
//   var action = actions[req.method];
//   if ( action ) {
//     action(req, res);
//   } else {
//     utils.sendResponse(res, "Not Found", 404);
//   }
// };

  exports.handleRequest = function (req, res) {
  var handler = actions[req.method];

  if (handler) {
    handler(req, res);
  } else {
    helpers.send404(response);
  }
};


