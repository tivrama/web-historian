var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');


exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.sendResponse = function(res, data, method) {
  // console.log('test sendResponse', data);
  method = method || 200;
  res.writeHead(method, archive.headers);
  res.end(data);
};

//takes request returns page info.
exports.collectData = function(request, callback) {
  var data = '';
  request.on('data', function(chunk) {
    data += chunk;
  });
  request.on('end', function() {
    callback(data);
  })
};


exports.send404 = function(response){
  exports.sendResponse(response, '404: Page not found', 404);
};

exports.serveAssets = function(res, asset, callback) {
  var encoding = {encoding: 'utf8'};

   fs.readFile( archive.paths.siteAssets + asset, encoding, function(err, data){
    if(err){
      // file doesn't exist in public!
      fs.readFile( archive.paths.archivedSites + asset, encoding, function(err, data){
        if(err){
          // file doesn't exist in archive!
          callback ? callback() : exports.send404(res);
        } else {
          exports.sendResponse(res, data);
        }
      });
    } else {
      exports.sendResponse(res, data);
    }
  }) 

};

exports.sendResponse = function(response, obj, status){
  status = status || 200;
  response.writeHead(status, headers);
  response.end(obj);
};

exports.collectData = function(request, callback){
  var data = "";
  request.on("data", function(chunk){
    data += chunk;
  });
  request.on("end", function(){
    data = data.slice(4); // start of ugly hack so that this works for built in tests and normal use of app
    data = JSON.stringify(data);
    callback(data);
  });
};


exports.sendRedirect = function(response, location, status){
  status = status || 302;
  response.writeHead(status, {Location: location});
  response.end();
};
