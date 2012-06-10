
var static = require('node-static')
var files = new static.Server('../files', {cache:360000})

var http = require('http')
var server = new http.Server

server.addListener('request', function(req, res) {
  return files.serve(req, res)
})

server.listen(8080)
